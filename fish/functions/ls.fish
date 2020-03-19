function ls --description 'Replace `ls` with `exa` if available'
	if command -v exa > /dev/null
		exa -lg $argv
	end
end
