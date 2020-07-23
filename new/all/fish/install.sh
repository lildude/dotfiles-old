#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

unset MIN
# Exit early if Fish isn't my default shell or we're doing a minimal install
if [ "$DEFAULT_SHELL" != "fish" ] || [ -n "${MIN:-}" ]; then
  exit 0
fi

info "🐠 Configuring Fish shell"

mkdir -p "$HOME/.config/"
ln -Ff -s "$DIR/fish" "$HOME/.config/fish"

if [ ! -f "$HOME/.config/fish/functions/fisher.fish" ]; then
  export fisher_path="$HOME/.config/fish/fisher_plugins"
  curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
fi
# Install all fisher plugins
fish -c fisher 2>&1

if [ "$MACOS" ]; then
  brew_prefix=$(brew --prefix)
  if [ "$(dscl . -read "/Users/$USER" UserShell)" != "UserShell: $brew_prefix/bin/fish" ]; then
    if ! grep -q "$brew_prefix/bin/fish" /etc/shells; then
      echo "$brew_prefix/bin/fish" | sudo tee -a /etc/shells
    fi
    chsh -s "$brew_prefix/bin/fish"
  fi
elif [ "$LINUX" ]; then
  if [[ ! "$SHELL" =~ bin/fish ]]; then
    sudo chsh -s "$(command -v fish)" "$USER"
  fi
fi