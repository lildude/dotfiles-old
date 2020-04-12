#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
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

  # Update homebrew
  brew update > /dev/null 2>&1

  # Ensure everything in the Brewfile is installed
  brew_check=$(brew bundle check --verbose 2>&1)
  if [ -n "$brew_check" ]; then
    if [ -n "$GITHUB_WORKSPACE" ]; then
      echo "$brew_check" | indent
    else
      brew bundle install --file "$DOTFILES/Brewfile" | indent
    fi
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