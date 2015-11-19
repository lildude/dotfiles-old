(function() {
  var Note, fs, path, pathWatcher;

  path = require('path');

  fs = require('fs');

  pathWatcher = require('pathwatcher');

  module.exports = Note = (function() {
    function Note(filePath, parent, onChangeCallback) {
      this.filePath = filePath;
      this.parent = parent;
      this.onChangeCallback = onChangeCallback;
      this.updateMetadata();
      this.updateText();
      this.watcher = pathWatcher.watch(this.filePath, (function(_this) {
        return function(event) {
          return _this.onChange(event);
        };
      })(this));
    }

    Note.prototype.destroy = function() {
      return this.watcher.close();
    };

    Note.prototype.updateMetadata = function() {
      var relativePath;
      this.modified = fs.statSync(this.filePath).mtime;
      relativePath = path.relative(atom.config.get('notational-velocity.directory'), this.filePath);
      return this.title = path.join(path.dirname(relativePath), path.basename(relativePath, path.extname(relativePath)));
    };

    Note.prototype.updateText = function() {
      return this.text = fs.readFileSync(this.filePath, 'utf8');
    };

    Note.prototype.onChange = function(event) {
      if (event === 'change' && fs.existsSync(this.filePath)) {
        this.updateMetadata();
        this.updateText();
        if (this.onChangeCallback !== null) {
          return this.onChangeCallback();
        }
      }
    };

    Note.prototype.getTitle = function() {
      return this.title;
    };

    Note.prototype.getText = function() {
      return this.text;
    };

    Note.prototype.getModified = function() {
      return this.modified;
    };

    Note.prototype.getFilePath = function() {
      return this.filePath;
    };

    return Note;

  })();

}).call(this);
