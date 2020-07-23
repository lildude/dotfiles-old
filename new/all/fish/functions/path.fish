function path --description 'Print my path split by newline'
	echo -e $PATH | tr -s " " "\\n";
end
