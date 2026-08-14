#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROME_BIN="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUTPUT_DIR="$ROOT_DIR/docs/screenshots"
PROFILE_DIR="$(mktemp -d)"
trap 'rm -rf "$PROFILE_DIR"' EXIT
mkdir -p "$OUTPUT_DIR"
URL="file://$ROOT_DIR/dashboard/index.html"
"$CHROME_BIN" --headless=new --hide-scrollbars --allow-file-access-from-files --user-data-dir="$PROFILE_DIR/login" --window-size=1440,1000 --screenshot="$OUTPUT_DIR/login-terminal.png" "$URL"
"$CHROME_BIN" --headless=new --hide-scrollbars --allow-file-access-from-files --user-data-dir="$PROFILE_DIR/desktop" --window-size=1440,1100 --screenshot="$OUTPUT_DIR/security-cockpit.png" "$URL?demo=1&view=dashboard"
"$CHROME_BIN" --headless=new --hide-scrollbars --allow-file-access-from-files --user-data-dir="$PROFILE_DIR/mobile" --window-size=430,930 --screenshot="$OUTPUT_DIR/security-mobile.png" "$URL?demo=1&view=dashboard"
echo "Screenshots written to $OUTPUT_DIR"
