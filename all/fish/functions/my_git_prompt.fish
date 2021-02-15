function my_git_prompt
  # If git isn't installed, there's nothing we can do
  # Return 1 so the calling prompt can deal with it
  if not command -sq git
    return 1
  end
  set -l repo_info (command git rev-parse --git-dir HEAD 2>/dev/null)
  test -n "$repo_info"
  or return

  set -l git_dir repo_info[1]
  set -l sha repo_info[2]

  set -l start_time (date +%s)
  set -l repo_info (command git --no-optional-locks status --porcelain=v2 --branch --ignore-submodules=dirty 2>/dev/null)
  set -l elapsed (math (date +%s)-$start_time)
  # If it took more than a second to get the repo info, we're probably in a massive repo so lets proactively enable the fs-monitor
  if test $elapsed -gt 1
    git config core.fsmonitor rs-git-fsmonitor
  end

  set -l branch (string sub --start 15 $repo_info[2])
  set -l untracked
  set -l dirty
  set -l staged
  set -l operation
  set -l step
  set -l total
  set -l icon (printf "\\uF126") #  from Nerd Font patched font

  for line in $repo_info
    if string match -qr '^\?\ ' $line
      set untracked '●'
    end

    set -l code (string sub --start 3 --length 2 $line)
    switch $code
    case 'A.' 'C.' 'D.' 'M.' 'R.'
      set staged '●'
    case '.C' '.D' '.M' '.R'
      set dirty '●'
    end
  end

  if test -d $git_dir/rebase-merge
      set branch (cat $git_dir/rebase-merge/head-name 2>/dev/null)
      set step (cat $git_dir/rebase-merge/msgnum 2>/dev/null)
      set total (cat $git_dir/rebase-merge/end 2>/dev/null)
      if test -f $git_dir/rebase-merge/interactive
          set operation "|REBASE-i"
      else
          set operation "|REBASE-m"
      end
  else
      if test -d $git_dir/rebase-apply
          set step (cat $git_dir/rebase-apply/next 2>/dev/null)
          set total (cat $git_dir/rebase-apply/last 2>/dev/null)
          if test -f $git_dir/rebase-apply/rebasing
              set branch (cat $git_dir/rebase-apply/head-name 2>/dev/null)
              set operation "|REBASE"
          else if test -f $git_dir/rebase-apply/applying
              set operation "|AM"
          else
              set operation "|AM/REBASE"
          end
      else if test -f $git_dir/MERGE_HEAD
          set operation "|MERGING"
      else if test -f $git_dir/CHERRY_PICK_HEAD
          set operation "|CHERRY-PICKING"
      else if test -f $git_dir/REVERT_HEAD
          set operation "|REVERTING"
      else if test -f $git_dir/BISECT_LOG
          set operation "|BISECTING"
      end
  end

  if test -n "$step" -a -n "$total"
      set operation "$operation $step/$total"
  end

  if test -z "$branch" || test "$branch" = "(detached)"
      if not set branch (command git symbolic-ref HEAD 2>/dev/null)
          # Are we on a tag
          set -l tag (command git describe --tags --exact-match HEAD 2>/dev/null)
          if test -n "$tag"
            set branch $tag
            set icon (printf "\\uF02B")  #  from Nerd Font patched font
          else
            set icon (printf "\\uE729") #  from Nerd Font patched font
            set branch (string match -r '^.{8}' -- $sha)…
          end

          set branch "($branch)"
      end
  end

  if string match '*@github.com' (command git config user.email) > /dev/null 2>&1
    set user (printf "\\uf113 ") #   from Nerd Font patched font
  else
    set user (printf "\\uf415 ") #  from Nerd Font patched font
  end

  if test -n "$staged" || test -n "$untracked" || test -n "$dirty"
    set space " "
  end

  set branch (string replace refs/heads/ '' -- $branch)
  # Shorten long branches - truncate from the beginning of the branch name as I prefix all my branches with my handle
  if test (string length $branch) -gt 25
    set branch "…"(string sub -s -25 $branch)
  end

  # Set colours for each part
  set user (set_color blue)$user
  set icon (set_color magenta)$icon
  set branch (set_color yellow)$branch
  set staged (set_color green)$staged
  set untracked (set_color red)$untracked
  set dirty (set_color yellow)$dirty
  set operation (set_color magenta)$operation

  printf " %s%s %s%s%s%s%s%s" $user $icon $branch $space $dirty $staged $untracked $operation
end