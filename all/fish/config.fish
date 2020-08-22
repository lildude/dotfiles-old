# This is the be all and end all of my Fish shell configuration
# `fish_config` provides a really cool web-based UI for this too.
#
# Cool stuffs - https://github.com/jorgebucaran/awesome-fish

# Put fisher plugin files in their own dir
set -g fisher_path ~/.config/fish/fisher_plugins

set fish_function_path $fish_function_path[1] $fisher_path/functions $fish_function_path[2..-1]
set fish_complete_path $fish_complete_path[1] $fisher_path/completions $fish_complete_path[2..-1]

for file in $fisher_path/conf.d/*.fish
  builtin source $file 2> /dev/null
end

# Exported variables
# Start with the path. We use the universal thingy and not this file. Run this only _once_ at first config and then append as needed
# This is actually stored in the fish_variables file
# TODO: Remove dups and only add those that exist - might need to use `set -x PATH` here instead
#set -U fish_user_paths ./bin ~/bin ~/.cargo/bin ~/go/bin ~/.yarn/bin ~/.config/yarn/global/node_modules/.bin /usr/local/bin /usr/local/sbin /bin /sbin /usr/bin /usr/sbin ~/github/enterprise2 ~/github/awesume

if test "(uname -s)" = "Darwin";
  set -xg BROWSER "open"
  set -xg HOMEBREW_EDITOR 'code -n'
end

set -xg EDITOR "nvim"
set -xg VISUAL "nvim"
set -xg PAGER "less"
set -xg LANG "en_GB.UTF-8"
test -d $HOME/go && set -xg GOPATH $HOME/go

# Set the default Less options.
# Mouse-wheel scrolling has been disabled by -X (disable screen clearing).
# Remove -X and -F (exit if the content fits on one screen) to enable it.
set -xg LESS '-F -g -i -M -R -w -X -z-4'

# Set Ruby options.  Initially only disable warnings
set -xg RUBYOPT '-W0'

# Conveniently locate cloud drive :-P
set -xg ICLOUD_DRIVE "$HOME/Library/Mobile Documents/com~apple~CloudDocs"

# Prevent macos tar including hidden ._ files in tarballs
set -xg COPYFILE_DISABLE 1

# fzf config
set -xg FZF_CTRL_T_COMMAND "fd --glob '!.git/*' ."
set -xg FZF_DEFAULT_COMMAND "fd --type d --glob '!.git/*' ."
set -xg FZF_TMUX 1
set -U FZF_COMPLETE 0
# Set to avoid `env` output from changing console colour
set -x LESS_TERMEND (set_color normal)
# Pull in tokens
[ -f $HOME/.secrets ] && builtin source $HOME/.secrets

# Terminal Colours - trying to keep things using the terminal colours rather than values unique to Fish
# See these in action with print_fish_colors
set -U fish_color_autosuggestion    brblack
set -U fish_color_cancel            -r
set -U fish_color_command           green
set -U fish_color_comment           brblack
set -U fish_color_cwd               green
set -U fish_color_cwd_root          red
set -U fish_color_end               normal
set -U fish_color_error             red
set -U fish_color_escape            cyan
set -U fish_color_history_current   --bold
set -U fish_color_host              normal
set -U fish_color_match             --background=brblue
set -U fish_color_normal            normal
set -U fish_color_operator          cyan
set -U fish_color_param             efefef
set -U fish_color_quote             yellow
set -U fish_color_redirection       normal
set -U fish_color_search_match      'bryellow' '--background=brblack'
set -U fish_color_selection         'white' '--bold' '--background=brblack'
set -U fish_color_status            red
set -U fish_color_user              green
set -U fish_color_valid_path        --underline
set -U fish_greeting                # I don't want a greeting
set -U fish_key_bindings            fish_default_key_bindings
set -U fish_pager_color_completion  normal
set -U fish_pager_color_description yellow
set -U fish_pager_color_prefix      'white' '--bold' '--underline'
set -U fish_pager_color_progress    'brwhite' '--background=cyan'