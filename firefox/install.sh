#!/usr/bin/env bash

export ZSH=$HOME/.dotfiles
# shellcheck source=bin/lib.sh
source "$ZSH/bin/lib.sh"

# Determine Firefox profile path - assumes we've kept the `.default` at the end of the path
if [ -d "$HOME/Library/Application Support/Firefox/Profiles/" ]; then
  PROFILE_DIR=$(find "$HOME/Library/Application Support/Firefox/Profiles/" -type d -depth 1 -name "*.default" | head -1)
else
  info "No default profile found. Starting Firefox to create one"
  /Applications/Firefox.app/Contents/MacOS/firefox-bin --headless
  exec "$0"
fi
info "Installing Firefox ghacks user.js and my overrides"
"$ZSH/firefox/updater.sh" -p "$PROFILE_DIR" -u -s