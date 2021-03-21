#!/usr/bin/env bash
#
# Linux-specific tweaks that don't warrant their own scripts elsewhere
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/script/lib.sh"

# Don't run on macOS or under GitHub Actions (aka CI)
if [ $LINUX ] && [ -z "${CI:-}" ]; then
  info "   … Tweaking .gitconfig"
  git config --global --remove-section credential
fi