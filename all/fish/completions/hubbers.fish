
function __complete_hubbers
    set -lx COMP_LINE (commandline -cp)
    test -z (commandline -ct)
    and set COMP_LINE "$COMP_LINE "
    $HOME/bin/hubbers
end
complete -f -c hubbers -a "(__complete_hubbers)"

