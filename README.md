# Symbol Writer

A Firefox and Chrome extension that turns Google Docs equation shortcuts into real symbols as you type, in any text box on any website: Google Docs, Google Slides, Gmail, Notion-style notes apps, rich-text editors, comment boxes and search bars.

Type a shortcut, then press **Space**:

| You type | You get |
|---|---|
| `/alpha` or `\alpha` | α |
| `\leq`, `/Rightarrow`, `/infty` | ≤, ⇒, ∞ |
| `v/vec` | v⃗ (accent goes on the character before it) |
| `/vec v` | v⃗ (or on the next character you type) |

Shortcut names come from https://equation-shortcuts.notuom.com/ and are case-sensitive (`/pi` → π, `/Pi` → Π). The full list is in the popup (click any symbol to copy it) and in `symbols.js`.

## Install

**Firefox (try it now, temporary):** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…**, and choose `manifest.json` in this folder. It stays until you restart Firefox.

**Firefox (permanent):** run `./build.sh`, then upload `dist/symbol-writer-<version>.zip` at https://addons.mozilla.org/developers/addon/submit/. Choose **On your own** to get a signed `.xpi` you can install yourself, or **On this site** to publish it publicly. Firefox only installs signed add-ons permanently.

**Chrome:** open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and choose this folder. The same zip can be uploaded to the Chrome Web Store.

After a change, bump `version` in `manifest.json` and run `./build.sh` again before uploading.

## Use

- Click the toolbar icon to turn it on/off, choose which prefixes (`/`, `\`) work, and search the shortcut list.
- **Alt+Shift+S** toggles it on/off (change at `chrome://extensions/shortcuts`, or in Firefox at `about:addons` → gear icon → **Manage Extension Shortcuts**). The badge shows ON/OFF.
- Undo (Cmd/Ctrl+Z) right after a replacement brings the shortcut text back (in regular text boxes).
- With the `/` prefix, a slash right after a letter or number is left alone, so `and/or` and URLs aren't touched. Use `\` when you want a symbol glued to a word (`2\pi` → 2π).

## Notes

- It works on any website, but browsers don't let extensions run on their own pages (`about:`, `chrome://`, the add-on stores), or in apps outside the browser like Apple Notes or desktop Word.
- If the popup says it doesn't have access to websites, click **Allow on all sites** (Firefox lets you turn this off per add-on).

- In the Google Docs **equation editor**, Docs already handles `\` shortcuts. If the `\` prefix gets in the way there (e.g. `\frac`, `\vec`), untick `\` in the popup and use `/` for normal text.
- Structural shortcuts (`\frac`, `\sqrt` with a box, `\sum` with limits, subscripts) have no single-character form, so only their symbol is typed (e.g. `/sqrt` → √) or they're skipped.
