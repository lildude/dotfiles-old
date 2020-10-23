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

# fish_git_prompt is faaar too slow as it gathers some much other crap I don't need resulting in a painfully slow prompt when entering a large repo like github/linguist
# This is my attempt around it by gathering just the info I want directly from git.
#
# I want my prompt to look like this:
#
# [~/g/enterprise2   enterprise-2.17-backport-… ●●●]$
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
#
# Uses methods copied from https://github.com/fishpkg/fish-git-util and modified to suit my needs

function fish_prompt --description 'lildudes prompt'
  set_color magenta
  printf '['
  set_color green
  printf '%s' (prompt_pwd)
  set_color normal
  set -l icon (git_icon)
  printf '%s' (fish_git_prompt " $icon %s")
  set_color magenta
  printf ']'
  set_color blue
  echo -n '$ '
  set_color normal
end

function git_icon
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
  return
  if [ -d .git ] || git rev-parse --is-inside-work-tree >/dev/null 2>&1
    # Set the git config stuff for my prompt
    set -l email (git config user.email)
    echo -n -s $email
  end
end
