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


    /* Public */

    PluginManagement.prototype.provideMinimapServiceV1 = function() {
      return this;
    };

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

    return PluginManagement;

  })(Mixin);

}).call(this);
