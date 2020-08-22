function gb --description 'shortcut for `git branch`'
	if test -n "$argv"
		git branch $argv;
	else
		git b
	end
end
