(function() {
  module.exports = {
    config: {
      coloured: {
        type: 'boolean',
        "default": true,
        description: 'Untick this for colourless icons'
      },
      forceShow: {
        type: 'boolean',
        "default": false,
        description: 'Force show icons - for themes that hide icons'
      },
      onChanges: {
        type: 'boolean',
        "default": false,
        description: 'Only colour icons when file is modified'
      }
    },
    activate: function(state) {
      atom.config.onDidChange('file-icons.coloured', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.colour(newValue);
        };
      })(this));
      this.colour(atom.config.get('file-icons.coloured'));
      atom.config.onDidChange('file-icons.forceShow', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.forceShow(newValue);
        };
      })(this));
      this.forceShow(atom.config.get('file-icons.forceShow'));
      atom.config.onDidChange('file-icons.onChanges', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.onChanges(newValue);
        };
      })(this));
      return this.onChanges(atom.config.get('file-icons.onChanges'));
    },
    deactivate: function() {},
    serialize: function() {},
    colour: function(enable) {
      var body;
      body = document.querySelector('body');
      if (enable) {
        return body.className = body.className.replace(/\sfile-icons-colourless/, '');
      } else {
        return body.className = "" + body.className + " file-icons-colourless";
      }
    },
    forceShow: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-force-show-icons";
      } else {
        return body.className = className.replace(/\sfile-icons-force-show-icons/, '');
      }
    },
    onChanges: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-on-changes";
      } else {
        return body.className = className.replace(/\sfile-icons-on-changes/, '');
      }
    }
  };

}).call(this);
