function top --description 'Replace `top` with `htop` if available'
	if command -v htop > /dev/null;
		htop $argv
	else
		command top $argv
	end
end
