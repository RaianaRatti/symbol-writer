# Symbol Writer

Symbol Writer is a Firefox and Chrome extension that turns Google Docs equation shortcuts into real symbols as you type. It works in any text box on any website: Google Docs, Google Slides, Gmail, notes apps, rich-text editors, comment boxes and search bars.

<video src="symbol-writer-demo.mov" controls muted width="100%"></video>

[Watch the demo video](symbol-writer-demo.mov) if it doesn't play above.

## Installation

### Firefox (temporary)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and choose `manifest.json` in this folder.

The add-on stays loaded until you restart Firefox.

### Firefox (permanent)

Firefox only installs signed add-ons permanently. Build the package:

```bash
./build.sh
```

Then upload `dist/symbol-writer-<version>-firefox.zip` at https://addons.mozilla.org/developers/addon/submit/. Choose **On your own** to get a signed `.xpi` you can install yourself, or **On this site** to publish it publicly.

### Chrome

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose this folder.

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

After a change, bump `version` in `manifest.json` and run `./build.sh` again before uploading.

## License

[MIT](LICENSE)
