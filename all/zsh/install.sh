#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

# Exit early if ZSH isn't my default shell
[ "$DEFAULT_SHELL" != "zsh" ] && exit 0

if [ ! -d "${HOME}/.zprezto" ]; then
  info "   Downloading prezto"
  git clone -q --recursive https://github.com/lildude/prezto.git "$HOME/.zprezto" > /dev/null 2>&1
else
  info "   Updating .zpreto from fork on GitHub (previously updated using 'zprezto-update')"
  cd "${HOME}/.zprezto"
  git pull -q
  cd "${HOME}"
fi

info "   Installing ZSH rc files"
shopt -s extglob
while IFS= read -r -d '' src; do
  [ "$src" == "README" ] || [ "$src" == "zlogout" ] && continue
  filename=$(basename "$src")
  if [ ! -L "$HOME/.$filename" ]; then
    ln -Ffs "$src" "$HOME/.$filename"
  fi
done

if [ "$MACOS" ] && [ -z "${CI:-}" ]; then
  if [ "$(dscl . -read "/Users/$USER" UserShell)" != "UserShell: /usr/local/bin/zsh" ]; then
    info "   Changing default shell to zsh"
    if ! grep -q /usr/local/bin/zsh /etc/shells; then
      echo '/usr/local/bin/zsh' | sudo tee -a /etc/shells
    fi
    chsh -s /usr/local/bin/zsh
  fi
else
  sudo chsh -s /bin/zsh "$USER"
fi
