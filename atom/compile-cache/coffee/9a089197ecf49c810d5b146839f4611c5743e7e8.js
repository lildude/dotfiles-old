(function() {
  var RemoteListView, git, gitPush;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  gitPush = function() {
    return git.cmd({
      args: ['remote'],
      stdout: function(data) {
        return new RemoteListView(data, 'push');
      }
    });
  };

  module.exports = gitPush;

}).call(this);
