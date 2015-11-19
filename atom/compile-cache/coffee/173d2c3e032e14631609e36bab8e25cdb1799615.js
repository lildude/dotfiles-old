(function() {
  var CompositeDisposable, Emitter, Main, Minimap, MinimapElement, MinimapPluginGeneratorView, PluginManagement, deprecate, semver, _ref, _ref1;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  PluginManagement = require('./mixins/plugin-management');

  _ref1 = [], Minimap = _ref1[0], MinimapElement = _ref1[1], MinimapPluginGeneratorView = _ref1[2], deprecate = _ref1[3], semver = _ref1[4];

  require('../vendor/resizeend');

  Main = (function() {
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
        type: 'number',
        "default": 1,
        minimum: .5
      },
      charHeight: {
        type: 'number',
        "default": 2,
        minimum: .5
      },
      interline: {
        type: 'number',
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
      scrollAnimation: {
        type: 'boolean',
        "default": false,
        description: "If this option is enabled then when you click the minimap it will scroll to the destination with animation"
      },
      devicePixelRatio: {
        type: 'number',
        minimum: 1,
        maximum: 3,
        "default": window.devicePixelRatio,
        description: 'The device pixel ratio used to draw the canvas on high-DPI device.'
      }
    };

    Main.prototype.active = false;

    function Main() {
      this.emitter = new Emitter;
      this.subscriptionsOfCommands = new CompositeDisposable;
      this.subscriptionsOfCommands.add(atom.commands.add('atom-workspace', {
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
      this.subscriptions = new CompositeDisposable;
      if (MinimapElement == null) {
        MinimapElement = require('./minimap-element');
      }
      MinimapElement.registerViewProvider();
    }

    Main.prototype.activate = function() {
      this.active = true;
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Main.prototype.deactivate = function() {
      var _ref2;
      this.deactivateAllPlugins();
      this.subscriptions.dispose();
      if ((_ref2 = this.editorsMinimaps) != null) {
        _ref2.forEach((function(_this) {
          return function(value, key) {
            value.destroy();
            return _this.editorsMinimaps["delete"](key);
          };
        })(this));
      }
      this.editorsMinimaps = void 0;
      this.toggled = false;
      return this.active = false;
    };

    Main.prototype.versionMatch = function(expectedVersion) {
      if (semver == null) {
        semver = require('semver');
      }
      return semver.satisfies(this.version, expectedVersion);
    };

    Main.prototype.toggle = function() {
      var _ref2;
      if (!this.active) {
        return;
      }
      if (this.toggled) {
        this.toggled = false;
        if ((_ref2 = this.editorsMinimaps) != null) {
          _ref2.forEach((function(_this) {
            return function(value, key) {
              value.destroy();
              return _this.editorsMinimaps["delete"](key);
            };
          })(this));
        }
        return this.subscriptions.dispose();
      } else {
        this.toggled = true;
        return this.initSubscriptions();
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

    Main.prototype.minimapForEditorElement = function(editorElement) {
      if (editorElement == null) {
        return;
      }
      return this.minimapForEditor(editorElement.getModel());
    };

    Main.prototype.minimapForEditor = function(textEditor) {
      var editorSubscription, minimap;
      if (textEditor == null) {
        return;
      }
      if (Minimap == null) {
        Minimap = require('./minimap');
      }
      if (this.editorsMinimaps == null) {
        this.editorsMinimaps = new Map;
      }
      minimap = this.editorsMinimaps.get(textEditor);
      if (minimap == null) {
        minimap = new Minimap({
          textEditor: textEditor
        });
        this.editorsMinimaps.set(textEditor, minimap);
        editorSubscription = textEditor.onDidDestroy((function(_this) {
          return function() {
            var _ref2;
            if ((_ref2 = _this.editorsMinimaps) != null) {
              _ref2["delete"](textEditor);
            }
            return editorSubscription.dispose();
          };
        })(this));
      }
      return minimap;
    };

    Main.prototype.getActiveMinimap = function() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    };

    Main.prototype.observeMinimaps = function(iterator) {
      var createdCallback, disposable, _ref2;
      if (iterator == null) {
        return;
      }
      if ((_ref2 = this.editorsMinimaps) != null) {
        _ref2.forEach(function(minimap) {
          return iterator(minimap);
        });
      }
      createdCallback = function(minimap) {
        return iterator(minimap);
      };
      disposable = this.onDidCreateMinimap(createdCallback);
      disposable.off = function() {
        deprecate('Use Disposable::dispose instead');
        return disposable.dispose();
      };
      return disposable;
    };

    Main.prototype.initSubscriptions = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          var editorElement, minimap, minimapElement;
          minimap = _this.minimapForEditor(textEditor);
          editorElement = atom.views.getView(textEditor);
          minimapElement = atom.views.getView(minimap);
          _this.emitter.emit('did-create-minimap', minimap);
          return minimapElement.attach();
        };
      })(this)));
    };

    return Main;

  })();

  module.exports = new Main();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlJQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBRm5CLENBQUE7O0FBQUEsRUFJQSxRQUEyRSxFQUEzRSxFQUFDLGtCQUFELEVBQVUseUJBQVYsRUFBMEIscUNBQTFCLEVBQXNELG9CQUF0RCxFQUFpRSxpQkFKakUsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsQ0FBUSxxQkFBUixDQU5BLENBQUE7O0FBQUEsRUF1Qk07QUFDSixJQUFBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLElBQTdCLENBQUEsQ0FBQTs7QUFFQTtBQUFBLGdCQUZBOztBQUFBLG1CQUtBLE9BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxPQUxwQyxDQUFBOztBQUFBLG1CQVFBLE1BQUEsR0FDRTtBQUFBLE1BQUEsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FERjtBQUFBLE1BR0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FKRjtBQUFBLE1BTUEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BUEY7QUFBQSxNQVNBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlEQUZiO09BVkY7QUFBQSxNQWFBLHNCQUFBLEVBQ0U7QUFBQSxRQUFB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/main.coffee