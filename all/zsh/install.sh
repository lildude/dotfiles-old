#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

# Exit early if ZSH isn't my default shell
[ "$DEFAULT_SHELL" != "zsh" ] && exit 0

if [ ! -d "${HOME}/.zprezto" ]; then
  info "   … Downloading prezto"
  git clone --quiet --recursive https://github.com/lildude/prezto.git "$HOME/.zprezto" > /dev/null 2>&1

  info "   … Installing ZSH rc files"
  while IFS= read -r -d '' src; do
    dst="$HOME/.$(basename "${src}")"
    display_dst="${dst/$HOME/\~}"
    display_src="${src/$DIR/.zprezto}"
    if [ ! -L "$dst" ]; then
      info "   …… $(printf "%-40s → %s" "$display_src" "$display_dst")"
      ln -Ffs "$src" "$dst"
    fi
  done <  <(find -H "${HOME}/.zprezto/runcoms/" -maxdepth 1 -type f -o -type l -not -path '*/zlogout' -not -path '*/README.md' -print0)
else
  info "   … Already installed. Updating .zpreto from fork on GitHub"
  git -C "${HOME}/.zprezto" pull -q
fi

if [ "$MACOS" ] && [ -z "${CI:-}" ]; then
  if [ "$(dscl . -read "/Users/$USER" UserShell)" != "UserShell: /usr/local/bin/zsh" ]; then
    info "   … Changing default shell to zsh"
    if ! grep -q /usr/local/bin/zsh /etc/shells; then
      echo '/usr/local/bin/zsh' | sudo tee -a /etc/shells
    fi
    chsh -s /usr/local/bin/zsh
  fi
else
  sudo chsh -s /bin/zsh "$USER"
fi
