#!/usr/bin/env bash
#
# Exit early if Fish isn't my default shell anymore.
[ "$DEFAULT_SHELL" != "fish" ] && exit 0

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -n "$GITHUB_WORKSPACE" ]; then
  echo "🐠 Would attempt to change default shell to Fish" | indent
  exit 0
fi

if [ ! -d ~/.config/fish ]; then
  if [ ! -d ~/.config ]; then
    mkdir ~/.config
  fi

  ln -s "$DIR" ~/.config/fish
  fish -c fisher
fi

info "🐠 Changing default shell to fish"
if [ "$(uname -s)" = "Darwin" ]; then
  brew_prefix=$(brew --prefix)
  if [ "$(dscl . -read "/Users/$USER" UserShell)" != "UserShell: $brew_prefix/bin/fish" ]; then
    if ! grep -q "$brew_prefix/bin/fish" /etc/shells; then
      echo "$brew_prefix/bin/fish" | sudo tee -a /etc/shells
    fi
    chsh -s "$brew_prefix/bin/fish"
  fi
else
  sudo chsh -s /bin/fish "$USER"
fi