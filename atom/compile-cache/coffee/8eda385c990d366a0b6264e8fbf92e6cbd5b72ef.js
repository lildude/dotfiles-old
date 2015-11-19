(function() {
  var WhiteCursor;

  WhiteCursor = (function() {
    function WhiteCursor() {}

    WhiteCursor.prototype.config = {
      darkThemes: {
        type: 'array',
        "default": [],
        description: 'List of syntax theme names or partial names to categorize as dark on auto-detection, in case they do not contain the word "dark" in them.',
        items: {
          type: 'string'
        }
      },
      enabled: {
        type: 'string',
        "default": 'always',
        "enum": ['always', 'detect', 'never']
      }
    };

    WhiteCursor.prototype.className = 'white-cursor';

    WhiteCursor.prototype.configChanged = null;

    WhiteCursor.prototype.themesReloaded = null;

    WhiteCursor.prototype.activate = function() {
      var paneAdded;
      if (this.themesReloaded == null) {
        this.themesReloaded = atom.themes.onDidChangeActiveThemes((function(_this) {
          return function() {
            return _this.update();
          };
        })(this));
      }
      this.command = atom.commands.add('atom-workspace', 'white-cursor:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      if (this.configChanged == null) {
        this.configChanged = atom.config.onDidChange('white-cursor.enabled', (function(_this) {
          return function() {
            return _this.update();
          };
        })(this));
      }
      if (this.darkThemesChanged == null) {
        this.darkThemesChanged = atom.config.onDidChange('white-cursor.darkThemes', (function(_this) {
          return function() {
            return _this.update();
          };
        })(this));
      }
      return paneAdded = atom.workspace.onDidAddPane((function(_this) {
        return function() {
          _this.update();
          return paneAdded.dispose();
        };
      })(this));
    };

    WhiteCursor.prototype.deactivate = function() {
      this.command.dispose();
      this.command = null;
      this.themesReloaded.dispose();
      this.themesReloaded = null;
      this.configChanged.dispose();
      this.configChanged = null;
      this.darkThemesChanged.dispose();
      this.darkThemesChanged = null;
      return this.remove();
    };

    WhiteCursor.prototype.add = function() {
      return this.workspaceElement().classList.add(this.className);
    };

    WhiteCursor.prototype.hasDarkSyntaxTheme = function() {
      var classNames, name, regex, regexps, themeName, _i, _j, _len, _len1, _ref;
      classNames = this.workspaceElement().className;
      regexps = (function() {
        var _i, _len, _ref, _results;
        _ref = atom.config.get('white-cursor.darkThemes');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          themeName = _ref[_i];
          _results.push(new RegExp(themeName));
        }
        return _results;
      })();
      _ref = classNames.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (!/theme/.test(name)) {
          continue;
        }
        if (/syntax/.test(name) && /dark/.test(name)) {
          return true;
        }
        for (_j = 0, _len1 = regexps.length; _j < _len1; _j++) {
          regex = regexps[_j];
          if (regex.test(name)) {
            return true;
          }
        }
      }
      return false;
    };

    WhiteCursor.prototype.remove = function() {
      return this.workspaceElement().classList.remove(this.className);
    };

    WhiteCursor.prototype.toggle = function() {
      return this.workspaceElement().classList.toggle(this.className);
    };

    WhiteCursor.prototype.update = function() {
      switch (false) {
        case atom.config.get('white-cursor.enabled') !== 'always':
          return this.add();
        case atom.config.get('white-cursor.enabled') !== 'never':
          return this.remove();
        case !this.hasDarkSyntaxTheme():
          return this.add();
        default:
          return this.remove();
      }
    };

    WhiteCursor.prototype.workspaceElement = function() {
      return atom.views.getView(atom.workspace);
    };

    return WhiteCursor;

  })();

  module.exports = new WhiteCursor();

}).call(this);
