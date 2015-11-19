(function() {
  var StatusListView, git, gitStatus;

  git = require('../git');

  StatusListView = require('../views/status-list-view');

  gitStatus = function() {
    return git.status(function(data) {
      return new StatusListView(data);
    });
  };

  module.exports = gitStatus;

}).call(this);
