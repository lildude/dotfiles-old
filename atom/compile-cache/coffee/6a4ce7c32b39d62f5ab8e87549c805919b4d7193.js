(function() {
  var CompositeDisposable, Emitter, Minimap, MinimapPluginGeneratorView, PluginManagement, ViewManagement, deprecate, semver, _ref, _ref1;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  _ref1 = [], MinimapPluginGeneratorView = _ref1[0], deprecate = _ref1[1], semver = _ref1[2];

  require('../vendor/resizeend');

  Minimap = (function() {
    ViewManagement.includeInto(Minimap);

    PluginManagement.includeInto(Minimap);


    /* Public */

    Minimap.prototype.version = require('../package.json').version;

    Minimap.prototype.config = {
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
      }
    };

    Minimap.prototype.active = false;

    function Minimap() {
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
    }

    Minimap.prototype.activate = function() {
      var workspaceElement;
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
              var editor, _ref2;
              editor = atom.workspace.getActiveEditor();
              if (editor != null) {
                return (_ref2 = _this.minimapForEditor(editor)) != null ? _ref2.openQuickSettings.mousedown() : void 0;
              }
            };
          })(this)
        }));
      }
      this.subscriptions.add(atom.config.observe('minimap.displayMinimapOnLeft', function(value) {
        return workspaceElement.classList.toggle('minimap-on-left', value);
      }));
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Minimap.prototype.deactivate = function() {
      this.active = false;
      this.destroyViews();
      return this.emitter.emit('did-deactivate');
    };

    Minimap.prototype.versionMatch = function(expectedVersion) {
      if (semver == null) {
        semver = require('semver');
      }
      return semver.satisfies(this.version, expectedVersion);
    };

    Minimap.prototype.toggle = function() {
      if (this.active) {
        this.active = false;
        return this.deactivate();
      } else {
        this.createViews();
        this.active = true;
        return this.emitter.emit('did-activate');
      }
    };

    Minimap.prototype.generatePlugin = function() {
      var view;
      if (MinimapPluginGeneratorView == null) {
        MinimapPluginGeneratorView = require('./minimap-plugin-generator-view');
      }
      return view = new MinimapPluginGeneratorView();
    };

    Minimap.prototype.onDidActivate = function(callback) {
      return this.emitter.on('did-activate', callback);
    };

    Minimap.prototype.onDidDeactivate = function(callback) {
      return this.emitter.on('did-deactivate', callback);
    };

    Minimap.prototype.onDidCreateMinimap = function(callback) {
      return this.emitter.on('did-create-minimap', callback);
    };

    Minimap.prototype.onWillDestroyMinimap = function(callback) {
      return this.emitter.on('will-destroy-minimap', callback);
    };

    Minimap.prototype.onDidDestroyMinimap = function(callback) {
      return this.emitter.on('did-destroy-minimap', callback);
    };

    Minimap.prototype.onDidAddPlugin = function(callback) {
      return this.emitter.on('did-add-plugin', callback);
    };

    Minimap.prototype.onDidRemovePlugin = function(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    };

    Minimap.prototype.onDidActivatePlugin = function(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    };

    Minimap.prototype.onDidDeactivatePlugin = function(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    };

    return Minimap;

  })();

  module.exports = new Minimap();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1JQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUhuQixDQUFBOztBQUFBLEVBS0EsUUFBa0QsRUFBbEQsRUFBQyxxQ0FBRCxFQUE2QixvQkFBN0IsRUFBd0MsaUJBTHhDLENBQUE7O0FBQUEsRUFPQSxPQUFBLENBQVEscUJBQVIsQ0FQQSxDQUFBOztBQUFBLEVBd0JNO0FBQ0osSUFBQSxjQUFjLENBQUMsV0FBZixDQUEyQixPQUEzQixDQUFBLENBQUE7O0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixPQUE3QixDQURBLENBQUE7O0FBR0E7QUFBQSxnQkFIQTs7QUFBQSxzQkFNQSxPQUFBLEdBQVMsT0FBQSxDQUFRLGlCQUFSLENBQTBCLENBQUMsT0FOcEMsQ0FBQTs7QUFBQSxzQkFTQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFVBQUEsRUFBWSxFQURaO09BREY7QUFBQSxNQUdBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQVBGO0FBQUEsTUFTQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap.coffee