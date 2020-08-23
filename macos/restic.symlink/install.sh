#!/usr/bin/env bash
#
# restic
#
set -euo pipefail
DIR=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

if [ "$MACOS" ]; then
  info "Installing launchd job"
  if launchctl list local.restic_backup > /dev/null 2>&1; then
    launchctl unload "$HOME/Library/LaunchAgents/local.restic_backup.plist"
  fi
  cp "$DIR/restic.symlink/local.restic_backup.plist" "$HOME/Library/LaunchAgents/local.restic_backup.plist"

  launchctl load "$HOME/Library/LaunchAgents/local.restic_backup.plist"

  if [ -f "$HOME/.restic/restic.env" ]; then
    info "Performing initial backup..."
    launchctl start local.restic_backup
  else
    info "restic.env doesn't exist yet. Create it or extract it from secrets.dmg"
  fi
fi