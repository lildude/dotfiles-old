#!/bin/sh
#
# Set iTerm2 theme. We do this hear instead of in osx/set-defaults.sh as we need
# iTerm2 installed before we can set the theme and its only installed after
# osx-set-defaults.sh has been run.  There no point bringing it forward either.

# Install the Solarized Dark theme for iTerm
# CNS: This is my custom theme - I've change the highlight color to blue so I can see what I've highlighted
open "${HOME}/.dotfiles/iterm2/Custom-Solarized-Dark.itermcolors"

# Load/save settings from/to Dropbox
defaults write com.googlecode.iterm2 PrefsCustomFolder -string "/Users/lildude/Dropbox/App Prefs"
defaults write com.googlecode.iterm2 LoadPrefsFromCustomFolder -bool true

# Don't hit tab bar
