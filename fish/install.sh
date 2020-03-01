#!/usr/bin/env bash
#
# Exit early if Fish isn't my default shell anymore.
[ "$DEFAULT_SHELL" != "fish" ] && exit 0

if [ -n "$GITHUB_WORKSPACE" ]; then
  echo "Would attempt to change default shell to Fish" | indent
  exit 0
fi

info "Changing default shell to fish"
if [ "$(uname -s)" = "Darwin" ]; then
  if [ "$(dscl . -read "/Users/$USER" UserShell)" != "UserShell: /usr/local/bin/fish" ]; then
    if ! grep -q /usr/local/bin/fish /etc/shells; then
      echo '/usr/local/bin/fish' | sudo tee -a /etc/shells
    fi
    chsh -s /usr/local/bin/fish
  fi
else
  sudo chsh -s /bin/fish "$USER"
fi