#!/usr/bin/env bash
# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

# Don't run on Linux or under GitHub Actions (aka CI)
if [ $MACOS ] && [ -z "$GITHUB_WORKSPACE" ]; then
  info "sudo softwareupdate -i -a"
  sudo softwareupdate -i -a 2>&1
  "$DIR/set-defaults.sh"
fi
