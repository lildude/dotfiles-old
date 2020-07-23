function cat --description 'Replace `cat` with `bat` if available'
	if command -v bat > /dev/null
		env BAT_THEME="Monokai Extended" bat $argv
	else
		command cat $argv
	end
end
