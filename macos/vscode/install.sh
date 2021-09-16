#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

# Exit early on Linux for the mo
[ $LINUX ] || [ -n "${CI:-}" ] && exit 0

if ! command -v code > /dev/null 2>&1; then
  fail "VS Code shell commands not installed."
fi

info "Installing VSCode settings"
ln -Ff -s "$DIR/vscode/settings.json" "$HOME/Library/Application Support/Code/User/settings.json"
ln -Ff -s "$DIR/vscode/keybindings.json" "$HOME/Library/Application Support/Code/User/keybindings.json"
ln -Ff -s "$DIR/vscode/snippets" "$HOME/Library/Application Support/Code/User/snippets"

EXTENSIONS="$(code --list-extensions)"

info "Installing VSCode packages"
# Install all the pkgs in package-list.txt
# Update this using: code --list-extensions >! $HOME/.dotfiles/vscode/package-list.txt
while IFS= read -r ext; do
  if echo "$EXTENSIONS" | grep -q "$ext"; then
    info "Extension $ext already installed."
  else
    if code --install-extension "$ext" > /dev/null; then
      info "Installed $ext package"
    else
      fail "Failed to install $ext"
    fi
  fi
done < <(grep -v '^ *#' < "$DIR/vscode/package-list.txt")