#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

if [ $MACOS ]; then
  # Check for Homebrew
  if ! command -v brew > /dev/null 2>&1; then
    info "Installing Homebrew for you."

    # Install the correct homebrew for each OS type
    if [ $MACOS ]; then
      ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    elif [ $LINUX ]; then
      ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
    fi

  fi
fi