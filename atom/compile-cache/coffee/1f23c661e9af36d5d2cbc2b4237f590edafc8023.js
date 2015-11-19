(function() {
  var RemoveListView, StatusView, git, gitRemove, prettify;

  git = require('../git');

  StatusView = require('../views/status-view');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(showSelector) {
    var currentFile, _ref;
    if (showSelector == null) {
      showSelector = false;
    }
    currentFile = git.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd({
          args: ['rm', '-f', '--ignore-unmatch', currentFile],
          stdout: function(data) {
            return new StatusView({
              type: 'success',
              message: "Removed " + (prettify(data))
            });
          }
        });
      }
    } else {
      return git.cmd({
        args: ['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'],
        stdout: function(data) {
          return new RemoveListView(prettify(data));
        }
      });
    }
  };

  prettify = function(data) {
    var file, i, _i, _len, _results;
    data = data.match(/rm ('.*')/g);
    _results = [];
    for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
      file = data[i];
      _results.push(data[i] = file.match(/rm '(.*)'/)[1]);
    }
    return _results;
  };

  module.exports = gitRemove;

}).call(this);
