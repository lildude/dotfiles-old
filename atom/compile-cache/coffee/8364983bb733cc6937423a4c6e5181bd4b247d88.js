(function() {
  var BufferedProcess, GitBridge, GitCmd, GitNotFoundError, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  path = require('path');

  GitNotFoundError = (function(_super) {
    __extends(GitNotFoundError, _super);

    function GitNotFoundError(message) {
      this.name = 'GitNotFoundError';
      GitNotFoundError.__super__.constructor.call(this, message);
    }

    return GitNotFoundError;

  })(Error);

  GitCmd = null;

  GitBridge = (function() {
    GitBridge.process = function(args) {
      return new BufferedProcess(args);
    };

    function GitBridge() {}

    GitBridge.locateGitAnd = function(callback) {
      var errorHandler, exitHandler, possiblePath, search;
      possiblePath = atom.config.get('merge-conflicts.gitPath');
      if (possiblePath) {
        GitCmd = possiblePath;
        callback(null);
        return;
      }
      search = ['git', '/usr/local/bin/git', '"%PROGRAMFILES%\\Git\\bin\\git"', '"%LOCALAPPDATA%\\Programs\\Git\\bin\\git"'];
      possiblePath = search.shift();
      exitHandler = (function(_this) {
        return function(code) {
          if (code === 0) {
            GitCmd = possiblePath;
            callback(null);
            return;
          }
          return errorHandler();
        };
      })(this);
      errorHandler = (function(_this) {
        return function(e) {
          if (e != null) {
            e.handle();
            e.error.code = "NOTENOENT";
          }
          possiblePath = search.shift();
          if (possiblePath == null) {
            callback(new GitNotFoundError("Please set the 'Git Path' correctly in the Atom settings ", "for the Merge Conflicts package."));
            return;
          }
          return _this.process({
            command: possiblePath,
            args: ['--version'],
            exit: exitHandler
          }).onWillThrowError(errorHandler);
        };
      })(this);
      return this.process({
        command: possiblePath,
        args: ['--version'],
        exit: exitHandler
      }).onWillThrowError(errorHandler);
    };

    GitBridge._getActivePath = function() {
      var _ref;
      return (_ref = atom.workspace.getActivePaneItem()) != null ? typeof _ref.getPath === "function" ? _ref.getPath() : void 0 : void 0;
    };

    GitBridge.getActiveRepo = function(filepath) {
      var repo, rootDir, rootDirIndex;
      rootDir = atom.project.relativizePath(filepath || this._getActivePath())[0];
      if (rootDir != null) {
        rootDirIndex = atom.project.getPaths().indexOf(rootDir);
        repo = atom.project.getRepositories()[rootDirIndex];
      } else {
        repo = atom.project.getRepositories()[0];
      }
      return repo;
    };

    GitBridge._repoWorkDir = function(filepath) {
      return this.getActiveRepo(filepath).getWorkingDirectory();
    };

    GitBridge._repoGitDir = function(filepath) {
      return this.getActiveRepo(filepath).getPath();
    };

    GitBridge._statusCodesFrom = function(chunk, handler) {
      var indexCode, line, m, p, workCode, __, _i, _len, _ref, _results;
      _ref = chunk.split("\n");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        m = line.match(/^(.)(.) (.+)$/);
        if (m) {
          __ = m[0], indexCode = m[1], workCode = m[2], p = m[3];
          _results.push(handler(indexCode, workCode, p));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    GitBridge._checkHealth = function(callback) {
      if (!GitCmd) {
        console.trace("GitBridge method called before locateGitAnd");
        callback(new Error("GitBridge.locateGitAnd has not been called yet"));
        return false;
      }
      return true;
    };

    GitBridge.withConflicts = function(repo, handler) {
      var conflicts, errMessage, exitHandler, proc, stderrHandler, stdoutHandler;
      if (!this._checkHealth(handler)) {
        return;
      }
      conflicts = [];
      errMessage = [];
      stdoutHandler = (function(_this) {
        return function(chunk) {
          return _this._statusCodesFrom(chunk, function(index, work, p) {
            if (index === 'U' && work === 'U') {
              conflicts.push({
                path: p,
                message: 'both modified'
              });
            }
            if (index === 'A' && work === 'A') {
              return conflicts.push({
                path: p,
                message: 'both added'
              });
            }
          });
        };
      })(this);
      stderrHandler = function(line) {
        return errMessage.push(line);
      };
      exitHandler = function(code) {
        if (code === 0) {
          return handler(null, conflicts);
        } else {
          return handler(new Error(("abnormal git exit: " + code + "\n") + errMessage.join("\n")), null);
        }
      };
      proc = this.process({
        command: GitCmd,
        args: ['status', '--porcelain'],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: stdoutHandler,
        stderr: stderrHandler,
        exit: exitHandler
      });
      return proc.process.on('error', function(err) {
        return handler(new GitNotFoundError(errMessage.join("\n")), null);
      });
    };

    GitBridge.isStaged = function(repo, filepath, handler) {
      var exitHandler, proc, staged, stderrHandler, stdoutHandler;
      if (!this._checkHealth(handler)) {
        return;
      }
      staged = true;
      stdoutHandler = (function(_this) {
        return function(chunk) {
          return _this._statusCodesFrom(chunk, function(index, work, p) {
            if (p === filepath) {
              return staged = index === 'M' && work === ' ';
            }
          });
        };
      })(this);
      stderrHandler = function(chunk) {
        return console.log("git status error: " + chunk);
      };
      exitHandler = function(code) {
        if (code === 0) {
          return handler(null, staged);
        } else {
          return handler(new Error("git status exit: " + code), null);
        }
      };
      proc = this.process({
        command: GitCmd,
        args: ['status', '--porcelain', filepath],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: stdoutHandler,
        stderr: stderrHandler,
        exit: exitHandler
      });
      return proc.process.on('error', function(err) {
        return handler(new GitNotFoundError, null);
      });
    };

    GitBridge.checkoutSide = function(repo, sideName, filepath, callback) {
      var proc;
      if (!this._checkHealth(callback)) {
        return;
      }
      proc = this.process({
        command: GitCmd,
        args: ['checkout', "--" + sideName, filepath],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: function(line) {
          return console.log(line);
        },
        stderr: function(line) {
          return console.log(line);
        },
        exit: function(code) {
          if (code === 0) {
            return callback(null);
          } else {
            return callback(new Error("git checkout exit: " + code));
          }
        }
      });
      return proc.process.on('error', function(err) {
        return callback(new GitNotFoundError);
      });
    };

    GitBridge.add = function(repo, filepath, callback) {
      repo.repo.add(filepath);
      return callback(null);
    };

    GitBridge.isRebasing = function() {
      var irebaseDir, irebaseStat, rebaseDir, rebaseStat, root;
      if (!this._checkHealth(function(e) {
        return atom.notifications.addError(e.message);
      })) {
        return;
      }
      root = this._repoGitDir();
      if (root == null) {
        return false;
      }
      rebaseDir = path.join(root, 'rebase-apply');
      rebaseStat = fs.statSyncNoException(rebaseDir);
      if (rebaseStat && rebaseStat.isDirectory()) {
        return true;
      }
      irebaseDir = path.join(root, 'rebase-merge');
      irebaseStat = fs.statSyncNoException(irebaseDir);
      return irebaseStat && irebaseStat.isDirectory();
    };

    return GitBridge;

  })();

  module.exports = {
    GitBridge: GitBridge,
    GitNotFoundError: GitNotFoundError
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9naXQtYnJpZGdlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSU07QUFFSix1Q0FBQSxDQUFBOztBQUFhLElBQUEsMEJBQUMsT0FBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLGtCQUFSLENBQUE7QUFBQSxNQUNBLGtEQUFNLE9BQU4sQ0FEQSxDQURXO0lBQUEsQ0FBYjs7NEJBQUE7O0tBRjZCLE1BSi9CLENBQUE7O0FBQUEsRUFXQSxNQUFBLEdBQVMsSUFYVCxDQUFBOztBQUFBLEVBY007QUFHSixJQUFBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7YUFBYyxJQUFBLGVBQUEsQ0FBZ0IsSUFBaEIsRUFBZDtJQUFBLENBQVYsQ0FBQTs7QUFFYSxJQUFBLG1CQUFBLEdBQUEsQ0FGYjs7QUFBQSxJQUlBLFNBQUMsQ0FBQSxZQUFELEdBQWUsU0FBQyxRQUFELEdBQUE7QUFFYixVQUFBLCtDQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUFmLENBQUE7QUFDQSxNQUFBLElBQUcsWUFBSDtBQUNFLFFBQUEsTUFBQSxHQUFTLFlBQVQsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLElBQVQsQ0FEQSxDQUFBO0FBRUEsY0FBQSxDQUhG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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/git-bridge.coffee
