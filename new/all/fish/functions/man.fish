function man --description "Colourful man pages"
  set -x LESS_TERMCAP_mb (set_color red)
  set -x LESS_TERMCAP_md (set_color red)
  set -x LESS_TERMCAP_me (set_color normal)
  set -x LESS_TERMCAP_se (set_color normal)
  set -x LESS_TERMCAP_so (set_color -b white black)
  set -x LESS_TERMCAP_ue (set_color normal)
  set -x LESS_TERMCAP_us (set_color green)

  command man $argv
end
