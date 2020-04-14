function locate --description 'Find files on the cli'
	if string match -q (uname -s) "Darwin"
    mdfind -name $argv
  else
    command locate $argv
  end
end