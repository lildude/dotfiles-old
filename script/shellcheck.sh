#!/usr/bin/env bash
#
# Shellcheck all my bash scripts in this repo
export ZSH=$HOME/.dotfiles
# shellcheck source=bin/lib.sh
source "$ZSH/bin/lib.sh"

if ! command -v shellcheck > /dev/null 2>&1; then
  fail "Shellcheck not installed."
fi

cd "$ZSH" || exit 1
files=()
while IFS= read -r file; do
    # Skip firefox/updater.sh as this isn't my file.
    [[ "$file" =~ updater\.sh ]] && continue
    if file --brief --mime "$file" | grep -q "x-shellscript"; then
      files+=( "$file" )
    fi
done < <( git ls-files )

shellcheck -x "${files[@]}"