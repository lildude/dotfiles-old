#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

VERSION=2.6.5

if [ -n "$GITHUB_WORKSPACE" ]; then
  exit 0
fi

rbenv install $VERSION
rbenv global $VERSION
