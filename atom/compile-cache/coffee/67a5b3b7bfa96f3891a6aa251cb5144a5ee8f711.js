(function() {
  var LogListView, amountOfCommitsToShow, git, gitLog;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  gitLog = function(onlyCurrentFile) {
    var args, currentFile, _ref;
    if (onlyCurrentFile == null) {
      onlyCurrentFile = false;
    }
    currentFile = git.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    args = ['log', "--pretty='%h;|%aN <%aE>;|%s;|%ar (%aD)'", '-s', "-n" + (amountOfCommitsToShow())];
    if (onlyCurrentFile && (currentFile != null)) {
      args.push(currentFile);
    }
    return git.cmd({
      args: args,
      options: {
        cwd: git.dir(false)
      },
      stdout: function(data) {
        return new LogListView(data, onlyCurrentFile);
      }
    });
  };

  module.exports = gitLog;

}).call(this);
