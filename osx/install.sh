#!/usr/bin/env bash
# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.
DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

# Don't run on Linux or under GitHub Actions (aka CI)
if [ "$(uname -s)" = "Darwin" ] && [ -z "$GITHUB_WORKSPACE" ]; then
  info "sudo softwareupdate -i -a"
  sudo softwareupdate -i -a 2>&1 | indent
fi
