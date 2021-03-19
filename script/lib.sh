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
export MIN=${MIN:-1}
export GITHUB_WORKSPACE=${GITHUB_WORKSPACE:-}
export DEFAULT_SHELL=${DEFAULT_SHELL:-zsh}
export BREWFILE="$DIR/$OS/Brewfile"
export USER=${USER:-$(whoami)}

red=$(tput -T"${TERM:-xterm}" setaf 1)
green=$(tput -T"${TERM:-xterm}" setaf 2)
yellow=$(tput -T"${TERM:-xterm}" setaf 3)
blue=$(tput -T"${TERM:-xterm}" setaf 4)
purple=$(tput -T"${TERM:-xterm}" setaf 5)
reset=$(tput -T"${TERM:-xterm}" sgr0)
export red green yellow blue purple reset

info () {
  printf "${blue}%s${reset}\\n" "$1"
}

fail () {
  printf "${red}%s${reset}\\n" "$1"
  echo ''
  exit 1
}