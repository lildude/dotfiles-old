#!/usr/bin/env bash
#
# Library of helper functions other scripts in my dotfiles can use.

#### Default config opts ####
[ "$(uname -s)" = "Darwin" ] && MACOS=1 && OS=macos
[ "$(uname -s)" = "Linux" ] && LINUX=1 && OS=linux
# Use a minimal installation in these locations:
[[ "$(hostname)" =~ ^ip- ]] && MIN=1
[[ "$(hostname)" =~ ghaedev ]] && MIN=1
[ "${CODESPACES:-}" = "true" ] && MIN=1
[ -n "${GITHUB_WORKSPACE:-}" ] && MIN=1
[ -n "${CI:-}" ] && MIN=1

export MACOS=${MACOS:-}
export LINUX=${LINUX:-}
export MIN=${MIN:-}
export GITHUB_WORKSPACE=${GITHUB_WORKSPACE:-}
export DEFAULT_SHELL=${DEFAULT_SHELL:-zsh}
export BREWFILE="$DIR/$OS/Brewfile"
export USER=${USER:-$(whoami)}

red="\\033[31m"
green="\\033[32m"
yellow="\\033[33m"
blue="\\033[34m"
purple="\\033[35m"
reset="\\033[0m"
export red green yellow blue purple reset

info () {
  printf "${blue}%s${reset}\\n" "$1"
}

fail () {
  printf "${red}%s${reset}\\n" "$1"
  echo ''
  exit 1
}