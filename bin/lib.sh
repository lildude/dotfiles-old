#!/usr/bin/env bash
#
# Library of helper functions other scripts in my dotfiles can use.

info () {
  printf "\r  [ \033[00;34m..\033[0m ] $1\n"
}

user () {
  printf "\r  [ \033[0;33m??\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
}

fail () {
  printf "\r\033[2K  [\033[0;31mFAIL\033[0m] $1\n"
  echo ''
  exit
}

setting() {
  printf "  [ \033[00;35m⚙\033[0m ] %s\n" "$1"
}

indent() {
  sed 's/^/         /';
}
