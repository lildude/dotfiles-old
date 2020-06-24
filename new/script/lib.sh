#!/usr/bin/env bash
#
# Library of helper functions other scripts in my dotfiles can use.

#### Default config opts ####
[ "$(uname -s)" = "Darwin" ] && MACOS=1
[ "$(uname -s)" = "Linux" ] && LINUX=1
[[ "$(hostname)" =~ ^ip- ]] && BPDEV=1

export MACOS=${MACOS:-}
export LINUX=${LINUX:-}
export BPDEV=${BPDEV:-}
export GITHUB_WORKSPACE=${GITHUB_WORKSPACE:-}
export DEFAULT_SHELL=${DEFAULT_SHELL:-fish}
export BREWFILE="$DIR/$OS/Brewfile"

info () {
  printf "\\033[01;34m%s\\033[0m\\n" "$1"
}

fail () {
  printf "\\033[0;31m%s\\033[0m\\n" "$1"
  echo ''
  exit 1
}

export -f info fail