#!/usr/bin/env bash

export ZSH=$HOME/.dotfiles
# shellcheck source=bin/lib.sh
source "$ZSH/bin/lib.sh"

# Comment me out when finished testing
#PROFILE_DIR="$HOME/Library/Application Support/Firefox/Profiles/897x8zng.gHacksTest"

# Determine Firefox profile path - assumes we've kept the `.default` at the end of the path
if [ -z "$PROFILE_DIR" ]; then
  if [ -d "$HOME/Library/Application Support/Firefox/Profiles/" ]; then
    PROFILE_DIR=$(find "$HOME/Library/Application Support/Firefox/Profiles/" -type d -depth 1 -name "*.default" | head -1)
  else
    info "No default profile found. Starting Firefox to create one"
    /Applications/Firefox.app/Contents/MacOS/firefox-bin --headless
    exec "$0"
  fi
fi
info "Installing Firefox ghacks user.js and my overrides to $PROFILE_DIR"
ln -s "$ZSH/firefox/user-overrides.js" "$PROFILE_DIR/user-overrides.js"
ln -s "$ZSH/firefox/updater.sh" "$PROFILE_DIR/updater.sh"
"$ZSH/firefox/updater.sh" -p "$PROFILE_DIR" -u -s