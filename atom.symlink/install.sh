#!/usr/bin/env bash
#
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

# Open Atom and install apm
if [ ! $(which apm) ]; then
  fail "Atom shell commands not installed."
fi
# Install all the pkgs in package-list.txt
apm install --packages-file ~/.atom/package-list.txt && success "Installed Atom packages" || fail "Install Atom packages"
