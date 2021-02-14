# name: lildude_prompt

# fish_git_prompt options - https://github.com/fish-shell/fish-shell/blob/c6f85238b9a8c1f89743825f02609074d6969396/share/functions/fish_git_prompt.fish
set __fish_git_prompt_showupstream 'none'
set __fish_git_prompt_showdirtystate 'yes'
set __fish_git_prompt_showuntrackedfiles 'yes'

set __fish_git_prompt_char_dirtystate '●'
set __fish_git_prompt_char_stagedstate '●'
set __fish_git_prompt_char_untrackedfiles '●'
set __fish_git_prompt_shorten_branch_len 25

set __fish_git_prompt_color_branch yellow
set __fish_git_prompt_color_stagedstate green
set __fish_git_prompt_color_dirtystate yellow
set __fish_git_prompt_color_untrackedfiles red

# Sets the colour of the () around the branch
set __fish_git_prompt_color magenta

# Options for my own __lildude_fish_git_prompt_icon() function in fish_git_prompt
set __lildude_fish_git_prompt_icon_work_email '*@github.com'

# I want my prompt to look like this:
#
# [~/g/enterprise2   …enterprise-2.17-backport ●●●]$
#
# which is:
# - [ (purple)
# - <abbreviated path> (green)
# - <  | > if in git repo depending on email (blue)
# - < || > if in git repo (purple)
# - <truncated branch> if in git repo (yellow)
# - <●> shown and yellow if changes but unstaged
# - <●> shown and green if staged changes
# - <●> shown and red if untracked files
# - ] (purple)
# - $ (blue)

function fish_prompt --description 'lildudes prompt'
  set_color magenta
  printf '['
  # Last status code if not successful
  set --local last_status $status
  if [ $last_status -gt 0 ]
    set_color red
  else
    set_color green
  end
  printf '%s' (prompt_pwd)
  set_color normal
  printf '%s' (fish_git_prompt " %s") # The argument is the formatting for the git info part of the prompt
  set_color magenta
  printf ']'
  set_color blue
  echo -n '$ '
  set_color normal
end

# Moved to fish_git_prompt
function git_icon
  return
  if [ -d .git ]  # Naïve and not as accurate as `git rev-parse --git-dir` but def quicker and good enough
    set_color blue
    if string match '*@github.com' (git config user.email) > /dev/null 2>&1
      printf "\\uf113 " #   from Nerd Font patched font
    else
      printf "\\uf415 " #  from Nerd Font patched font
    end
    set_color magenta
    if command git symbolic-ref --short HEAD >/dev/null 2>&1  # Are we on a branch
      printf "\\uF126" #  from Nerd Font patched font
    else if git_is_tag
      printf "\\uF02B" #  from Nerd Font patched font
    else
      printf "\\uE729" #  from Nerd Font patched font
    end
  end
end

function fish_right_prompt
  return # Unused
  if [ -d .git ] || git rev-parse --is-inside-work-tree >/dev/null 2>&1
    # Set the git config stuff for my prompt
    set -l email (git config user.email)
    echo -n -s $email
  end
end
