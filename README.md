# Symbol Writer

Symbol Writer is a Firefox and Chrome extension that turns Google Docs equation shortcuts into real symbols as you type. It works in any text box on any website: Google Docs, Google Slides, Gmail, notes apps, rich-text editors, comment boxes and search bars.

## Demo
https://github.com/user-attachments/assets/116956bc-8020-4c9e-a902-1db4222f6a36

## Installation

### Firefox

1. Go to the [latest release](https://github.com/RaianaRatti/symbol-writer/releases/latest).
2. Click `symbol-writer-<version>.xpi`.
3. Firefox asks whether to add Symbol Writer. Click **Add**.

The add-on is signed by Mozilla, so it stays installed after restarting Firefox.

### Firefox (temporary, for development)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and choose `manifest.json` in this folder.

The add-on stays loaded until you restart Firefox.

### Chrome

1. Download `symbol-writer-<version>-chrome.zip` from the [latest release](https://github.com/RaianaRatti/symbol-writer/releases/latest) and unzip it (or clone this repo).
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and choose the unzipped folder.

For the Chrome Web Store, run `./build.sh` and upload `dist/symbol-writer-<version>-chrome.zip`.

## Usage

Type a shortcut, then press **Space**:

| You type | You get |
|---|---|
| `/alpha` or `\alpha` | α |
| `\leq`, `/Rightarrow`, `/infty` | ≤, ⇒, ∞ |
| `v/vec` | v⃗ (accent goes on the character before it) |
| `/vec AB` | A⃗B⃗ (an arrow appears right away; every letter or number you type goes under it until you press Space or type punctuation) |

Shortcut names come from https://equation-shortcuts.notuom.com/ and are case-sensitive (`/pi` → π, `/Pi` → Π). The full list is in the popup (click any symbol to copy it) and in `symbols.js`.

### Controls

- Click the toolbar icon to turn it on or off, choose which prefixes (`/`, `\`) work, and search the shortcut list.
- **Alt+Shift+S** toggles it on or off. The badge shows ON/OFF. To change the key, go to `chrome://extensions/shortcuts` in Chrome, or `about:addons` → gear icon → **Manage Extension Shortcuts** in Firefox.
- Undo (Cmd/Ctrl+Z) right after a replacement brings the shortcut text back (in regular text boxes).
- With the `/` prefix, a slash right after a letter or number is left alone, so `and/or` and URLs aren't touched. Use `\` when you want a symbol glued to a word (`2\pi` → 2π).

### Notes

- Accents are Unicode combining marks, so how they look depends on the font. Bars and hats look right in most fonts. The vector arrow only sits on top of the letter in fonts like **STIX Two Text** (free on Google Fonts and in Google Docs under Font → More fonts). In Arial and most other fonts it appears next to the letter. For a real single arrow spanning several letters in Google Docs, use Insert → Equation and type `\vec`.

- Browsers don't let extensions run on their own pages (`about:`, `chrome://`, the add-on stores), or in apps outside the browser like Apple Notes or desktop Word.
- If the popup says it doesn't have access to websites, click **Allow on all sites** (Firefox lets you turn this off per add-on).
- In the Google Docs **equation editor**, Docs already handles `\` shortcuts. If the `\` prefix gets in the way there (e.g. `\frac`, `\vec`), untick `\` in the popup and use `/` for normal text.
- Structural shortcuts (`\frac`, `\sqrt` with a box, `\sum` with limits, subscripts) have no single-character form, so only their symbol is typed (e.g. `/sqrt` → √) or they're skipped.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### Releasing

1. Bump `version` in `manifest.json` (Mozilla won't sign the same version twice) and push.
2. Create a GitHub release with a tag that matches the version, e.g. `v1.0.1`.
3. The [Build and Release](.github/workflows/build.yml) workflow builds the extension, gets the `.xpi` signed by addons.mozilla.org, and attaches the `.xpi` and the Chrome zip to the release.

The workflow needs two repository secrets, `AMO_JWT_ISSUER` and `AMO_JWT_SECRET`, from https://addons.mozilla.org/developers/addon/api/key/.

## License

[MIT](LICENSE)
