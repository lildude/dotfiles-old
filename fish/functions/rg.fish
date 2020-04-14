function rg --description 'Always pipe `rg` through `less`'
	command rg -p $argv | less -RMFXK;
end
