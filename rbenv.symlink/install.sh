#!/usr/bin/env bash
#
export ZSH=$HOME/.dotfiles
# shellcheck source=bin/lib.sh
source "$ZSH/bin/lib.sh"

VERSION=2.6.3

if [ -n "$GITHUB_WORKSPACE" ]; then
  echo "rbenv would install Ruby $VERSION"
  exit 0
fi

rbenv install $VERSION
rbenv global $VERSION
