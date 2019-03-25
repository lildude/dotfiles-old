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

EXTENSIONS="$(code --list-extensions)"

info "Installing VSCode packages"
# Install all the pkgs in package-list.txt
while IFS= read -r ext; do
  if echo "$EXTENSIONS" | grep -q "$ext"; then
    info "Extension $ext already installed."
    else
    if code --install-extension "$ext" > /dev/null; then
      success "Installed $ext package"
    else
      fail "Failed to install $ext"
    fi
  fi
done < <(grep -v '^ *#' < "$ZSH/vscode/package-list.txt")