(function() {
  var $, InputView, Os, Path, TextEditorView, View, fs, git, prepFile, showCommitFilePath, showFile, showObject, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  showCommitFilePath = function() {
    return Path.join(Os.tmpDir(), "atom_git_plus_commit.diff");
  };

  showObject = function(objectHash, file) {
    var args;
    args = ['show'];
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--');
      args.push(file);
    }
    return git.cmd({
      args: args,
      stdout: function(data) {
        return prepFile(data);
      }
    });
  };

  prepFile = function(text) {
    fs.writeFileSync(showCommitFilePath(), text, {
      flag: 'w+'
    });
    return showFile();
  };

  showFile = function() {
    var split;
    split = atom.config.get('git-plus.openInPane') ? atom.config.get('git-plus.splitPane') : void 0;
    return atom.workspace.open(showCommitFilePath(), {
      split: split,
      activatePane: true
    });
  };

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(callback) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.on('core:cancel', (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      this.objectHash.focus();
      return this.objectHash.on('core:confirm', (function(_this) {
        return function() {
          var name, text;
          text = _this.objectHash.getModel().getText().split(' ');
          name = text.length === 2 ? text[1] : text[0];
          callback(text);
          return _this.destroy();
        };
      })(this));
    };

    InputView.prototype.destroy = function() {
      return this.panel.destroy();
    };

    return InputView;

  })(View);

  module.exports = function(objectHash, file) {
    if (objectHash == null) {
      return new InputView(showObject);
    } else {
      return showObject(objectHash, file);
    }
  };

}).call(this);
