#!/usr/bin/env bash
#
set -euo pipefail
DOTFILES=$(cd "$(dirname "$0")/.." && pwd)
# shellcheck source=bin/lib.sh
source "$DOTFILES/bin/lib.sh"

# Don't run on Linux
[ $LINUX ] && exit 0

# Login if we're not already
# shellcheck disable=SC2154 # the eval below sets it
if [ -z "$OP_SESSION_my" ]; then
  eval "$(op signin my)"
fi
# Grab all my SSH keys from 1Password using the CLI
declare -A keys
while IFS="=" read -r key value; do
  keys["$key"]="$value"
done < <(op list documents | jq -r '.[] | select(.overview.title | contains("SSH Key") ) | { (.uuid): .overview.title } | to_entries | .[] | .key + "=" + .value')
#declare -p keys

cd "$HOME/.ssh/" || exit 1

for i in "${!keys[@]}"; do
  filename=$(echo "${keys[$i]}" | awk '{ printf $NF}')
  if [ ! -f "$filename" ]; then
    info "Saving ${keys[$i]} from 1Password"
    op get document "$i" > "$filename"
    chmod 600 "$filename"
  fi
done

# Grab the passwords from 1Password, cos why copy & paste when we can make a computer do the work 😁
# TODO: Not 100 sure this works right now
info "Storing SSH keys in keychain..."
_old_display="${DISPLAY:-}"
_old_askpass="${SSH_ASKPASS:-}"
export DISPLAY=foobar SSH_ASKPASS="$DOTFILES/script/1pass-askpass"

grep -slR "PRIVATE" ~/.ssh | xargs ssh-add -K 2>&1 | indent

export DISPLAY="$_old_display" SSH_ASKPASS="$_old_askpass"
unset _old_display _old_askpass

cd "$HOME" || exit