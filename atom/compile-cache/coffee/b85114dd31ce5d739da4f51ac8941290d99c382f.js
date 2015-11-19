(function() {
  var GitCommit, StatusView, git, gitCommitAmend;

  git = require('../git');

  StatusView = require('../views/status-view');

  GitCommit = require('./git-commit');

  gitCommitAmend = function() {
    return git.cmd({
      args: ['log', '-1', '--format=%B'],
      stdout: function(amend) {
        return git.cmd({
          args: ['reset', '--soft', 'HEAD^'],
          exit: function() {
            return new GitCommit("" + (amend != null ? amend.trim() : void 0) + "\n");
          }
        });
      }
    });
  };

  module.exports = gitCommitAmend;

}).call(this);
