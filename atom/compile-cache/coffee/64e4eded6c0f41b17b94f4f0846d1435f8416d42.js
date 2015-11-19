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