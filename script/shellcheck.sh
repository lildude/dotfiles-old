#!/usr/bin/env bash
#
# Shellcheck all my bash scripts in this repo
#
set -euo pipefail

DIR=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/script/lib.sh"

if ! command -v shellcheck > /dev/null 2>&1; then
  # Install shellcheck if not installed
  [ "$MACOS" ] && brew install shellcheck
  [ "$LINUX" ] && sudo apt-get install shellcheck
fi

cd "$DIR" || exit 1
files=()
while IFS= read -r file; do
    # Skip firefox/updater.sh as this isn't my file.
    [[ "$file" =~ updater\.sh ]] && continue
    if file --brief --mime "$file" | grep -q "x-shellscript"; then
      files+=( "$file" )
    fi
done < <( git ls-files )

shellcheck -x "${files[@]}"