(function() {
  var Os, Path, StatusView, diffFilePath, fs, git, gitDiff, prepFile, showFile;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  StatusView = require('../views/status-view');

  diffFilePath = Path.join(Os.tmpDir(), "atom_git_plus.diff");

  gitDiff = function(_arg) {
    var args, diffStat, file, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, diffStat = _ref.diffStat, file = _ref.file;
    if (file == null) {
      file = git.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    }
    if (!file) {
      return new StatusView({
        type: 'error',
        message: "No open file. Select 'Diff All'."
      });
    }
    if (diffStat == null) {
      diffStat = '';
    }
    args = ['diff'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (diffStat === '') {
      args.push(file);
    }
    return git.cmd({
      args: args,
      stdout: function(data) {
        return diffStat += data;
      },
      exit: function(code) {
        if (code === 0) {
          return prepFile(diffStat);
        }
      }
    });
  };

  prepFile = function(text) {
    if ((text != null ? text.length : void 0) > 0) {
      fs.writeFileSync(diffFilePath, text, {
        flag: 'w+'
      });
      return showFile();
    } else {
      return new StatusView({
        type: 'error',
        message: 'Nothing to show.'
      });
    }
  };

  showFile = function() {
    var split;
    split = atom.config.get('git-plus.openInPane') ? atom.config.get('git-plus.splitPane') : void 0;
    return atom.workspace.open(diffFilePath, {
      split: split,
      activatePane: true
    });
  };

  module.exports = gitDiff;

}).call(this);
