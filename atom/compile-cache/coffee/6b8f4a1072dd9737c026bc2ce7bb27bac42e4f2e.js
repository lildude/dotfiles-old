(function() {
  var CompositeDisposable, Emitter, Main, MinimapPluginGeneratorView, PluginManagement, V4Main, ViewManagement, deprecate, semver, _ref, _ref1;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  V4Main = null;

  _ref1 = [], MinimapPluginGeneratorView = _ref1[0], deprecate = _ref1[1], semver = _ref1[2];

  require('../vendor/resizeend');

  Main = (function() {
    ViewManagement.includeInto(Main);

    PluginManagement.includeInto(Main);


    /* Public */

    Main.prototype.version = require('../package.json').version;

    Main.prototype.config = {
      plugins: {
        type: 'object',
        properties: {}
      },
      autoToggle: {
        type: 'boolean',
        "default": true
      },
      displayMinimapOnLeft: {
        type: 'boolean',
        "default": false
      },
      displayCodeHighlights: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the render of the buffer tokens in the minimap.'
      },
      displayPluginsControls: {
        type: 'boolean',
        "default": true,
        description: 'You need to restart Atom for this setting to be effective.'
      },
      minimapScrollIndicator: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the display of a side line showing which part of the buffer is currently displayed by the minimap. This side line will only appear if the minimap is taller than the editor view height.'
      },
      useHardwareAcceleration: {
        type: 'boolean',
        "default": true
      },
      adjustMinimapWidthToSoftWrap: {
        type: 'boolean',
        "default": true,
        description: 'If this option is enabled and Soft Wrap is checked then the Minimap max width is set to the Preferred Line Length value.'
      },
      charWidth: {
        type: 'integer',
        "default": 1,
        minimum: 1
      },
      charHeight: {
        type: 'integer',
        "default": 2,
        minimum: 1
      },
      interline: {
        type: 'integer',
        "default": 1,
        minimum: 0,
        description: 'The space between lines in the minimap in pixels.'
      },
      textOpacity: {
        type: 'number',
        "default": 0.6,
        minimum: 0,
        maximum: 1,
        description: "The opacity used to render the line's text in the minimap."
      },
      v4Preview: {
        type: 'boolean',
        "default": false,
        description: "Require Atom restart. Some plugins may be disabled if they don't support the new API."
      }
    };

    Main.prototype.active = false;

    function Main() {
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
    }

    Main.prototype.activate = function() {
      var workspaceElement;
      this.v4Preview = atom.config.get('minimap.v4Preview');
      if (this.v4Preview) {
        this.version = '4.0.0-preview';
        V4Main = require('./main-v4');
        V4Main.includeInto(Main);
        this.activateV4();
      } else {
        this.subscriptions.add(atom.commands.add('atom-workspace', {
          'minimap:toggle': (function(_this) {
            return function() {
              return _this.toggle();
            };
          })(this),
          'minimap:generate-plugin': (function(_this) {
            return function() {
              return _this.generatePlugin();
            };
          })(this)
        }));
        workspaceElement = atom.views.getView(atom.workspace);
        if (atom.config.get('minimap.displayPluginsControls')) {
          this.subscriptions.add(atom.commands.add('atom-workspace', {
            'minimap:open-quick-settings': (function(_this) {
              return function() {
                var editor;
                editor = atom.workspace.getActiveEditor();
                return _this.minimapForEditor(editor).openQuickSettings.mousedown();
              };
            })(this)
          }));
        }
        this.subscriptions.add(atom.config.observe('minimap.displayMinimapOnLeft', function(value) {
          return workspaceElement.classList.toggle('minimap-on-left', value);
        }));
      }
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Main.prototype.deactivate = function() {
      this.active = false;
      this.destroyViews();
      return this.emitter.emit('did-deactivate');
    };

    Main.prototype.versionMatch = function(expectedVersion) {
      if (semver == null) {
        semver = require('semver');
      }
      return semver.satisfies(this.version, expectedVersion);
    };

    Main.prototype.toggle = function() {
      if (this.active) {
        this.active = false;
        return this.deactivate();
      } else {
        this.createViews();
        this.active = true;
        return this.emitter.emit('did-activate');
      }
    };

    Main.prototype.generatePlugin = function() {
      var view;
      if (MinimapPluginGeneratorView == null) {
        MinimapPluginGeneratorView = require('./minimap-plugin-generator-view');
      }
      return view = new MinimapPluginGeneratorView();
    };

    Main.prototype.onDidActivate = function(callback) {
      return this.emitter.on('did-activate', callback);
    };

    Main.prototype.onDidDeactivate = function(callback) {
      return this.emitter.on('did-deactivate', callback);
    };

    Main.prototype.onDidCreateMinimap = function(callback) {
      return this.emitter.on('did-create-minimap', callback);
    };

    Main.prototype.onWillDestroyMinimap = function(callback) {
      return this.emitter.on('will-destroy-minimap', callback);
    };

    Main.prototype.onDidDestroyMinimap = function(callback) {
      return this.emitter.on('did-destroy-minimap', callback);
    };

    Main.prototype.onDidAddPlugin = function(callback) {
      return this.emitter.on('did-add-plugin', callback);
    };

    Main.prototype.onDidRemovePlugin = function(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    };

    Main.prototype.onDidActivatePlugin = function(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    };

    Main.prototype.onDidDeactivatePlugin = function(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    };

    return Main;

  })();

  module.exports = new Main();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdJQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUhuQixDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLElBSlQsQ0FBQTs7QUFBQSxFQU1BLFFBQWtELEVBQWxELEVBQUMscUNBQUQsRUFBNkIsb0JBQTdCLEVBQXdDLGlCQU54QyxDQUFBOztBQUFBLEVBUUEsT0FBQSxDQUFRLHFCQUFSLENBUkEsQ0FBQTs7QUFBQSxFQXlCTTtBQUNKLElBQUEsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsSUFBM0IsQ0FBQSxDQUFBOztBQUFBLElBQ0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsSUFBN0IsQ0FEQSxDQUFBOztBQUdBO0FBQUEsZ0JBSEE7O0FBQUEsbUJBTUEsT0FBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUixDQUEwQixDQUFDLE9BTnBDLENBQUE7O0FBQUEsbUJBU0EsTUFBQSxHQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQURGO0FBQUEsTUFHQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQUpGO0FBQUEsTUFNQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FQRjtBQUFBLE1BU0EscUJBQUEsRUFDRTtBQUFBLFFB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/main.coffee