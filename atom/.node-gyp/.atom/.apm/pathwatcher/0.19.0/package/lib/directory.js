(function() {
  var Directory, Emitter, File, PathWatcher, async, fs, path;

  path = require('path');

  async = require('async');

  Emitter = require('emissary').Emitter;

  fs = require('fs-plus');

  File = require('./file');

  PathWatcher = require('./main');

  module.exports = Directory = (function() {
    Emitter.includeInto(Directory);

    Directory.prototype.realPath = null;

    function Directory(path, symlink) {
      this.path = path;
      this.symlink = symlink != null ? symlink : false;
      this.on('first-contents-changed-subscription-will-be-added', (function(_this) {
        return function() {
          return _this.subscribeToNativeChangeEvents();
        };
      })(this));
      this.on('last-contents-changed-subscription-removed', (function(_this) {
        return function() {
          return _this.unsubscribeFromNativeChangeEvents();
        };
      })(this));
    }

    Directory.prototype.getBaseName = function() {
      return path.basename(this.path);
    };

    Directory.prototype.getPath = function() {
      return this.path;
    };

    Directory.prototype.getRealPathSync = function() {
      var e;
      if (this.realPath == null) {
        try {
          this.realPath = fs.realpathSync(this.path);
        } catch (_error) {
          e = _error;
          this.realPath = this.path;
        }
      }
      return this.realPath;
    };

    Directory.prototype.contains = function(pathToCheck) {
      if (!pathToCheck) {
        return false;
      }
      if (pathToCheck.indexOf(path.join(this.getPath(), path.sep)) === 0) {
        return true;
      } else if (pathToCheck.indexOf(path.join(this.getRealPathSync(), path.sep)) === 0) {
        return true;
      } else {
        return false;
      }
    };

    Directory.prototype.relativize = function(fullPath) {
      if (!fullPath) {
        return fullPath;
      }
      if (process.platform === 'win32') {
        fullPath = fullPath.replace(/\//g, '\\');
      }
      if (fullPath === this.getPath()) {
        return '';
      } else if (this.isPathPrefixOf(this.getPath(), fullPath)) {
        return fullPath.substring(this.getPath().length + 1);
      } else if (fullPath === this.getRealPathSync()) {
        return '';
      } else if (this.isPathPrefixOf(this.getRealPathSync(), fullPath)) {
        return fullPath.substring(this.getRealPathSync().length + 1);
      } else {
        return fullPath;
      }
    };

    Directory.prototype.getEntriesSync = function() {
      var directories, entryPath, files, stat, symlink, _i, _len, _ref;
      directories = [];
      files = [];
      _ref = fs.listSync(this.path);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entryPath = _ref[_i];
        try {
          stat = fs.lstatSync(entryPath);
          symlink = stat.isSymbolicLink();
          if (symlink) {
            stat = fs.statSync(entryPath);
          }
        } catch (_error) {}
        if (stat != null ? stat.isDirectory() : void 0) {
          directories.push(new Directory(entryPath, symlink));
        } else if (stat != null ? stat.isFile() : void 0) {
          files.push(new File(entryPath, symlink));
        }
      }
      return directories.concat(files);
    };

    Directory.prototype.getEntries = function(callback) {
      return fs.list(this.path, function(error, entries) {
        var addEntry, directories, files, statEntry;
        if (error != null) {
          return callback(error);
        }
        directories = [];
        files = [];
        addEntry = function(entryPath, stat, symlink, callback) {
          if (stat != null ? stat.isDirectory() : void 0) {
            directories.push(new Directory(entryPath, symlink));
          } else if (stat != null ? stat.isFile() : void 0) {
            files.push(new File(entryPath, symlink));
          }
          return callback();
        };
        statEntry = function(entryPath, callback) {
          return fs.lstat(entryPath, function(error, stat) {
            if (stat != null ? stat.isSymbolicLink() : void 0) {
              return fs.stat(entryPath, function(error, stat) {
                return addEntry(entryPath, stat, true, callback);
              });
            } else {
              return addEntry(entryPath, stat, false, callback);
            }
          });
        };
        return async.eachLimit(entries, 1, statEntry, function() {
          return callback(null, directories.concat(files));
        });
      });
    };

    Directory.prototype.subscribeToNativeChangeEvents = function() {
      return this.watchSubscription != null ? this.watchSubscription : this.watchSubscription = PathWatcher.watch(this.path, (function(_this) {
        return function(eventType) {
          if (eventType === "change") {
            return _this.emit("contents-changed");
          }
        };
      })(this));
    };

    Directory.prototype.unsubscribeFromNativeChangeEvents = function() {
      if (this.watchSubscription != null) {
        this.watchSubscription.close();
        return this.watchSubscription = null;
      }
    };

    Directory.prototype.isPathPrefixOf = function(prefix, fullPath) {
      return fullPath.indexOf(prefix) === 0 && fullPath[prefix.length] === path.sep;
    };

    return Directory;

  })();

}).call(this);
