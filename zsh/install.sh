#!/usr/bin/env zsh
#
# Download my .zprezto repo and set it up
export ZSH=$HOME/.dotfiles
# shellcheck source=bin/lib.sh
source "$ZSH/bin/lib.sh"

if [ ! -d ${HOME}/.zprezto ]; then
  info "Downloading prezto"
  git clone -q --recursive https://github.com/lildude/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
else
  info "Updating .zpreto from fork on GitHub (previously updated using 'zprezto-update')"
  cd ${HOME}/.zprezto
  git pull -q
  cd ${HOME}
fi

info "Installing ZSH rc files"
setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^(README.md|zlogout)(.N); do
  if [ ! -L "${ZDOTDIR:-$HOME}/.${rcfile:t}" ]; then
    if [ -f "${ZDOTDIR:-$HOME}/.${rcfile:t}" ]; then
      echo "Backing up ${ZDOTDIR:-$HOME}/.${rcfile:t} to ${ZDOTDIR:-$HOME}/.${rcfile:t}.bak"
      mv ${ZDOTDIR:-$HOME}/.${rcfile:t} ${ZDOTDIR:-$HOME}/.${rcfile:t}.bak
    fi
    overwrite_all=false backup_all=false skip_all=false link_file "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
  fi
done

if [ -n "$GITHUB_WORKSPACE" ]; then
  echo "Would attempt to change default shell to ZSH" | indent
  exit 0
fi

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
