(function() {
  var BufferedProcess, GitRepository, StatusView, dir, getRepo, getSubmodule, gitAdd, gitCmd, gitDiff, gitMerge, gitRefreshIndex, gitResetHead, gitStagedFiles, gitStatus, gitUnstagedFiles, gitUntrackedFiles, relativize, _getGitPath, _prettify, _prettifyDiff, _prettifyUntracked, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, GitRepository = _ref.GitRepository;

  StatusView = require('./views/status-view');

  gitCmd = function(_arg) {
    var args, c_stdout, command, error, exit, options, stderr, stdout, _ref1;
    _ref1 = _arg != null ? _arg : {}, args = _ref1.args, options = _ref1.options, stdout = _ref1.stdout, stderr = _ref1.stderr, exit = _ref1.exit;
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
          type: 'error',
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
    try {
      return new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    } catch (_error) {
      error = _error;
      return new StatusView({
        type: 'error',
        message: 'Git Plus is unable to locate git command. Please ensure process.env.PATH can access git.'
      });
    }
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
        if (data.toString().includes("ambiguous argument 'HEAD'")) {
          return files = [1];
        } else {
          new StatusView({
            type: 'error',
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
    var repo, _ref1;
    repo = GitRepository.open((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0, {
      refreshOnWindowFocus: false
    });
    if (repo === !null) {
      repo.refreshStatus();
      repo.destroy();
    } else {
      if (repo = atom.project.getRepositories()[0]) {
        repo.refreshStatus();
      }
    }
    return gitCmd({
      args: ['add', '--refresh', '--', '.'],
      stderr: function(data) {}
    });
  };

  gitAdd = function(_arg) {
    var exit, file, stderr, stdout, _ref1;
    _ref1 = _arg != null ? _arg : {}, file = _ref1.file, stdout = _ref1.stdout, stderr = _ref1.stderr, exit = _ref1.exit;
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
    var branchName, exit, stderr, stdout, _ref1;
    _ref1 = _arg != null ? _arg : {}, branchName = _ref1.branchName, stdout = _ref1.stdout, stderr = _ref1.stderr, exit = _ref1.exit;
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
    var _ref1;
    return (_ref1 = atom.config.get('git-plus.gitPath')) != null ? _ref1 : 'git';
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
    var line, _ref1;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(_ref1 = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        line = _ref2[_i];
        _results.push('@@' + line);
      }
      return _results;
    })())), _ref1;
    return data;
  };

  dir = function(andSubmodules) {
    var submodule, _ref1, _ref2;
    if (andSubmodules == null) {
      andSubmodules = true;
    }
    if (andSubmodules) {
      if (submodule = getSubmodule()) {
        return submodule.getWorkingDirectory();
      }
    }
    return (_ref1 = (_ref2 = getRepo()) != null ? _ref2.getWorkingDirectory() : void 0) != null ? _ref1 : atom.project.getPath();
  };

  relativize = function(path) {
    var _ref1, _ref2, _ref3, _ref4;
    return (_ref1 = (_ref2 = (_ref3 = getSubmodule(path)) != null ? _ref3.relativize(path) : void 0) != null ? _ref2 : (_ref4 = atom.project.getRepositories()[0]) != null ? _ref4.relativize(path) : void 0) != null ? _ref1 : path;
  };

  getSubmodule = function(path) {
    var _ref1, _ref2;
    if (path == null) {
      path = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
    }
    return (_ref2 = atom.project.getRepositories()[0]) != null ? _ref2.repo.submoduleForPath(path) : void 0;
  };

  getRepo = function() {
    var data, repo, _ref1;
    repo = GitRepository.open((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0, {
      refreshOnWindowFocus: false
    });
    if (repo !== null) {
      data = {
        references: repo.getReferences(),
        shortHead: repo.getShortHead(),
        workingDirectory: repo.getWorkingDirectory()
      };
      repo.destroy();
      return {
        getReferences: function() {
          return data.references;
        },
        getShortHead: function() {
          return data.shortHead;
        },
        getWorkingDirectory: function() {
          return data.workingDirectory;
        }
      };
    } else {
      return atom.project.getRepositories()[0];
    }
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

  module.exports.getRepo = getRepo;

}).call(this);
