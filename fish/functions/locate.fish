function locate --description 'Find files on the cli'
	if string match -q (uname -s) "Darwin"
    mdfind -name $argv
  else
    locate $argv
  end
end