#!/usr/bin/env bash
#
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

# Open Atom and install apm
if ! which apm-beta > /dev/null 2>&1; then
  fail "Atom shell commands not installed."
fi

info "Installing Atom packages"
# Install all the pkgs in package-list.txt
apm-beta install --compatible --packages-file ~/.atom/package-list.txt && success "Installed Atom packages" || fail "Install Atom packages"
