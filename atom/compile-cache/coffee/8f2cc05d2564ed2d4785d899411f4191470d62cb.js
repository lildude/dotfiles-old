(function() {
  var StatusView, git, gitAdd;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitAdd = function(addAll) {
    var file, _ref;
    if (addAll == null) {
      addAll = false;
    }
    if (!addAll) {
      file = git.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    } else {
      file = null;
    }
    return git.add({
      file: file
    });
  };

  module.exports = gitAdd;

}).call(this);
