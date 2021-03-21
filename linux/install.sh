#!/usr/bin/env bash
#
# Linux-specific tweaks that don't warrant their own scripts elsewhere
set -euo pipefail

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
# shellcheck source=script/lib.sh
source "$DIR/script/lib.sh"
