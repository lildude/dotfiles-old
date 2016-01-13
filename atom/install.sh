#!/usr/bin/env bash
#
# Install all the atom packages listed in package-list
echo "› Installing Atom packages"
if test ! $(which apm)
then
  echo "Opening Atom.  When open use Atom > Install Shell Commands from the menu option and come back here."
  open /Applications/Atom.app
  sleep 10
  echo "Ready to install Atom packages?"
  read
  apm install --packages-file ~/.atom/package-list.txt
else
  apm install --packages-file ~/.atom/package-list.txt
fi
