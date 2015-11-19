(function() {
  var RemoteListView, git, gitPull;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  gitPull = function() {
    return git.cmd({
      args: ['remote'],
      stdout: function(data) {
        return new RemoteListView(data, 'pull');
      }
    });
  };

  module.exports = gitPull;

}).call(this);
