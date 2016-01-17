#!/usr/bin/env zsh
#
# Download my .zprezto repo and set it up
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

if [ ! -d ${HOME}/.zprezto ]; then
info "Downloading prezto"
git clone --recursive https://github.com/lildude/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
else
  info "Updating .zpreto from fork on GitHub"
  cd ${HOME}/.zpreto
  git pull
  cd ${HOME}
fi

info "Installing ZSH rc files"
setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^(README.md|zlogout)(.N); do
  ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
done

info "Changing default shell to zsh"
chsh -s /usr/local/bin/zsh
