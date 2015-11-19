(function() {
  var SelectStageHunkFile, git, gitStageHunk;

  git = require('../git');

  SelectStageHunkFile = require('../views/select-stage-hunk-file-view');

  gitStageHunk = function() {
    return git.unstagedFiles(function(data) {
      return new SelectStageHunkFile(data);
    });
  };

  module.exports = gitStageHunk;

}).call(this);
