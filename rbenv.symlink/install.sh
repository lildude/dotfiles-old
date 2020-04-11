#!/usr/bin/env bash
#
DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

VERSION=2.6.5

if [ -n "$GITHUB_WORKSPACE" ]; then
  echo "rbenv would install Ruby $VERSION"
  exit 0
fi

rbenv install $VERSION
rbenv global $VERSION
