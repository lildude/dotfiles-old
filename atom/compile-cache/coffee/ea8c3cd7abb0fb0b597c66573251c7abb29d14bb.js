(function() {
  var StatusView, git, gitStashPop;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitStashPop = function() {
    return git.cmd({
      args: ['stash', 'pop'],
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

  module.exports = gitStashPop;

}).call(this);
