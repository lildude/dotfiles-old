(function() {
  var BufferedProcess, StatusView, dir, getSubmodule, gitAdd, gitCmd, gitDiff, gitMerge, gitRefreshIndex, gitResetHead, gitStagedFiles, gitStatus, gitUnstagedFiles, gitUntrackedFiles, relativize, _getGitPath, _prettify, _prettifyDiff, _prettifyUntracked;

  BufferedProcess = require('atom').BufferedProcess;

  StatusView = require('./views/status-view');

  gitCmd = function(_arg) {
    var args, c_stdout, command, exit, options, stderr, stdout, _ref;
    _ref = _arg != null ? _arg : {}, args = _ref.args, options = _ref.options, stdout = _ref.stdout, stderr = _ref.stderr, exit = _ref.exit;
    command = _getGitPath();
    if (options == null) {
      options = {};
    }
    if (options.cwd == null) {
      options.cwd = dir();
    }
    if (stderr == null) {
      stderr = function(data) {
        return new StatusView({
          type: 'alert',
          message: data.toString()
        });
      };
    }
    if ((stdout != null) && (exit == null)) {
      c_stdout = stdout;
      stdout = function(data) {
        if (this.save == null) {
          this.save = '';
        }
        return this.save += data;
      };
      exit = function(exit) {
        c_stdout(this.save != null ? this.save : this.save = '');
        return this.save = null;
      };
    }
    return new BufferedProcess({
      command: command,
      args: args,
      options: options,
      stdout: stdout,
      stderr: stderr,
      exit: exit
    });
  };

  gitStatus = function(stdout) {
    return gitCmd({
      args: ['status', '--porcelain', '-z'],
      stdout: function(data) {
        return stdout(data.length > 2 ? data.split('\0') : []);
      }
    });
  };

  gitStagedFiles = function(stdout) {
    var files;
    files = [];
    return gitCmd({
      args: ['diff-index', '--cached', 'HEAD', '--name-status', '-z'],
      stdout: function(data) {
        return files = _prettify(data);
      },
      stderr: function(data) {
        if (data.toString().contains("ambiguous argument 'HEAD'")) {
          return files = [1];
        } else {
          new StatusView({
            type: 'alert',
            message: data.toString()
          });
          return files = [];
        }
      },
      exit: function(code) {
        return stdout(files);
      }
    });
  };

  gitUnstagedFiles = function(stdout, showUntracked) {
    if (showUntracked == null) {
      showUntracked = false;
    }
    return gitCmd({
      args: ['diff-files', '--name-status', '-z'],
      stdout: function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(stdout, _prettify(data));
        } else {
          return stdout(_prettify(data));
        }
      }
    });
  };

  gitUntrackedFiles = function(stdout, dataUnstaged) {
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    return gitCmd({
      args: ['ls-files', '-o', '--exclude-standard', '-z'],
      stdout: function(data) {
        return stdout(dataUnstaged.concat(_prettifyUntracked(data)));
      }
    });
  };

  gitDiff = function(stdout, path) {
    return gitCmd({
      args: ['diff', '-p', '-U1', path],
      stdout: function(data) {
        return stdout(_prettifyDiff(data));
      }
    });
  };

  gitRefreshIndex = function() {
    return gitCmd({
      args: ['add', '--refresh', '--', '.'],
      stderr: function(data) {}
    });
  };

  gitAdd = function(_arg) {
    var exit, file, stderr, stdout, _ref;
    _ref = _arg != null ? _arg : {}, file = _ref.file, stdout = _ref.stdout, stderr = _ref.stderr, exit = _ref.exit;
    if (exit == null) {
      exit = function(code) {
        if (code === 0) {
          return new StatusView({
            type: 'success',
            message: "Added " + (file != null ? file : 'all files')
          });
        }
      };
    }
    return gitCmd({
      args: ['add', '--all', file != null ? file : '.'],
      stdout: stdout != null ? stdout : void 0,
      stderr: stderr != null ? stderr : void 0,
      exit: exit
    });
  };

  gitMerge = function(_arg) {
    var branchName, exit, stderr, stdout, _ref;
    _ref = _arg != null ? _arg : {}, branchName = _ref.branchName, stdout = _ref.stdout, stderr = _ref.stderr, exit = _ref.exit;
    if (exit == null) {
      exit = function(code) {
        if (code === 0) {
          return new StatusView({
            type: 'success',
            message: 'Git merged branch #{brachName} successfully'
          });
        }
      };
    }
    return gitCmd({
      args: ['merge', branchName],
      stdout: stdout != null ? stdout : void 0,
      stderr: stderr != null ? stderr : void 0,
      exit: exit
    });
  };

  gitResetHead = function() {
    return gitCmd({
      args: ['reset', 'HEAD'],
      stdout: function(data) {
        return new StatusView({
          type: 'success',
          message: 'All changes unstaged'
        });
      }
    });
  };

  _getGitPath = function() {
    var _ref;
    return (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git';
  };

  _prettify = function(data) {
    var files, i, mode;
    data = data.split('\0').slice(0, -1);
    return files = (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  _prettifyUntracked = function(data) {
    var file, files;
    if (data == null) {
      return [];
    }
    data = data.split('\0').slice(0, -1);
    return files = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        file = data[_i];
        _results.push({
          mode: '?',
          path: file
        });
      }
      return _results;
    })();
  };

  _prettifyDiff = function(data) {
    var line, _ref;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(_ref = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        _results.push('@@' + line);
      }
      return _results;
    })())), _ref;
    return data;
  };

  dir = function(submodules) {
    var found, submodule, _ref, _ref1;
    if (submodules == null) {
      submodules = true;
    }
    found = false;
    if (submodules) {
      if (submodule = getSubmodule()) {
        found = submodule.getWorkingDirectory();
      }
    }
    if (!found) {
      found = (_ref = (_ref1 = atom.project.getRepo()) != null ? _ref1.getWorkingDirectory() : void 0) != null ? _ref : atom.project.getPath();
    }
    return found;
  };

  relativize = function(path) {
    var _ref, _ref1, _ref2, _ref3;
    return (_ref = (_ref1 = (_ref2 = getSubmodule(path)) != null ? _ref2.relativize(path) : void 0) != null ? _ref1 : (_ref3 = atom.project.getRepo()) != null ? _ref3.relativize(path) : void 0) != null ? _ref : atom.project.relativize(path);
  };

  getSubmodule = function(path) {
    var _ref, _ref1;
    if (path == null) {
      path = (_ref = atom.workspace.getActiveEditor()) != null ? _ref.getPath() : void 0;
    }
    return (_ref1 = atom.project.getRepo()) != null ? _ref1.repo.submoduleForPath(path) : void 0;
  };

  module.exports.cmd = gitCmd;

  module.exports.stagedFiles = gitStagedFiles;

  module.exports.unstagedFiles = gitUnstagedFiles;

  module.exports.diff = gitDiff;

  module.exports.refresh = gitRefreshIndex;

  module.exports.status = gitStatus;

  module.exports.reset = gitResetHead;

  module.exports.add = gitAdd;

  module.exports.dir = dir;

  module.exports.relativize = relativize;

  module.exports.getSubmodule = getSubmodule;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVQQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FEYixDQUFBOztBQUFBLEVBYUEsTUFBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsUUFBQSw0REFBQTtBQUFBLDBCQURRLE9BQXNDLElBQXJDLFlBQUEsTUFBTSxlQUFBLFNBQVMsY0FBQSxRQUFRLGNBQUEsUUFBUSxZQUFBLElBQ3hDLENBQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxXQUFBLENBQUEsQ0FBVixDQUFBOztNQUNBLFVBQVc7S0FEWDs7TUFFQSxPQUFPLENBQUMsTUFBTyxHQUFBLENBQUE7S0FGZjs7TUFHQSxTQUFVLFNBQUMsSUFBRCxHQUFBO2VBQWMsSUFBQSxVQUFBLENBQVc7QUFBQSxVQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsVUFBZSxPQUFBLEVBQVMsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUF4QjtTQUFYLEVBQWQ7TUFBQTtLQUhWO0FBS0EsSUFBQSxJQUFHLGdCQUFBLElBQWdCLGNBQW5CO0FBQ0UsTUFBQSxRQUFBLEdBQVcsTUFBWCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7O1VBQ1AsSUFBQyxDQUFBLE9BQVE7U0FBVDtlQUNBLElBQUMsQ0FBQSxJQUFELElBQVMsS0FGRjtNQUFBLENBRFQsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsUUFBQSxRQUFBLHFCQUFTLElBQUMsQ0FBQSxPQUFELElBQUMsQ0FBQSxPQUFRLEVBQWxCLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FGSDtNQUFBLENBSlAsQ0FERjtLQUxBO1dBY0ksSUFBQSxlQUFBLENBQ0Y7QUFBQSxNQUFBLE9BQUEsRUFBUyxPQUFUO0FBQUEsTUFDQSxJQUFBLEVBQU0sSUFETjtBQUFBLE1BRUEsT0FBQSxFQUFTLE9BRlQ7QUFBQSxNQUdBLE1BQUEsRUFBUSxNQUhSO0FBQUEsTUFJQSxNQUFBLEVBQVEsTUFKUjtBQUFBLE1BS0EsSUFBQSxFQUFNLElBTE47S0FERSxFQWZHO0VBQUEsQ0FiVCxDQUFBOztBQUFBLEVBb0NBLFNBQUEsR0FBWSxTQUFDLE1BQUQsR0FBQTtXQUNWLE1BQUEsQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsUUFBRCxFQUFXLGFBQVgsRUFBMEIsSUFBMUIsQ0FBTjtBQUFBLE1BQ0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQVUsTUFBQSxDQUFVLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBakIsR0FBd0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQXhCLEdBQThDLEVBQXJELEVBQVY7TUFBQSxDQURSO0tBREYsRUFEVTtFQUFBLENBcENaLENBQUE7O0FBQUEsRUF5Q0EsY0FBQSxHQUFpQixTQUFDLE1BQUQsR0FBQTtBQUNmLFFBQUEsS0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtXQUNBLE1BQUEsQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsWUFBRCxFQUFlLFVBQWYsRUFBMkIsTUFBM0IsRUFBbUMsZUFBbkMsRUFBb0QsSUFBcEQsQ0FBTjtBQUFBLE1BQ0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQ04sS0FBQSxHQUFRLFNBQUEsQ0FBVSxJQUFWLEVBREY7TUFBQSxDQURSO0FBQUEsTUFHQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7QUFFTixRQUFBLElBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsUUFBaEIsQ0FBeUIsMkJBQXpCLENBQUg7aUJBQ0UsS0FBQSxHQUFRLENBQUMsQ0FBRCxFQURWO1NBQUEsTUFBQTtBQUdFLFVBQUksSUFBQSxVQUFBLENBQVc7QUFBQSxZQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsWUFBZSxPQUFBLEVBQVMsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUF4QjtXQUFYLENBQUosQ0FBQTtpQkFDQSxLQUFBLEdBQVEsR0FKVjtTQUZNO01BQUEsQ0FIUjtBQUFBLE1BVUEsSUFBQSxFQUFNLFNBQUMsSUFBRCxHQUFBO2VBQVUsTUFBQSxDQUFPLEtBQVAsRUFBVjtNQUFBLENBVk47S0FERixFQUZlO0VBQUEsQ0F6Q2pCLENBQUE7O0FBQUEsRUF3REEsZ0JBQUEsR0FBbUIsU0FBQyxNQUFELEVBQVMsYUFBVCxHQUFBOztNQUFTLGdCQUFjO0tBQ3hDO1dBQUEsTUFBQSxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxZQUFELEVBQWUsZUFBZixFQUFnQyxJQUFoQyxDQUFOO0FBQUEsTUFDQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixRQUFBLElBQUcsYUFBSDtpQkFDRSxpQkFBQSxDQUFrQixNQUFsQixFQUEwQixTQUFBLENBQVUsSUFBVixDQUExQixFQURGO1NBQUEsTUFBQTtpQkFHRSxNQUFBLENBQU8sU0FBQSxDQUFVLElBQVYsQ0FBUCxFQUhGO1NBRE07TUFBQSxDQURSO0tBREYsRUFEaUI7RUFBQSxDQXhEbkIsQ0FBQTs7QUFBQSxFQWlFQSxpQkFBQSxHQUFvQixTQUFDLE1BQUQsRUFBUyxZQUFULEdBQUE7O01BQVMsZUFBYTtLQUN4QztXQUFBLE1BQUEsQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsb0JBQW5CLEVBQXdDLElBQXhDLENBQU47QUFBQSxNQUNBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUNOLE1BQUEsQ0FBTyxZQUFZLENBQUMsTUFBYixDQUFvQixrQkFBQSxDQUFtQixJQUFuQixDQUFwQixDQUFQLEVBRE07TUFBQSxDQURSO0tBREYsRUFEa0I7RUFBQSxDQWpFcEIsQ0FBQTs7QUFBQSxFQXVFQSxPQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMsSUFBVCxHQUFBO1dBQ1IsTUFBQSxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLEtBQWYsRUFBc0IsSUFBdEIsQ0FBTjtBQUFBLE1BQ0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQVUsTUFBQSxDQUFPLGFBQUEsQ0FBYyxJQUFkLENBQVAsRUFBVjtNQUFBLENBRFI7S0FERixFQURRO0VBQUEsQ0F2RVYsQ0FBQTs7QUFBQSxFQTRFQSxlQUFBLEdBQWtCLFNBQUEsR0FBQTtXQUNoQixNQUFBLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxXQUFSLEVBQXFCLElBQXJCLEVBQTJCLEdBQTNCLENBQU47QUFBQSxNQUNBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQSxDQURSO0tBREYsRUFEZ0I7RUFBQSxDQTVFbEIsQ0FBQTs7QUFBQSxFQWlGQSxNQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxRQUFBLGdDQUFBO0FBQUEsMEJBRFEsT0FBNkIsSUFBNUIsWUFBQSxNQUFNLGNBQUEsUUFBUSxjQUFBLFFBQVEsWUFBQSxJQUMvQixDQUFBOztNQUFBLE9BQVEsU0FBQyxJQUFELEdBQUE7QUFDTixRQUFBLElBQUcsSUFBQSxLQUFRLENBQVg7aUJBQ00sSUFBQSxVQUFBLENBQVc7QUFBQSxZQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsWUFBaUIsT0FBQSxFQUFVLFFBQUEsR0FBTyxnQkFBQSxPQUFPLFdBQVAsQ0FBbEM7V0FBWCxFQUROO1NBRE07TUFBQTtLQUFSO1dBR0EsTUFBQSxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxLQUFELEVBQVEsT0FBUixpQkFBaUIsT0FBTyxHQUF4QixDQUFOO0FBQUEsTUFDQSxNQUFBLEVBQWtCLGNBQVYsR0FBQSxNQUFBLEdBQUEsTUFEUjtBQUFBLE1BRUEsTUFBQSxFQUFrQixjQUFWLEdBQUEsTUFBQSxHQUFBLE1BRlI7QUFBQSxNQUdBLElBQUEsRUFBTSxJQUhOO0tBREYsRUFKTztFQUFBLENBakZULENBQUE7O0FBQUEsRUEyRkEsUUFBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsUUFBQSxzQ0FBQTtBQUFBLDBCQURVLE9BQW1DLElBQWxDLGtCQUFBLFlBQVksY0FBQSxRQUFRLGNBQUEsUUFBUSxZQUFBLElBQ3ZDLENBQUE7O01BQUEsT0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsSUFBRyxJQUFBLEtBQVEsQ0FBWDtpQkFDTSxJQUFBLFVBQUEsQ0FBVztBQUFBLFlBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxZQUFpQixPQUFBLEVBQVMsNkNBQTFCO1dBQVgsRUFETjtTQURNO01BQUE7S0FBUjtXQUdBLE1BQUEsQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLFVBQVYsQ0FBTjtBQUFBLE1BQ0EsTUFBQSxFQUFrQixjQUFWLEdBQUEsTUFBQSxHQUFBLE1BRFI7QUFBQSxNQUVBLE1BQUEsRUFBa0IsY0FBVixHQUFBLE1BQUEsR0FBQSxNQUZSO0FBQUEsTUFHQSxJQUFBLEVBQU0sSUFITjtLQURGLEVBSlM7RUFBQSxDQTNGWCxDQUFBOztBQUFBLEVBcUdBLFlBQUEsR0FBZSxTQUFBLEdBQUE7V0FDYixNQUFBLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQU47QUFBQSxNQUNBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUNGLElBQUEsVUFBQSxDQUFXO0FBQUEsVUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFVBQWlCLE9BQUEsRUFBUyxzQkFBMUI7U0FBWCxFQURFO01BQUEsQ0FEUjtLQURGLEVBRGE7RUFBQSxDQXJHZixDQUFBOztBQUFBLEVBMkdBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixRQUFBLElBQUE7eUVBQXNDLE1BRDFCO0VBQUEsQ0EzR2QsQ0FBQTs7QUFBQSxFQThHQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixRQUFBLGNBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFBeEIsQ0FBQTtXQUNBLEtBQUE7O0FBQWE7V0FBQSxzREFBQTt1QkFBQTtBQUNYLHNCQUFBO0FBQUEsVUFBQyxJQUFBLEVBQU0sSUFBUDtBQUFBLFVBQWEsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUF4QjtVQUFBLENBRFc7QUFBQTs7U0FGSDtFQUFBLENBOUdaLENBQUE7O0FBQUEsRUFtSEEsa0JBQUEsR0FBcUIsU0FBQyxJQUFELEdBQUE7QUFDbkIsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFpQixZQUFqQjtBQUFBLGFBQU8sRUFBUCxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFEeEIsQ0FBQTtXQUVBLEtBQUE7O0FBQWE7V0FBQSwyQ0FBQTt3QkFBQTtBQUNYLHNCQUFBO0FBQUEsVUFBQyxJQUFBLEVBQU0sR0FBUDtBQUFBLFVBQVksSUFBQSxFQUFNLElBQWxCO1VBQUEsQ0FEVztBQUFBOztTQUhNO0VBQUEsQ0FuSHJCLENBQUE7O0FBQUEsRUF5SEEsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLFFBQUEsVUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsMEJBQVgsQ0FBUCxDQUFBO0FBQUEsSUFDQTs7QUFBd0I7QUFBQTtXQUFBLDRDQUFBO3lCQUFBO0FBQUEsc0JBQUEsSUFBQSxHQUFPLEtBQVAsQ0FBQTtBQUFBOztRQUF4QixJQUF1QixJQUR2QixDQUFBO1dBRUEsS0FIYztFQUFBLENBekhoQixDQUFBOztBQUFBLEVBbUlBLEdBQUEsR0FBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLFFBQUEsNkJBQUE7O01BREssYUFBVztLQUNoQjtBQUFBLElBQUEsS0FBQSxHQUFRLEtBQVIsQ0FBQTtBQUNBLElBQUEsSUFBRyxVQUFIO0FBQ0UsTUFBQSxJQUFHLFNBQUEsR0FBWSxZQUFBLENBQUEsQ0FBZjtBQUNFLFFBQUEsS0FBQSxHQUFRLFNBQVMsQ0FBQyxtQkFBVixDQUFBLENBQVIsQ0FERjtPQURGO0tBREE7QUFJQSxJQUFBLElBQUcsQ0FBQSxLQUFIO0FBQ0UsTUFBQSxLQUFBLDZHQUF3RCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsQ0FBQSxDQUF4RCxDQURGO0tBSkE7V0FNQSxNQVBJO0VBQUEsQ0FuSU4sQ0FBQTs7QUFBQSxFQTZJQSxVQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxRQUFBLHlCQUFBO21OQUFrRixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsSUFBeEIsRUFEdkU7RUFBQSxDQTdJYixDQUFBOztBQUFBLEVBaUpBLFlBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtBQUNiLFFBQUEsV0FBQTs7TUFBQSwrREFBd0MsQ0FBRSxPQUFsQyxDQUFBO0tBQVI7MkRBQ3NCLENBQUUsSUFBSSxDQUFDLGdCQUE3QixDQUE4QyxJQUE5QyxXQUZhO0VBQUEsQ0FqSmYsQ0FBQTs7QUFBQSxFQXFKQSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQWYsR0FBcUIsTUFySnJCLENBQUE7O0FBQUEsRUFzSkEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFmLEdBQTZCLGNBdEo3QixDQUFBOztBQUFBLEVBdUpBLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZixHQUErQixnQkF2Si9CLENBQUE7O0FBQUEsRUF3SkEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFmLEdBQXNCLE9BeEp0QixDQUFBOztBQUFBLEVBeUpBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixHQUF5QixlQXpKekIsQ0FBQTs7QUFBQSxFQTBKQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0IsU0ExSnhCLENBQUE7O0FBQUEsRUEySkEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFmLEdBQXVCLFlBM0p2QixDQUFBOztBQUFBLEVBNEpBLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBZixHQUFxQixNQTVKckIsQ0FBQTs7QUFBQSxFQTZKQSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQWYsR0FBcUIsR0E3SnJCLENBQUE7O0FBQUEsRUE4SkEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFmLEdBQTRCLFVBOUo1QixDQUFBOztBQUFBLEVBK0pBLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBZixHQUE4QixZQS9KOUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lildude/.atom/packages/git-plus/lib/git.coffee