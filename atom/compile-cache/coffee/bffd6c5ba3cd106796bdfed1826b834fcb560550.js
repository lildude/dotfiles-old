(function() {
  var StatusView, git, gitCheckoutCurrentFile;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitCheckoutCurrentFile = function() {
    var currentFile, _ref;
    currentFile = git.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    return git.cmd({
      args: ['checkout', '--', currentFile],
      stdout: function(data) {
        var _ref1;
        new StatusView({
          type: 'success',
          message: data.toString()
        });
        return (_ref1 = git.getRepo()) != null ? typeof _ref1.refreshStatus === "function" ? _ref1.refreshStatus() : void 0 : void 0;
      }
    });
  };

  module.exports = gitCheckoutCurrentFile;

}).call(this);
