# If hub is installed, use it instead of git.
if command -v hub > /dev/null
  function git; hub $argv; end
  function ci; hub ci-status; end
end