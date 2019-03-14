#!/usr/bin/env bash
#
export ZSH=$HOME/.dotfiles
# shellcheck source=bin/lib.sh
source "$ZSH/bin/lib.sh"

if ! command -v code > /dev/null 2>&1; then
  fail "VS Code shell commands not installed."
fi

info "Installing VSCode settings"
overwrite_all=false backup_all=false skip_all=false link_file "$ZSH/vscode/settings.json" "$HOME/Library/Application Support/Code/User/settings.json"

info "Installing VSCode packages"
# Install all the pkgs in package-list.txt
for pkg in $(cat "$ZSH/vscode/package-list.txt"); do
  if code --install-extension "$pkg" > /dev/null; then
    success "Installed $pkg package"
  else
    fail "Failed to install $pkg"
  fi
done