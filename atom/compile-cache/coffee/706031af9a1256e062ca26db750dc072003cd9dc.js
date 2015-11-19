(function() {
  var GitCommit, git, gitAddAndCommit;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAndCommit = function() {
    var _ref;
    return git.add({
      file: git.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0),
      exit: function() {
        return new GitCommit;
      }
    });
  };

  module.exports = gitAddAndCommit;

}).call(this);
