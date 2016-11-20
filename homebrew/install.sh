#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

if [ "$(uname -s)" = "Darwin" ]; then
  # Check for Homebrew
  if [ ! $(which brew) ]; then
    info "Installing Homebrew for you."

    # Install the correct homebrew for each OS type
    if [ "$(uname)" = "Darwin" ]; then
      ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    elif [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]; then
      ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
    fi

  fi
fi

exit 0
