#!/usr/bin/env bash
#
# Library of helper functions other scripts in my dotfiles can use.

#### Default config opts ####
[ "$(uname -s)" = "Darwin" ] && MACOS=1 && OS=macos
[ "$(uname -s)" = "Linux" ] && LINUX=1 && OS=linux
# bpdev hostnames start with ip- so default to minimal install on these
[[ "$(hostname)" =~ ^ip- ]] && MIN=1
[[ "$(hostname)" =~ ghaedev ]] && MIN=1

export MACOS=${MACOS:-}
export LINUX=${LINUX:-}
export MIN=${MIN:-}
export GITHUB_WORKSPACE=${GITHUB_WORKSPACE:-}  # This is only set on CI
export DEFAULT_SHELL=${DEFAULT_SHELL:-zsh}
export BREWFILE="$DIR/$OS/Brewfile"

info () {
  printf "\\033[01;34m%s\\033[0m\\n" "$1"
}

fail () {
  printf "\\033[0;31m%s\\033[0m\\n" "$1"
  echo ''
  exit 1
}