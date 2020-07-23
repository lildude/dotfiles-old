#!/usr/bin/env bash
#
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/../script/lib.sh"

[ $LINUX ] && exit 0

work="github" # Who do I work for? This is also assumed to be the GitHub org name
workdir="$HOME/$work" # Where to store all repos
# Default repos to clone the first time we run
repos="enterprise-releases enterprise-web enterprise2 enterprise-chatops github linguist lightshow vpn"
repos="enterprise-releases"

[ ! -d "$workdir" ] && mkdir -p "$workdir"

cd "$workdir" || fail "Whoops. Couldn't change to $workdir"
for repo in $repos; do
  if [ -d "$repo" ]; then
    (
      info "Updating $repo"
      cd "$repo" || fail "couldn't change to $repo"
      git pull -q
    )
  else
    (
      info "Cloning $repo"
      hub clone -q "$work/$repo"
    )
  fi
done
