(function() {
  var Note, NoteDirectory, fs, path, pathWatcher;

  path = require('path');

  fs = require('fs-plus');

  pathWatcher = require('pathwatcher');

  Note = require('./note');

  module.exports = NoteDirectory = (function() {
    function NoteDirectory(filePath, parent, onChangeCallback) {
      this.filePath = filePath;
      this.parent = parent;
      this.onChangeCallback = onChangeCallback;
      this.directories = [];
      this.notes = [];
      this.updateMetadata();
      this.watcher = pathWatcher.watch(this.filePath, (function(_this) {
        return function(event) {
          return _this.onChange(event);
        };
      })(this));
    }

    NoteDirectory.prototype.destroy = function() {
      this.notes.map(function(x) {
        return x.destroy();
      });
      this.directories.map(function(x) {
        return x.destroy();
      });
      return this.watcher.close();
    };

    NoteDirectory.prototype.updateMetadata = function() {
      var e, filename, filenames, _i, _len, _results;
      this.notes.map(function(x) {
        return x.destroy();
      });
      this.directories.map(function(x) {
        return x.destroy();
      });
      this.directories = [];
      this.notes = [];
      try {
        filenames = fs.readdirSync(this.filePath);
      } catch (_error) {
        e = _error;
        return;
      }
      _results = [];
      for (_i = 0, _len = filenames.length; _i < _len; _i++) {
        filename = filenames[_i];
        _results.push(this.addChild(path.join(this.filePath, filename)));
      }
      return _results;
    };

    NoteDirectory.prototype.addChild = function(filePath) {
      var e, fileStat;
      try {
        fileStat = fs.statSync(filePath);
      } catch (_error) {
        e = _error;
        return;
      }
      if (fileStat.isDirectory()) {
        return this.directories.push(new NoteDirectory(filePath, this, this.onChangeCallback));
      } else {
        if (fs.isMarkdownExtension(path.extname(filePath))) {
          return this.notes.push(new Note(filePath, this, this.onChangeCallback));
        }
      }
    };

    NoteDirectory.prototype.getNotes = function() {
      var directory, ret, _i, _len, _ref;
      ret = [];
      ret = ret.concat(this.notes);
      _ref = this.directories;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        directory = _ref[_i];
        ret = ret.concat(directory.getNotes());
      }
      if (this.parent === null) {
        ret.sort(function(x, y) {
          if (x.getModified().getTime() <= y.getModified().getTime()) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      return ret;
    };

    NoteDirectory.prototype.onChange = function(event) {
      if (event === 'change') {
        this.updateMetadata();
        if (this.onChangeCallback !== null) {
          return this.onChangeCallback();
        }
      }
    };

    return NoteDirectory;

  })();

}).call(this);
