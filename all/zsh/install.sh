#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

# Exit early if ZSH isn't my default shell
[ "$DEFAULT_SHELL" != "zsh" ] && exit 0

if [ ! -d ${HOME}/.zprezto ]; then
  info "Downloading prezto"
  git clone -q --recursive https://github.com/lildude/prezto.git "$HOME/.zprezto"
else
  info "Updating .zpreto from fork on GitHub (previously updated using 'zprezto-update')"
  cd ${HOME}/.zprezto
  git pull -q
  cd ${HOME}
fi

info "Installing ZSH rc files"
setopt EXTENDED_GLOB
for rcfile in "$HOME"/.zprezto/runcoms/^(README.md|zlogout)(.N); do
  if [ ! -L "$HOME/.${rcfile:t}" ]; then
    if [ -f "$HOME/.${rcfile:t}" ]; then
      echo "Backing up $HOME/.${rcfile:t} to $HOME/.${rcfile:t}.bak"
      mv $HOME/.${rcfile:t} $HOME/.${rcfile:t}.bak
    fi
    overwrite_all=false backup_all=false skip_all=false link_file "$rcfile" "$HOME/.${rcfile:t}"
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
  sudo chsh -s /bin/zsh $USER
fi
