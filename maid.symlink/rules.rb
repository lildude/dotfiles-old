# Sample Maid rules file -- some ideas to get you started.
#
# To use, remove ".sample" from the filename, and modify as desired.  Test using:
#
#     maid clean -n
#
# **NOTE:** It's recommended you just use this as a template; if you run these rules on your machine without knowing
# what they do, you might run into unwanted results!
#
# Don't forget, it's just Ruby!  You can define custom methods and use them below:
#
#     def magic(*)
#       # ...
#     end
#
# If you come up with some cool tools of your own, please send me a pull request on GitHub!  Also, please consider sharing your rules with others via [the wiki](https://github.com/benjaminoakes/maid/wiki).
#
# For more help on Maid:
#
# * Run `maid help`
# * Read the README, tutorial, and documentation at https://github.com/benjaminoakes/maid#maid
# * Ask me a question over email (hello@benjaminoakes.com) or Twitter (@benjaminoakes)
# * Check out how others are using Maid in [the Maid wiki](https://github.com/benjaminoakes/maid/wiki)

Maid.rules do
  #
  # Update all our Applications etc
  #
  rule 'Updating Brew' do
    `brew update` unless @file_options[:noop]
  end
  rule 'Updating Brews' do
    `brew upgrade -all` unless @file_options[:noop]
  end
  rule 'Cleaning Brew' do
    `brew cleanup` unless @file_options[:noop]
  end
  rule 'Updating gems ' do
    `gem update` unless @file_options[:noop]
  end
  rule 'Clean up gems' do
    `gem cleanup` unless @file_options[:noop]
  end
  rule 'Updating Atom packages' do
    `apm-beta upgrade` unless @file_options[:noop]
  end
  rule 'Updating Atom packages list' do
    `apm-beta list --installed --bare > ~/.atom/package-list.txt` unless @file_options[:noop]
  end

  # Tidy up after Docker
  rule 'Cleaning up after Docker' do
    `docker rmi $(docker images -q -f "dangling=true")` unless @file_options[:noop]
    #`docker system prune` unless @file_options[:noop] # Very aggressive clean up
  end

  # Move trash files to trash after 2 weeks
  rule 'Old files downloaded while tatting about' do
    dir('~/Downloads/trash/*').each do |path|
      if 2.weeks.since?(accessed_at(path))
        trash(path)
      end
    end
  end

  # Empty trash of items not touched in the last 2 weeks.
  rule 'Take out the Trash' do
    dir('~/.Trash/*').each do |p|
      remove(p) if accessed_at(p) > 2.weeks.ago
    end
  end

  # Cleaning up after Maid
  # ----------------------

  # This one should be after all the other 'Downloads' and 'Outbox' rules
  rule 'Remove empty directories' do
    dir(['~/Downloads/*', '~/Downloads/trash/*']).each do |path|
      if File.directory?(path) && dir("#{ path }/*").empty?
        trash(path)
      end
    end
  end

end
