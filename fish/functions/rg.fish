function rg --description 'Always pipe `rg` through `less`'
	/usr/local/bin/rg -p $argv | less -RMFXK;
end
