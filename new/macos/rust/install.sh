#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

# Exit early on Linux for the mo
[ $LINUX ] && exit 0

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
