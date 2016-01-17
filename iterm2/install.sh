#!/bin/sh
#
# Set iTerm2 theme. We do this hear instead of in osx/set-defaults.sh as we need
# iTerm2 installed before we can set the theme and its only installed after
# osx-set-defaults.sh has been run.  There no point bringing it forward either.

# Install the Solarized Dark theme for iTerm
# CNS: This is my custom theme - I've change the highlight color to blue so I can see what I've highlighted
open "${HOME}/.dotfiles/iterm2/Custom-Solarized-Dark.itermcolors"

# Don’t display the annoying prompt when quitting iTerm
defaults write com.googlecode.iterm2 PromptOnQuit -bool false
