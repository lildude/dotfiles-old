#!/usr/bin/env bash
#
DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

# Install rustup if it's not already installed.
if ! command -v rustup > /dev/null 2>&1; then
  info "Installing Rustup..."
  curl https://sh.rustup.rs -sSf | sh
fi

info "Updating Rust..."
rustup update

info "Installing Rust auto-completions..."
mkdir -p ~/.config/fish/completions
rustup completions fish > ~/.config/fish/completions/rustup.fish
