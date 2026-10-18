// Symbol Writer content script.
// Type a shortcut like /alpha or \alpha followed by Space and it becomes α.

(function () {
  const { byName } = globalThis.SYMBOL_WRITER;

  const DEFAULTS = { enabled: true, prefixes: ["/", "\\"], keepSpace: false };
  let settings = { ...DEFAULTS };

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    settings = { ...DEFAULTS, ...stored };
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const [key, { newValue }] of Object.entries(changes)) {
      settings[key] = newValue;
    }
  });

  // ---------------------------------------------------------------------------
  // Matching
  // ---------------------------------------------------------------------------

  // Looks at the text right before the caret and decides what to replace.
  // Returns { deleteCount, insert, pendingMark } or null.
  function findMatch(textBefore) {
    const m = /([\\/])([A-Za-z]+)$/.exec(textBefore);
    if (!m) return null;
    const [whole, prefix, name] = m;
    if (!settings.prefixes.includes(prefix)) return null;
    const entry = byName[name];
    if (!entry) return null;

    const prev = textBefore.slice(m.index - 1, m.index);
    const deleteCount = whole.length;

    if (entry.accent) {
      // "v/vec " puts the mark on v; "/vec " puts it on the next typed char.
      if (prev && !/\s/.test(prev)) return { deleteCount, insert: entry.symbol };
      return { deleteCount, insert: "", pendingMark: entry.symbol };
    }

    // A slash right after a letter, digit or URL-ish character is probably a
    // normal slash ("and/or", "1/in", "https://x.com/in"), so leave it alone.
    if (prefix === "/" && prev && /[A-Za-z0-9/:.]/.test(prev)) return null;

    return {
      deleteCount,
      insert: entry.symbol + (settings.keepSpace ? " " : ""),
    };
  }

  function isPrintable(e) {
    return e.key.length === 1 && !e.ctrlKey && !e.metaKey;
  }

  function isModifierKey(key) {
    return ["Shift", "Control", "Alt", "Meta", "CapsLock", "AltGraph"].includes(key);
  }

  function isPlainSpace(e) {
    return e.key === " " && !e.ctrlKey && !e.metaKey && !e.altKey;
  }

  // ---------------------------------------------------------------------------
  // Google Docs / Slides
  //
  // Docs draws the document on a canvas and reads keystrokes from a hidden
  // contenteditable inside "docs-texteventtarget-iframe", so the text before
  // the caret can't be read. Instead we remember recent keystrokes, and edit
  // by sending synthetic Backspace / keypress events to that iframe.
  // ---------------------------------------------------------------------------

  const isDocs = location.hostname === "docs.google.com";

  function isDocsInputFrame() {
    try {
      return !!window.frameElement?.classList.contains("docs-texteventtarget-iframe");
    } catch {
      return false;
    }
  }

  // The copy of this script running inside the Docs input iframe stays idle;
  // the top frame handles it.
  if (isDocs && isDocsInputFrame()) return;

  function setUpDocs() {
    const attached = new WeakSet();
    let buffer = "";
    let pendingMark = null;

    const sendKey = (target, type, init) =>
      target.dispatchEvent(
        new KeyboardEvent(type, { bubbles: true, cancelable: true, ...init })
      );

    function docsBackspace(target, count) {
      const init = { key: "Backspace", code: "Backspace", keyCode: 8, which: 8 };
      for (let i = 0; i < count; i++) {
        sendKey(target, "keydown", init);
        sendKey(target, "keyup", init);
      }
    }

    function docsType(target, text) {
      for (const ch of text) {
        const c = ch.codePointAt(0);
        sendKey(target, "keypress", { key: ch, charCode: c, keyCode: c, which: c });
      }
    }

    function swallow(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    function onKeyDown(e, frameDoc) {
      if (!e.isTrusted) return; // ignore our own synthetic events
      if (!settings.enabled || e.isComposing) {
        buffer = "";
        pendingMark = null;
        return;
      }
      const target = frameDoc.activeElement || frameDoc.body;

      if (pendingMark) {
        if (isPrintable(e) && e.key !== " ") {
          swallow(e);
          docsType(target, e.key + pendingMark);
          buffer += e.key + pendingMark;
          pendingMark = null;
          return;
        }
        if (!isModifierKey(e.key)) pendingMark = null;
      }

      if (isPlainSpace(e)) {
        const match = findMatch(buffer);
        if (match) {
          swallow(e);
          docsBackspace(target, match.deleteCount);
          docsType(target, match.insert);
          buffer = buffer.slice(0, -match.deleteCount) + match.insert;
          pendingMark = match.pendingMark || null;
          return;
        }
      }

      if (isPrintable(e)) buffer = (buffer + e.key).slice(-64);
      else if (e.key === "Backspace" && !e.ctrlKey && !e.metaKey && !e.altKey)
        buffer = buffer.slice(0, -1);
      else if (!isModifierKey(e.key)) buffer = ""; // arrows, Enter, shortcuts...
    }

    function attach() {
      const iframe = document.querySelector("iframe.docs-texteventtarget-iframe");
      const win = iframe?.contentWindow;
      if (!win || attached.has(win)) return;
      let frameDoc;
      try {
        frameDoc = win.document;
      } catch {
        return;
      }
      attached.add(win);
      win.addEventListener("keydown", (e) => onKeyDown(e, frameDoc), true);
    }

    // Clicking somewhere else in the document moves the caret.
    document.addEventListener("mousedown", () => {
      buffer = "";
      pendingMark = null;
    }, true);

    attach();
    setInterval(attach, 1000);
  }

  // ---------------------------------------------------------------------------
  // Regular inputs, textareas and contenteditable elements
  // ---------------------------------------------------------------------------

  const TEXT_INPUT_TYPES = new Set(["text", "search", "url", "tel", ""]);

  function deepActiveElement() {
    let el = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    return el;
  }

  function isTextField(el) {
    if (el instanceof HTMLTextAreaElement) return true;
    return el instanceof HTMLInputElement && TEXT_INPUT_TYPES.has(el.type);
  }

  // Each "context" knows how to read the text before the caret and how to
  // replace the last `deleteCount` characters with new text.
  function fieldContext(el) {
    const pos = el.selectionStart;
    if (pos == null || pos !== el.selectionEnd) return null;
    return {
      textBefore: el.value.slice(0, pos),
      replace(deleteCount, text) {
        el.setSelectionRange(pos - deleteCount, pos);
        const ok = text
          ? document.execCommand("insertText", false, text)
          : document.execCommand("delete");
        if (!ok) {
          el.setRangeText(text, pos - deleteCount, pos, "end");
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }
      },
    };
  }

  function editableContext() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return null;
    let node = sel.focusNode;
    let offset = sel.focusOffset;
    if (node && node.nodeType !== Node.TEXT_NODE) {
      const prev = node.childNodes[offset - 1];
      if (!prev || prev.nodeType !== Node.TEXT_NODE) {
        // No text before the caret (e.g. empty editor): can only insert.
        return {
          textBefore: "",
          replace(deleteCount, text) {
            if (deleteCount === 0 && text) document.execCommand("insertText", false, text);
          },
        };
      }
      node = prev;
      offset = prev.data.length;
    }
    if (!node) return null;
    return {
      textBefore: node.data.slice(0, offset),
      replace(deleteCount, text) {
        sel.setBaseAndExtent(node, offset - deleteCount, node, offset);
        const ok = text
          ? document.execCommand("insertText", false, text)
          : document.execCommand("delete");
        if (!ok) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          if (text) {
            const t = document.createTextNode(text);
            range.insertNode(t);
            sel.setBaseAndExtent(t, t.length, t, t.length);
          }
        }
      },
    };
  }

  function currentContext() {
    const el = deepActiveElement();
    if (!el) return null;
    if (isTextField(el)) return fieldContext(el);
    if (el.isContentEditable) return editableContext();
    return null;
  }

  function setUpGeneric() {
    let pendingMark = null;

    window.addEventListener("keydown", (e) => {
      if (!e.isTrusted || !settings.enabled || e.isComposing) {
        pendingMark = null;
        return;
      }

      if (pendingMark) {
        if (isPrintable(e) && e.key !== " ") {
          const ctx = currentContext();
          if (ctx) {
            e.preventDefault();
            ctx.replace(0, e.key + pendingMark);
          }
          pendingMark = null;
          return;
        }
        if (!isModifierKey(e.key)) pendingMark = null;
      }

      if (!isPlainSpace(e)) return;
      const ctx = currentContext();
      if (!ctx) return;
      const match = findMatch(ctx.textBefore);
      if (!match) return;

      e.preventDefault();
      ctx.replace(match.deleteCount, match.insert);
      pendingMark = match.pendingMark || null;
    }, true);
  }

  if (isDocs && window === window.top) setUpDocs();
  setUpGeneric();
})();
