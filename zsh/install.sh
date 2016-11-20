#!/usr/bin/env zsh
#
# Download my .zprezto repo and set it up
export ZSH=$HOME/.dotfiles
source $ZSH/bin/lib.sh

if [ ! -d ${HOME}/.zprezto ]; then
  info "Downloading prezto"
  git clone -q --recursive https://github.com/lildude/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
else
  info "Updating .zpreto from fork on GitHub"
  cd ${HOME}/.zprezto
  git pull -q
  cd ${HOME}
fi

info "Installing ZSH rc files"
setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^(README.md|zlogout)(.N); do
  if [ ! -L "${ZDOTDIR:-$HOME}/.${rcfile:t}" ]; then
    ln -s "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
  fi
done

if [ "$(uname -s)" = "Darwin" ]; then
  if [ "$(dscl . -read /Users/$USER UserShell)" != "UserShell: /usr/local/bin/zsh" ]; then
    info "Changing default shell to zsh"
    if ! grep -q /usr/local/bin/zsh /etc/shells; then
      echo '/usr/local/bin/zsh' | sudo tee -a /etc/shells
    fi
    chsh -s /usr/local/bin/zsh
  fi
else
  sudo chsh -s /bin/zsh lildude
fi
