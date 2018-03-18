#!/usr/bin/env bash
#
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

VERSION=2.4.2

rbenv install $VERSION
rbenv global $VERSION
