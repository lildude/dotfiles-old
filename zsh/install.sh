#!/usr/bin/env bash
#
# Download my .zprezto repo and set it up
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

info "Downloading prezto"
git clone --recursive https://github.com/lildude/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"

info "Installing ZSH rc files"
setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^(README.md|zlogout)(.N); do
  ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
done

info "Changing default shell to zsh"
chsh -s /usr/local/bin/zsh
