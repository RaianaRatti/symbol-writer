const DEFAULTS = { enabled: true, prefixes: ["/", "\\"], keepSpace: false };
const { list } = globalThis.SYMBOL_WRITER;

const $ = (id) => document.getElementById(id);
const enabledBox = $("enabled");
const slashBox = $("prefix-slash");
const backslashBox = $("prefix-backslash");
const keepSpaceBox = $("keepSpace");
let prefixes = DEFAULTS.prefixes;

chrome.storage.sync.get(DEFAULTS, (s) => {
  enabledBox.checked = s.enabled;
  keepSpaceBox.checked = s.keepSpace;
  prefixes = s.prefixes;
  slashBox.checked = prefixes.includes("/");
  backslashBox.checked = prefixes.includes("\\");
  render();
});

enabledBox.addEventListener("change", () => chrome.storage.sync.set({ enabled: enabledBox.checked }));
keepSpaceBox.addEventListener("change", () => chrome.storage.sync.set({ keepSpace: keepSpaceBox.checked }));

function savePrefixes() {
  prefixes = [slashBox.checked && "/", backslashBox.checked && "\\"].filter(Boolean);
  chrome.storage.sync.set({ prefixes });
  render();
}
slashBox.addEventListener("change", savePrefixes);
backslashBox.addEventListener("change", savePrefixes);

// Display an accent on a dotted circle so the combining mark is visible.
const display = (e) => (e.accent ? "◌" + e.symbol : e.symbol);

function render() {
  const q = $("search").value.trim().toLowerCase().replace(/^[\\/]/, "");
  const prefix = prefixes[0] || "/";
  const container = $("list");
  container.textContent = "";

  const groups = new Map();
  for (const e of list) {
    if (q && !e.name.toLowerCase().includes(q) && !e.group.toLowerCase().includes(q) && e.symbol !== q) continue;
    if (!groups.has(e.group)) groups.set(e.group, []);
    groups.get(e.group).push(e);
  }

  if (groups.size === 0) {
    container.innerHTML = '<div class="empty">No matching shortcuts</div>';
    return;
  }

  for (const [group, entries] of groups) {
    const h = document.createElement("h3");
    h.textContent = group;
    const grid = document.createElement("div");
    grid.className = "grid";
    for (const e of entries) {
      const btn = document.createElement("button");
      btn.className = "item";
      btn.title = `Click to copy ${e.accent ? "the mark" : e.symbol}`;
      btn.innerHTML = '<span class="sym"></span><span class="name"></span>';
      btn.querySelector(".sym").textContent = display(e);
      btn.querySelector(".name").textContent = prefix + e.name;
      btn.addEventListener("click", () => copy(e.symbol));
      grid.appendChild(btn);
    }
    container.append(h, grid);
  }
}

let toastTimer;
async function copy(text) {
  await navigator.clipboard.writeText(text);
  const toast = $("toast");
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 900);
}

$("search").addEventListener("input", render);

// Firefox lets users withhold website access from extensions; offer to grant it.
const ALL_SITES = { origins: ["<all_urls>"] };
async function checkAccess() {
  $("access").hidden = await chrome.permissions.contains(ALL_SITES);
}
$("grant").addEventListener("click", async () => {
  await chrome.permissions.request(ALL_SITES);
  checkAccess();
});
checkAccess();
