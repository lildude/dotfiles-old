(function() {
  var SelectStageFiles, git, gitStageFiles;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  gitStageFiles = function() {
    return git.unstagedFiles(function(data) {
      return new SelectStageFiles(data);
    }, true);
  };

  module.exports = gitStageFiles;

}).call(this);
