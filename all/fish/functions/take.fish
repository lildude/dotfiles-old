function take --description 'Create and change into a directory'
  mkdir -p $argv
  and cd $argv[(count $argv)]
end