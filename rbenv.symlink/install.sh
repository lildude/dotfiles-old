#!/usr/bin/env bash
#
set -euo pipefail

DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

VERSION=2.6.5

if [ -n "$GITHUB_WORKSPACE" ] || [ $LINUX ]; then
  exit 0
fi

rbenv install $VERSION
rbenv global $VERSION
