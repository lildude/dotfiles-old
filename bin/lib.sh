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
  exit 1
}

setting() {
  printf "  [ \033[00;35m⚙\033[0m ] %s\n" "$1"
}

# paste following in your script
declare -a Spinner

spinner=(/ - \\ \| / - \\ \| )
spinnerpos=0

update_spinner()
{
    printf "\b"${spinner[$spinnerpos]}
    (( Spinnerpos=(Spinnerpos +1)%8 ))
}
