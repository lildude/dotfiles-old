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
        this.themesReloaded = atom.themes.onDidReloadAll((function(_this) {
          return function() {
            return _this.update();
          };
        })(this));
      }
      atom.workspaceView.command('white-cursor:toggle', (function(_this) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBTTs2QkFDSjs7QUFBQSwwQkFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsMklBRmI7QUFBQSxRQUlBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FMRjtPQURGO0FBQUEsTUFPQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsUUFEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsT0FBckIsQ0FGTjtPQVJGO0tBREYsQ0FBQTs7QUFBQSwwQkFjQSxTQUFBLEdBQVcsY0FkWCxDQUFBOztBQUFBLDBCQWlCQSxhQUFBLEdBQWUsSUFqQmYsQ0FBQTs7QUFBQSwwQkFvQkEsY0FBQSxHQUFnQixJQXBCaEIsQ0FBQTs7QUFBQSwwQkF1QkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsU0FBQTs7UUFBQSxJQUFDLENBQUEsaUJBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBWixDQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDNUMsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUQ0QztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCO09BQW5CO0FBQUEsTUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHFCQUEzQixFQUFrRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoRCxLQUFDLENBQUEsTUFBRCxDQUFBLEVB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
//# sourceURL=/Users/lildude/.atom/packages/white-cursor/lib/white-cursor.coffee