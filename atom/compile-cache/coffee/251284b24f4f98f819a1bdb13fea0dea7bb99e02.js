(function() {
  var StatusView, git, gitStashApply;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitStashApply = function() {
    return git.cmd({
      args: ['stash', 'apply'],
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

  module.exports = gitStashApply;

}).call(this);
