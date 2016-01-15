#!/usr/bin/env bash
#
# Download my .zprezto repo and set it up
echo "Downloading prezto"
git clone --recursive https://github.com/lildude/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"

echo "Installing ZSH rc files"
setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^README.md(.N); do
  ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
done

echo "Changing default shell to zsh"
chsh -s /usr/local/bin/zsh
