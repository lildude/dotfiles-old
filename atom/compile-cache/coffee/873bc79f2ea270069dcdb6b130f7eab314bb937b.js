(function() {
  var GitCommit, git, gitAddAllAndCommit;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAllAndCommit = function() {
    return git.add({
      exit: function() {
        return new GitCommit;
      }
    });
  };

  module.exports = gitAddAllAndCommit;

}).call(this);
