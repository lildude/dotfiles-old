#!/usr/bin/env bash
#
# Library of helper functions other scripts in my dotfiles can use.
set -euo pipefail

[ "$(uname -s)" = "Darwin" ] && MACOS=1
[ "$(uname -s)" = "Linux" ] && LINUX=1

export MACOS=${MACOS:-}
export LINUX=${LINUX:-}
export GITHUB_WORKSPACE=${GITHUB_WORKSPACE:-}
export DEFAULT_SHELL=${DEFAULT_SHELL:-fish}

info () {
  filler=${2:-..}
  printf "\\r  [ \\033[00;34m$filler\\033[0m ] %s\\n" "$1"
}

user () {
  printf "\\r  [ \\033[0;33m??\\033[0m ] %s\\n" "$1"
}

success () {
  printf "\\r\\033[2K  [ \\033[00;32m✅\033[0m ] %s\\n" "$1"
}

fail () {
  printf "\\r\\033[2K  [ \\033[0;31m❌\033[0m ] %s\\n" "$1"
  echo ''
  exit
}

setting() {
  printf "  [ \\033[00;35m⚙\033[0m ] %s\\n" "$1"
}

indent() {
  sed 's/^/         /';
}

link_file () {
  local src=$1 dst=$2

  local overwrite='' backup='' skip='' overwrite_all='false' backup_all='false' skip_all='false'
  local action=''

  if [ -f "$dst" ] || [ -d "$dst" ] || [ -L "$dst" ]; then

    if [ "$overwrite_all" == "false" ] && [ "$backup_all" == "false" ] && [ "$skip_all" == "false" ]; then
      local currentSrc
      currentSrc="$(readlink "$dst")"

      if [ "$currentSrc" == "$src" ]; then
        skip=true;
      else

        user "File already exists: $dst ($(basename "$src")), what do you want to do?\\n\\n
        [s]kip, [S]kip all, [o]verwrite, [O]verwrite all, [b]ackup, [B]ackup all?"
        read -rn 1 action

        case "$action" in
          o )
            overwrite=true;;
          O )
            overwrite_all=true;;
          b )
            backup=true;;
          B )
            backup_all=true;;
          s )
            skip=true;;
          S )
            skip_all=true;;
          * )
            ;;
        esac

      fi

    fi

    overwrite=${overwrite:-$overwrite_all}
    backup=${backup:-$backup_all}
    skip=${skip:-$skip_all}

    if [ "$overwrite" == "true" ]; then
      rm -rf "$dst"
      success "Removed $dst"
    fi

    if [ "$backup" == "true" ]; then
      mv "$dst" "${dst}.backup"
      success "Moved $dst to ${dst}.backup"
    fi

    if [ "$skip" == "true" ]; then
      success "Skipped $src"
    fi
  fi

  if [ "$skip" != "true" ]; then  # "false" or empty
    ln -s "$1" "$2"
    success "Linked $1 to $2"
  fi
}

install_dotfiles () {
  info 'Installing dotfiles'

  local overwrite_all=false backup_all=false skip_all=false

  while IFS= read -r -d '' src; do
    dst="$HOME/.$(basename "${src%.*}")"
    link_file "$src" "$dst"
  done <  <(find -H "$DOTFILES" -maxdepth 2 -name '*.symlink' -not -path '*.git*' -print0)
}