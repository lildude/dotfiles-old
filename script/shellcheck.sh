#!/usr/bin/env bash
#
# Shellcheck all my bash scripts in this repo
#
set -euo pipefail

DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DOTFILES/script/lib.sh"

if ! command -v shellcheck > /dev/null 2>&1; then
  fail "Shellcheck not installed."
fi

cd "$DOTFILES" || exit 1
files=()
while IFS= read -r file; do
    # Skip firefox/updater.sh as this isn't my file.
    [[ "$file" =~ updater\.sh ]] && continue
    if file --brief --mime "$file" | grep -q "x-shellscript"; then
      files+=( "$file" )
    fi
done < <( git ls-files )

shellcheck -x "${files[@]}"