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
#apm-beta install --compatible --packages-file ~/.atom/package-list.txt && success "Installed Atom packages" || fail "Install Atom packages"

failures=
# apm will install everything, regardless of if it's installed or not so we need to do it manually
# https://discuss.atom.io/t/apm-install-cmd-only-install-if-not-installed/18842
for pkg in $(cat $HOME/.atom/package-list.txt); do
  if [ -d "$HOME/.atom/packages/$pkg" ]; then
    info "$pkg already installed"
  else
    apm install --compatible "$pkg" | indent || failures=1
  fi
done

if [ -n "$failures" ]; then
  fail "Some Atom packages failed to install"
else
  success "All Atom packages installed successfully"
fi
