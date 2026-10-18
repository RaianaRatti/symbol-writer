#!/bin/sh
# Packages the extension into dist/ as a zip you can upload to
# addons.mozilla.org (Firefox) or the Chrome Web Store.
set -e
cd "$(dirname "$0")"
VERSION=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' manifest.json)
mkdir -p dist
rm -f "dist/symbol-writer-$VERSION.zip"
zip -qr "dist/symbol-writer-$VERSION.zip" manifest.json background.js content.js symbols.js popup.html popup.css popup.js icons
echo "Built dist/symbol-writer-$VERSION.zip"
