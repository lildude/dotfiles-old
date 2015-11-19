(function() {
  var SelectUnstageFiles, git, gitUnstageFiles;

  git = require('../git');

  SelectUnstageFiles = require('../views/select-unstage-files-view');

  gitUnstageFiles = function() {
    return git.stagedFiles(function(data) {
      return new SelectUnstageFiles(data);
    });
  };

  module.exports = gitUnstageFiles;

}).call(this);
