#!/usr/bin/env bash
#
# Library of helper functions other scripts in my dotfiles can use.

info () {
  printf "\r  [ \033[00;34m..\033[0m ] $1\n"
}

infon () {
  printf "\r  [ \033[00;34m..\033[0m ] $1 "
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
    (( spinnerpos=(spinnerpos +1)%8 ))
}

spinner()
{
    local pid=$1
    local delay=0.75
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}
