#!/usr/bin/env bash

DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

if [ $MACOS ]; then
  PROFILES_DIR="$HOME/Library/Application Support/Firefox/Profiles/"
elif [ $LINUX ]; then
  exit 0
  PROFILES_DIR="$HOME/.mozilla/firefox/"
fi

PROFILE="lildude.default"
#PROFILE="897x8zng.gHacksTest"  # Debugging ghacks profile

PROFILE_PATH="$PROFILES_DIR/$PROFILE"
if [ ! -d "$PROFILE_PATH" ]; then
  mkdir -p "$PROFILE_PATH"
fi

info "Installing Firefox ghacks user.js and my overrides to $PROFILE_PATH"
link_file "$DOTFILES/firefox/user-overrides.js" "$PROFILE_PATH/user-overrides.js"
link_file "$DOTFILES/firefox/updater.sh" "$PROFILE_PATH/updater.sh"
"$DOTFILES/firefox/updater.sh" -p "$PROFILE_PATH" -u -s