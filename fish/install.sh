#!/usr/bin/env bash
#
set -euo pipefail

DOTFILES=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

# Exit early if Fish isn't my default shell
[ "$DEFAULT_SHELL" != "fish" ] && exit 0

if [ -n "$GITHUB_WORKSPACE" ]; then
  info "Would attempt to change default shell to Fish" "🐠" | indent
  exit 0
fi

link_file "$DOTFILES/fish" "$HOME/.config/fish"

if [ ! -f "$HOME/.config/fish/functions/fisher.fish" ]; then
  export fisher_path="$HOME/.config/fish/fisher_plugins"
  curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish && success "Fisher installed"
fi
# Install all fisher plugins
fish -c fisher 2>&1 && success "Fisher plugins installed and updated"

info "Changing default shell to fish" "🐠"
if [ $MACOS ]; then
  brew_prefix=$(brew --prefix)
  if [ "$(dscl . -read "/Users/$USER" UserShell)" != "UserShell: $brew_prefix/bin/fish" ]; then
    if ! grep -q "$brew_prefix/bin/fish" /etc/shells; then
      echo "$brew_prefix/bin/fish" | sudo tee -a /etc/shells
    fi
    chsh -s "$brew_prefix/bin/fish"
  fi
elif [ $LINUX ]; then
  if [[ ! "$SHELL" =~ bin/fish ]]; then
    sudo chsh -s "$(command -v fish)" "$USER"
  fi
fi