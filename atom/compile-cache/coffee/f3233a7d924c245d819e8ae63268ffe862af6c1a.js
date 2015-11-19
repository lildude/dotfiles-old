(function() {
  var CompositeDisposable, GitCommit, StatusView, fs, git, os, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  path = require('path');

  os = require('os');

  git = require('../git');

  StatusView = require('../views/status-view');

  module.exports = GitCommit = (function() {
    GitCommit.prototype.setCommentChar = function(char) {
      if (char === '') {
        char = '#';
      }
      return this.commentchar = char;
    };

    GitCommit.prototype.dir = function() {
      if (this.submodule != null ? this.submodule : this.submodule = git.getSubmodule()) {
        return this.submodule.getWorkingDirectory();
      } else {
        return git.dir();
      }
    };

    GitCommit.prototype.filePath = function() {
      return path.join(this.dir(), 'COMMIT_EDITMSG');
    };

    GitCommit.prototype.currentPane = atom.workspace.getActivePane();

    function GitCommit(amend) {
      this.amend = amend != null ? amend : '';
      this.disposables = new CompositeDisposable;
      this.isAmending = this.amend.length > 0;
      git.cmd({
        args: ['config', '--get', 'core.commentchar'],
        stdout: (function(_this) {
          return function(data) {
            return _this.setCommentChar(data.trim());
          };
        })(this),
        stderr: (function(_this) {
          return function() {
            return _this.setCommentChar('#');
          };
        })(this)
      });
      git.stagedFiles((function(_this) {
        return function(files) {
          if (_this.amend !== '' || files.length >= 1) {
            return git.cmd({
              args: ['status'],
              stdout: function(data) {
                return _this.prepFile(data);
              }
            });
          } else {
            _this.cleanup();
            return new StatusView({
              type: 'error',
              message: 'Nothing to commit.'
            });
          }
        };
      })(this));
    }

    GitCommit.prototype.prepFile = function(status) {
      status = status.replace(/\s*\(.*\)\n/g, '');
      status = status.trim().replace(/\n/g, "\n" + this.commentchar + " ");
      fs.writeFileSync(this.filePath(), "" + this.amend + "\n" + this.commentchar + " Please enter the commit message for your changes. Lines starting\n" + this.commentchar + " with '" + this.commentchar + "' will be ignored, and an empty message aborts the commit.\n" + this.commentchar + "\n" + this.commentchar + " " + status);
      return this.showFile();
    };

    GitCommit.prototype.showFile = function() {
      var split;
      split = atom.config.get('git-plus.openInPane') ? atom.config.get('git-plus.splitPane') : void 0;
      return atom.workspace.open(this.filePath(), {
        split: split,
        searchAllPanes: true
      }).done((function(_this) {
        return function(textBuffer) {
          if (textBuffer != null) {
            _this.disposables.add(textBuffer.onDidSave(function() {
              return _this.commit();
            }));
            return _this.disposables.add(textBuffer.onDidDestroy(function() {
              if (_this.isAmending) {
                return _this.undoAmend();
              } else {
                return _this.cleanup();
              }
            }));
          }
        };
      })(this));
    };

    GitCommit.prototype.commit = function() {
      var args;
      args = ['commit', '--cleanup=strip', "--file=" + (this.filePath())];
      return git.cmd({
        args: args,
        options: {
          cwd: this.dir()
        },
        stdout: (function(_this) {
          return function(data) {
            var _ref;
            new StatusView({
              type: 'success',
              message: data
            });
            _this.isAmending = false;
            _this.destroyActiveEditorView();
            if ((_ref = git.getRepo()) != null) {
              if (typeof _ref.refreshStatus === "function") {
                _ref.refreshStatus();
              }
            }
            if (_this.currentPane.alive) {
              _this.currentPane.activate();
            }
            return git.refresh();
          };
        })(this),
        stderr: (function(_this) {
          return function(err) {
            return _this.destroyActiveEditorView();
          };
        })(this)
      });
    };

    GitCommit.prototype.destroyActiveEditorView = function() {
      if (atom.workspace.getActivePane().getItems().length > 1) {
        return atom.workspace.destroyActivePaneItem();
      } else {
        return atom.workspace.destroyActivePane();
      }
    };

    GitCommit.prototype.undoAmend = function(err) {
      if (err == null) {
        err = '';
      }
      return git.cmd({
        args: ['reset', 'ORIG_HEAD'],
        stdout: function() {
          return new StatusView({
            type: 'error',
            message: "" + (err + ': ') + "Commit amend aborted!"
          });
        },
        stderr: function() {
          return new StatusView({
            type: 'error',
            message: 'ERROR! Undoing the amend failed! Please fix your repository manually!'
          });
        },
        exit: (function(_this) {
          return function() {
            _this.isAmending = false;
            return _this.destroyActiveEditorView();
          };
        })(this)
      });
    };

    GitCommit.prototype.cleanup = function() {
      if (this.currentPane.alive) {
        this.currentPane.activate();
      }
      this.disposables.dispose();
      try {
        return fs.unlinkSync(this.filePath());
      } catch (_error) {}
    };

    return GitCommit;

  })();

}).call(this);
