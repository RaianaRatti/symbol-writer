# Symbol Writer

A browser extension that turns Google Docs equation shortcuts into real symbols as you type. Type `/alpha` or `\alpha`, press Space, and it becomes α, in any text box on any website.

Useful for things like writing math and science notes in Google Docs, Slides, Gmail or a notes app without opening an equation editor or hunting for symbols to copy and paste.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [How it works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Limitations](#limitations)
- [Development](#development)
- [License](#license)

## Demo

https://github.com/user-attachments/assets/116956bc-8020-4c9e-a902-1db4222f6a36

## Features

- Works in any text box on any website, including Google Docs, Google Slides, Gmail, notes apps, rich-text editors, comment boxes and search bars.
- Uses the same shortcut names as the Google Docs equation editor (from equation-shortcuts.notuom.com). Names are case-sensitive, so `/pi` → π and `/Pi` → Π.
- Accents like `/vec`, `/bar` and `/hat` go on the character before them (`v/vec` → v⃗) or on the characters you type next (`/vec AB` → A⃗B⃗).
- Leaves normal slashes alone, so `and/or` and URLs aren't touched. Use `\` to attach a symbol to a word (`2\pi` → 2π).
- Undo (Cmd/Ctrl+Z) right after a replacement brings the shortcut text back in regular text boxes.
- Runs entirely locally. No data leaves your machine.

## How it works

A content script runs in every page and frame and watches what you type. When you press Space after a shortcut, it looks up the name in `symbols.js` and replaces the shortcut with its symbol. Google Docs and Slides draw text on a canvas, so the text before the cursor can't be read there. On those sites the script remembers your recent keystrokes and sends Backspace and key events to Docs to make the edit. Your settings are stored with the browser's sync storage and shared with the popup and the background script, which updates the ON/OFF badge.

## Installation

1. Go to the Releases page of this repo and download the latest version.

2. Install it:
    - **Firefox:** click `symbol-writer-<version>.xpi` and click **Add** when Firefox asks. It's signed by Mozilla, so it stays installed after restarting Firefox.
    - **Chrome / Chromium-based browsers:** download `symbol-writer-<version>-chrome.zip` and unzip it. Go to `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the unzipped folder.

## Usage

1. Click into any text box.
2. Type a shortcut, then press **Space**:
    - `/alpha` or `\alpha` → α
    - `\leq`, `/Rightarrow`, `/infty` → ≤, ⇒, ∞
    - `v/vec` → v⃗
    - `/vec AB` → A⃗B⃗ (letters and numbers go under the arrow until you press Space or type punctuation)
3. Click the extension icon to open the popup, where you can:
    - Turn it on or off
    - Choose which prefixes (`/`, `\`) work
    - Keep the space after the symbol
    - Search the full shortcut list and click any symbol to copy it
4. Press **Alt+Shift+S** to turn it on or off from the keyboard. The badge shows ON/OFF. To change the key, go to `chrome://extensions/shortcuts` in Chrome, or `about:addons` → gear icon → **Manage Extension Shortcuts** in Firefox.

If the popup says it doesn't have access to websites, click **Allow on all sites**.

## Limitations

- Browsers don't let extensions run on their own pages (`about:`, `chrome://`, the add-on stores), or in apps outside the browser like Apple Notes or desktop Word.
- Accents are Unicode combining marks, so how they look depends on the font. Bars and hats look right in most fonts, but the vector arrow only sits on top of the letter in fonts like **STIX Two Text** (in Google Docs under Font → More fonts). For one arrow spanning several letters in Google Docs, use Insert → Equation and type `\vec`.
- Structural shortcuts (`\frac`, `\sqrt` with a box, `\sum` with limits, subscripts) have no single-character form, so only their symbol is typed (`/sqrt` → √) or they're skipped.
- In the Google Docs equation editor, Docs already handles `\` shortcuts. If they clash, untick `\` in the popup and use `/` for normal text.

## Development

```bash
git clone https://github.com/RaianaRatti/symbol-writer.git
cd symbol-writer
./build.sh   # builds dist/symbol-writer-<version>-firefox.zip and -chrome.zip
```

- **Firefox:** go to `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, and select `manifest.json`. This is cleared on restart.
- **Chrome:** go to `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select this folder.

To release, bump `version` in `manifest.json`, push, and create a GitHub release with a matching tag (e.g. `v1.0.1`). The release workflow signs the `.xpi` with Mozilla and attaches it and the Chrome zip to the release. It needs the repository secrets `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` from your addons.mozilla.org API keys page.

## License

MIT
