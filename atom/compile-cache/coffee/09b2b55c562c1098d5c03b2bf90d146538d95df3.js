(function() {
  var StatusView, git, gitInit;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitInit = function() {
    return git.cmd({
      args: ['init'],
      stdout: function(data) {
        new StatusView({
          type: 'success',
          message: data
        });
        return atom.project.setPath(atom.project.getPath());
      }
    });
  };

  module.exports = gitInit;

}).call(this);
