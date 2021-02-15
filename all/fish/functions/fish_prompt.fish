# name: lildude_prompt
#
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
  # Last status code if not successful
  set --local last_status $status
  set_color magenta
  printf '['
  if [ $last_status -gt 0 ]
    set_color red
  else
    set_color green
  end
  printf '%s' (prompt_pwd)
  set_color normal
  my_git_prompt
  set_color magenta
  printf ']'
  set_color blue
  printf '$ '
  set_color normal
end

function fish_right_prompt
  return # Unused
  if [ -d .git ] || git rev-parse --is-inside-work-tree >/dev/null 2>&1
    # Set the git config stuff for my prompt
    set -l email (git config user.email)
    echo -n -s $email
  end
end
