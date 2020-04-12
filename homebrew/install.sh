#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired) using Homebrew.
set -euo pipefail

DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

# I only use homebrew on the mac at the mo
if [ $MACOS ]; then
  # Check for Homebrew
  if ! command -v brew > /dev/null 2>&1; then
    echo "Installing Homebrew"
    bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
  fi

  # Ensure everything in the Brewfile is installed
  brew_check=$(brew bundle check --file "$DOTFILES/Brewfile" --verbose 2>&1)
  if [ "$brew_check" != "The Brewfile's dependencies are satisfied" ]; then
    if [ -n "$GITHUB_WORKSPACE" ]; then
      echo "$brew_check" | indent
    else
      brew bundle install --file "$DOTFILES/Brewfile" > /dev/null | indent
    fi
  else
    success "Nothing new to install"
  fi

  # Upgrade homebrew pkgs, but not in CI as we don't care about most of the pre-installed pkgs
  if [ -z "$GITHUB_WORKSPACE" ]; then
    if [ "$(brew outdated | wc -l)" -gt 0 ]; then
      if brew upgrade > /dev/null; then success "Upgraded brew packages"; else fail "Upgrade brew packages"; fi
    fi

    if [ "$(brew cask outdated | wc -l)" -gt 0 ]; then
      if brew cask upgrade > /dev/null; then success "Upgraded brew cask packages"; else fail "Upgrade brew cask packages"; fi
    fi

    # Clean up
    if [ "$(brew cleanup -n 2> /dev/null | wc -l)" -gt 0 ]; then
      if brew cleanup > /dev/null 2>&1; then success "Brew cleaned up"; else fail "Brew clean up"; fi
    fi
  fi

else
  success "Skipped installing homebrew"
fi