#!/usr/bin/env bash
#
DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

# Open Atom and install apm
if ! command -v apm-beta > /dev/null 2>&1; then
  fail "Atom shell commands not installed."
fi

info "Installing Atom packages"
# Install all the pkgs in package-list.txt
if apm-beta install --compatible --packages-file ~/.atom/package-list.txt; then
  success "Installed Atom packages"
else
  fail "Install Atom packages"
fi
