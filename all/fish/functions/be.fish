function be --description 'bundle exec alias which runs the binstub if it exists'
	if test -f "bin/$argv[1]"
		bin/$argv
	else
		bundle exec $argv
	end
end
