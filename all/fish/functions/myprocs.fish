function myprocs --description 'Display only my processes'
	ps aux | grep $USER;
end
