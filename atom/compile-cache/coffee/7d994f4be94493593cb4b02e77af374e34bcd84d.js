(function() {
  var StatusView, git, gitStashDrop;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitStashDrop = function() {
    return git.cmd({
      args: ['stash', 'drop'],
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

  module.exports = gitStashDrop;

}).call(this);
