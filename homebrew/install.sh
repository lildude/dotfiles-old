#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
export ZSH=$HOME/.dotfiles
# shellcheck source=bin/lib.sh
source "$ZSH/bin/lib.sh"

if [ "$(uname -s)" = "Darwin" ]; then
  # Check for Homebrew
  if ! command -v brew > /dev/null 2>&1; then
    info "Installing Homebrew for you."

    # Install the correct homebrew for each OS type
    os_type=$(uname -s)
    if [ "$os_type" = "Darwin" ]; then
      ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    elif [ "$os_type" = "Linux" ]; then
      ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
    fi

  fi
fi