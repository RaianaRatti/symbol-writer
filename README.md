# Symbol Writer

A Firefox and Chrome extension that turns Google Docs equation shortcuts into real symbols as you type.

- Works in any text box on any website: Google Docs, Slides, Gmail, notes apps, comment boxes, search bars
- Type a shortcut like `/alpha`, press **Space**, and it becomes α

## Demo

https://github.com/user-attachments/assets/116956bc-8020-4c9e-a902-1db4222f6a36

## Installation

Download the files from the **Releases** page of this repo: https://github.com/RaianaRatti/symbol-writer/releases/latest

### Firefox

- Click `symbol-writer-<version>.xpi` on the Releases page
- When Firefox asks to add Symbol Writer, click **Add**
- It's signed by Mozilla, so it stays installed after restarting Firefox

### Chrome

- Download `symbol-writer-<version>-chrome.zip` and unzip it
- Open `chrome://extensions` and turn on **Developer mode**
- Click **Load unpacked** and choose the unzipped folder

## Usage

Type a shortcut, then press **Space**:

- `/alpha` or `\alpha` → α
- `\leq`, `/Rightarrow`, `/infty` → ≤, ⇒, ∞
- `v/vec` → v⃗ (the accent goes on the character before it)
- `/vec AB` → A⃗B⃗ (every letter or number you type goes under the arrow until you press Space or type punctuation)

Shortcuts:

- Names come from equation-shortcuts.notuom.com
- They're case-sensitive: `/pi` → π, `/Pi` → Π
- The full list is in the popup (click a symbol to copy it) and in `symbols.js`

### Controls

- **Toolbar icon:** turn it on or off, choose which prefixes (`/`, `\`) work, and search the shortcut list
- **Alt+Shift+S:** toggle on or off (the badge shows ON/OFF)
  - Chrome: change the key at `chrome://extensions/shortcuts`
  - Firefox: `about:addons` → gear icon → **Manage Extension Shortcuts**
- **Cmd/Ctrl+Z:** right after a replacement, brings the shortcut text back
- **`/` vs `\`:** a `/` right after a letter or number is left alone, so `and/or` and URLs aren't touched. Use `\` to attach a symbol to a word (`2\pi` → 2π)

### Notes

- **Fonts:** accents are Unicode combining marks, so their look depends on the font
  - Bars and hats look right in most fonts
  - The vector arrow only sits on top of the letter in fonts like **STIX Two Text** (in Google Docs: Font → More fonts)
  - For one arrow spanning several letters in Google Docs, use Insert → Equation and type `\vec`
- **Where it can't run:** browser pages (`about:`, `chrome://`, add-on stores) and apps outside the browser like Apple Notes or desktop Word
- **No access to websites?** Click **Allow on all sites** in the popup
- **Google Docs equation editor:** Docs already handles `\` shortcuts there. If they clash, untick `\` in the popup and use `/`
- **Structural shortcuts** (`\frac`, `\sqrt` with a box, `\sum` with limits, subscripts) have no single-character form, so only their symbol is typed (`/sqrt` → √) or they're skipped

## Development

- **Load without installing (Firefox):** open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → choose `manifest.json` (lasts until Firefox restarts)
- **Load without installing (Chrome):** **Load unpacked** on this folder
- **Build the zips:** run `./build.sh` (outputs to `dist/`)

### Releasing

- Bump `version` in `manifest.json` and push (Mozilla won't sign the same version twice)
- Create a GitHub release with a matching tag, e.g. `v1.0.1`
- The GitHub workflow builds the extension, gets the `.xpi` signed by Mozilla, and attaches it and the Chrome zip to the release
- One-time setup: add the repo secrets `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` (from your addons.mozilla.org API keys page)

## Contributing

- Pull requests are welcome
- For major changes, please open an issue first to discuss what you'd like to change

## License

MIT, see `LICENSE`.
