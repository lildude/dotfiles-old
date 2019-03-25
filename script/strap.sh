#!/bin/bash
#/ Usage: bin/strap.sh [--debug]
#/ Install development dependencies on macOS using strap.sh.
#/ Source: https://github.com/lildude/strap, a slightly modified fork of https://github.com/MikeMcQuaid/strap
set -e

strap_dir="$HOME/Development/strap"
if [ -d "$strap_dir" ]; then
  dev_dir=$(dirname "$strap_dir")
  mkdir -p "$dev_dir"
  cd "$dev_dir"
  git clone https://github.com/lildude/strap
fi

cd "$strap_dir"
STRAP_GIT_NAME="Colin Seymour" \
STRAP_GIT_EMAIL="lildood@gmail.com" \
STRAP_GITHUB_USER="lildude" \
STRAP_GITHUB_TOKEN="" \
bash bin/strap.sh