(function() {
  var CompositeDisposable, Mixin, PluginManagement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = PluginManagement = (function(_super) {
    __extends(PluginManagement, _super);

    function PluginManagement() {
      return PluginManagement.__super__.constructor.apply(this, arguments);
    }

    PluginManagement.prototype.plugins = {};

    PluginManagement.prototype.pluginsSubscriptions = {};

    PluginManagement.prototype.registerPlugin = function(name, plugin) {
      var event;
      this.plugins[name] = plugin;
      this.pluginsSubscriptions[name] = new CompositeDisposable;
      event = {
        name: name,
        plugin: plugin
      };
      this.emitter.emit('did-add-plugin', event);
      if (atom.config.get('minimap.displayPluginsControls')) {
        this.registerPluginControls(name, plugin);
      }
      return this.updatesPluginActivationState(name);
    };

    PluginManagement.prototype.unregisterPlugin = function(name) {
      var event, plugin;
      plugin = this.plugins[name];
      if (atom.config.get('minimap.displayPluginsControls')) {
        this.unregisterPluginControls(name);
      }
      delete this.plugins[name];
      event = {
        name: name,
        plugin: plugin
      };
      return this.emitter.emit('did-remove-plugin', event);
    };

    PluginManagement.prototype.togglePluginActivation = function(name, boolean) {
      var settingsKey;
      if (boolean == null) {
        boolean = void 0;
      }
      settingsKey = "minimap.plugins." + name;
      if (boolean != null) {
        atom.config.set(settingsKey, boolean);
      } else {
        atom.config.set(settingsKey, !atom.config.get(settingsKey));
      }
      return this.updatesPluginActivationState(name);
    };

    PluginManagement.prototype.updatesPluginActivationState = function(name) {
      var event, plugin, pluginActive, settingActive;
      plugin = this.plugins[name];
      pluginActive = plugin.isActive();
      settingActive = atom.config.get("minimap.plugins." + name);
      event = {
        name: name,
        plugin: plugin
      };
      if (settingActive && !pluginActive) {
        plugin.activatePlugin();
        return this.emitter.emit('did-activate-plugin', event);
      } else if (pluginActive && !settingActive) {
        plugin.deactivatePlugin();
        return this.emitter.emit('did-deactivate-plugin', event);
      }
    };

    PluginManagement.prototype.registerPluginControls = function(name, plugin) {
      var commands, settingsKey;
      settingsKey = "minimap.plugins." + name;
      this.config.plugins.properties[name] = {
        type: 'boolean',
        "default": true
      };
      if (atom.config.get(settingsKey) == null) {
        atom.config.set(settingsKey, true);
      }
      this.pluginsSubscriptions[name].add(atom.config.observe(settingsKey, (function(_this) {
        return function() {
          return _this.updatesPluginActivationState(name);
        };
      })(this)));
      commands = {};
      commands["minimap:toggle-" + name] = (function(_this) {
        return function() {
          return _this.togglePluginActivation(name);
        };
      })(this);
      return this.pluginsSubscriptions[name].add(atom.commands.add('atom-workspace', commands));
    };

    PluginManagement.prototype.unregisterPluginControls = function(name) {
      this.pluginsSubscriptions[name].dispose();
      delete this.pluginsSubscriptions[name];
      return delete this.config.plugins.properties[name];
    };

    PluginManagement.prototype.deactivateAllPlugins = function() {
      var name, plugin, _ref, _results;
      _ref = this.plugins;
      _results = [];
      for (name in _ref) {
        plugin = _ref[name];
        _results.push(plugin.deactivatePlugin());
      }
      return _results;
    };

    return PluginManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE9BQUEsR0FBUyxFQUFULENBQUE7O0FBQUEsK0JBQ0Esb0JBQUEsR0FBc0IsRUFEdEIsQ0FBQTs7QUFBQSwrQkFTQSxjQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUNkLFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQVQsR0FBaUIsTUFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLG9CQUFxQixDQUFBLElBQUEsQ0FBdEIsR0FBOEIsR0FBQSxDQUFBLG1CQUQ5QixDQUFBO0FBQUEsTUFHQSxLQUFBLEdBQVE7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sUUFBQSxNQUFQO09BSFIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0MsS0FBaEMsQ0FKQSxDQUFBO0FBTUEsTUFBQSxJQUF5QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQXpDO0FBQUEsUUFBQSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsSUFBeEIsRUFBOEIsTUFBOUIsQ0FBQSxDQUFBO09BTkE7YUFRQSxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsSUFBOUIsRUFUYztJQUFBLENBVGhCLENBQUE7O0FBQUEsK0JBdUJBLGdCQUFBLEdBQWtCLFNBQUMsSUFB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/plugin-management.coffee