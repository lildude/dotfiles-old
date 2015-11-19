(function() {
  var WhiteCursor;

  WhiteCursor = (function() {
    function WhiteCursor() {}

    WhiteCursor.prototype.config = {
      darkThemes: {
        type: 'array',
        "default": [],
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
          return function(_arg) {
            _arg;
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
      return this.remove();
    };

    WhiteCursor.prototype.add = function() {
      return this.workspace().classList.add(this.className);
    };

    WhiteCursor.prototype.hasDarkSyntaxTheme = function() {
      var classNames, name, regex, regexps, themeName, _i, _j, _len, _len1, _ref;
      classNames = this.workspace().className;
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
      return this.workspace().classList.remove(this.className);
    };

    WhiteCursor.prototype.toggle = function() {
      return this.workspace().classList.toggle(this.className);
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

    WhiteCursor.prototype.workspace = function() {
      return document.querySelector('.workspace');
    };

    return WhiteCursor;

  })();

  module.exports = new WhiteCursor();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBTTs2QkFDSjs7QUFBQSwwQkFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7T0FERjtBQUFBLE1BS0EsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLFFBRFQ7QUFBQSxRQUVBLE1BQUEsRUFBTSxDQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXFCLE9BQXJCLENBRk47T0FORjtLQURGLENBQUE7O0FBQUEsMEJBWUEsU0FBQSxHQUFXLGNBWlgsQ0FBQTs7QUFBQSwwQkFlQSxhQUFBLEdBQWUsSUFmZixDQUFBOztBQUFBLDBCQWtCQSxjQUFBLEdBQWdCLElBbEJoQixDQUFBOztBQUFBLDBCQXFCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxTQUFBOztRQUFBLElBQUMsQ0FBQSxpQkFBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUM1QyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBRDRDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0I7T0FBbkI7QUFBQSxNQUdBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIscUJBQTNCLEVBQWtELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2hELEtBQUMsQ0FBQSxNQUFELENBQUEsRUFEZ0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFB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
//# sourceURL=/Users/lildude/.atom/packages/white-cursor/lib/white-cursor.coffee