(function() {
  var StatusView, git, gitStashSave;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitStashSave = function() {
    return git.cmd({
      args: ['stash', 'save'],
      options: {
        env: process.env.NODE_ENV
      },
      stdout: function(data) {
        return new StatusView({
          type: 'success',
          message: data
        });
      }
    });
  };

  module.exports = gitStashSave;

}).call(this);
