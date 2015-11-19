(function() {
  var Emitter, EmitterMixin, Minimap, MinimapPluginGeneratorView, PluginManagement, ViewManagement, deprecate, semver, _ref;

  EmitterMixin = require('emissary').Emitter;

  Emitter = require('event-kit').Emitter;

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  _ref = [], MinimapPluginGeneratorView = _ref[0], deprecate = _ref[1], semver = _ref[2];

  require('../vendor/resizeend');

  Minimap = (function() {
    EmitterMixin.includeInto(Minimap);

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
        minimum: 1,
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
    }

    Minimap.prototype.activate = function() {
      atom.workspaceView.command('minimap:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      atom.workspaceView.command("minimap:generate-plugin", (function(_this) {
        return function() {
          return _this.generatePlugin();
        };
      })(this));
      if (atom.config.get('minimap.displayPluginsControls')) {
        atom.workspaceView.command('minimap:open-quick-settings', function() {
          return atom.workspaceView.getActivePaneView().find('.minimap .open-minimap-quick-settings').mousedown();
        });
      }
      atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
      atom.config.observe('minimap.displayMinimapOnLeft', function() {
        return atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
      });
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Minimap.prototype.deactivate = function() {
      this.destroyViews();
      this.emit('deactivated');
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
        this.emit('activated');
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

    Minimap.prototype.on = function(eventName) {
      if (deprecate == null) {
        deprecate = require('grim').deprecate;
      }
      switch (eventName) {
        case 'activated':
          deprecate("Use Minimap::onDidActivate instead.");
          break;
        case 'deactivated':
          deprecate("Use Minimap::onDidDeactivate instead.");
          break;
        case 'minimap-view:created':
          deprecate("Use Minimap::onDidCreateMinimap instead.");
          break;
        case 'minimap-view:destroyed':
          deprecate("Use Minimap::onDidDestroyMinimap instead.");
          break;
        case 'minimap-view:will-be-destroyed':
          deprecate("Use Minimap::onWillDestroyMinimap instead.");
          break;
        case 'plugin:added':
          deprecate("Use Minimap::onDidAddPlugin instead.");
          break;
        case 'plugin:removed':
          deprecate("Use Minimap::onDidRemovePlugin instead.");
          break;
        case 'plugin:activated':
          deprecate("Use Minimap::onDidActivatePlugin instead.");
          break;
        case 'plugin:deactivated':
          deprecate("Use Minimap::onDidDeactivatePlugin instead.");
      }
      return EmitterMixin.prototype.on.apply(this, arguments);
    };

    return Minimap;

  })();

  module.exports = new Minimap();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFIQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxVQUFSLENBQW1CLENBQUMsT0FBbkMsQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLFdBQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwwQkFBUixDQUhqQixDQUFBOztBQUFBLEVBSUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBSm5CLENBQUE7O0FBQUEsRUFNQSxPQUFrRCxFQUFsRCxFQUFDLG9DQUFELEVBQTZCLG1CQUE3QixFQUF3QyxnQkFOeEMsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsQ0FBUSxxQkFBUixDQVJBLENBQUE7O0FBQUEsRUF5Qk07QUFDSixJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLE9BQXpCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLGNBQWMsQ0FBQyxXQUFmLENBQTJCLE9BQTNCLENBREEsQ0FBQTs7QUFBQSxJQUVBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLE9BQTdCLENBRkEsQ0FBQTs7QUFJQTtBQUFBLGdCQUpBOztBQUFBLHNCQU9BLE9BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxPQVBwQyxDQUFBOztBQUFBLHNCQVVBLE1BQUEsR0FDRTtBQUFBLE1BQUEsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FERjtBQUFBLE1BR0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FKRjtBQUFBLE1BTUEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap.coffee