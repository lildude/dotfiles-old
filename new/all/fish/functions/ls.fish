function ls --description 'Replace `ls` with `exa` if available'
	if command -v exa > /dev/null
		exa -lg $argv
	else
		command env LC_COLLATE=C ls --color $argv
	end
end
