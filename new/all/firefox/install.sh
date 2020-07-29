#!/usr/bin/env bash
set -euo pipefail

[ -n "${MIN:-}" ] && exit 0

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

if [ "$MACOS" ]; then
  PROFILES_DIR="$HOME/Library/Application Support/Firefox/Profiles/"
elif [ "$LINUX" ]; then
  PROFILES_DIR="$HOME/.mozilla/firefox/"
fi

PROFILE="lildude.default"
#PROFILE="897x8zng.gHacksTest"  # Debugging ghacks profile

PROFILE_PATH="$PROFILES_DIR/$PROFILE"
if [ ! -d "$PROFILE_PATH" ]; then
  mkdir -p "$PROFILE_PATH"
fi

info "Installing Firefox ghacks user.js and my overrides to $PROFILE_PATH"
ln -Ff -s  "$DIR/firefox/user-overrides.js" "$PROFILE_PATH/user-overrides.js"
ln -Ff -s  "$DIR/firefox/updater.sh" "$PROFILE_PATH/updater.sh"
"$DIR/firefox/updater.sh" -p "$PROFILE_PATH" -u -s