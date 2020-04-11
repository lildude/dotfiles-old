#!/usr/bin/env bash
#
# Library of helper functions other scripts in my dotfiles can use.
export DOTFILES=${DOTFILES:-$(cd "$(dirname "$0")/.." && pwd)}

[ "$(uname -s)" = "Darwin" ] && export MACOS=1 && export UNIX=1
[ "$(uname -s)" = "Linux" ] && export LINUX=1 && export UNIX=1

info () {
  printf "\\r  [ \\033[00;34m..\\033[0m ] %s\\n" "$1"
}

user () {
  printf "\\r  [ \\033[0;33m??\\033[0m ] %s\\n" "$1"
}

success () {
  printf "\\r\\033[2K  [ \\033[00;32mOK\033[0m ] %s\\n" "$1"
}

fail () {
  printf "\\r\\033[2K  [\\033[0;31mFAIL\033[0m] %s\\n" "$1"
  echo ''
  exit
}

setting() {
  printf "  [ \\033[00;35m⚙\033[0m ] %s\\n" "$1"
}

indent() {
  sed 's/^/         /';
}