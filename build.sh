#!/bin/sh
# Packages the extension into dist/ as one zip per browser:
#   symbol-writer-<version>-firefox.zip  -> addons.mozilla.org
#   symbol-writer-<version>-chrome.zip   -> Chrome Web Store
# manifest.json in this folder declares both background types so the folder
# loads unpacked in either browser; each zip keeps only the one its browser uses.
set -e
cd "$(dirname "$0")"
VERSION=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' manifest.json)
FILES="background.js content.js symbols.js popup.html popup.css popup.js icons"
mkdir -p dist

build() {
  browser=$1
  out="dist/symbol-writer-$VERSION-$browser.zip"
  tmp=$(mktemp -d)
  cp -R $FILES "$tmp"
  python3 - "$browser" > "$tmp/manifest.json" <<'EOF'
import json, sys
m = json.load(open("manifest.json"))
if sys.argv[1] == "firefox":
    m["background"] = {"scripts": m["background"]["scripts"]}
else:
    m["background"] = {"service_worker": m["background"]["service_worker"]}
    del m["browser_specific_settings"]
print(json.dumps(m, indent=2, ensure_ascii=False))
EOF
  rm -f "$out"
  (cd "$tmp" && zip -qr - manifest.json $FILES) > "$out"
  rm -rf "$tmp"
  echo "Built $out"
}

build firefox
build chrome
