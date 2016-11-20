#!/usr/bin/env bash
# The Brewfile handles Homebrew-based app and library installs, but there may
# still be updates and installables in the Mac App Store. There's a nifty
# command line interface to it that we can use to just install everything, so
# yeah, let's do that.
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

if [ "$(uname -s)" = "Darwin" ]; then
  info "sudo softwareupdate -i -a"
  sudo softwareupdate -i -a
fi
