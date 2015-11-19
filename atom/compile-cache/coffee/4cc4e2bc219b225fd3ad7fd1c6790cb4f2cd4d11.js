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
          atom.config.set(settingsKey, !atom.config.get(settingsKey));
          return _this.updatesPluginActivationState(name);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE9BQUEsR0FBUyxFQUFULENBQUE7O0FBQUEsK0JBQ0Esb0JBQUEsR0FBc0IsRUFEdEIsQ0FBQTs7QUFBQSwrQkFTQSxjQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUNkLFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQVQsR0FBaUIsTUFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLG9CQUFxQixDQUFBLElBQUEsQ0FBdEIsR0FBOEIsR0FBQSxDQUFBLG1CQUQ5QixDQUFBO0FBQUEsTUFHQSxLQUFBLEdBQVE7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sUUFBQSxNQUFQO09BSFIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0MsS0FBaEMsQ0FKQSxDQUFBO0FBTUEsTUFBQSxJQUF5QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQXpDO0FBQUEsUUFBQSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsSUFBeEIsRUFBOEIsTUFBOUIsQ0FBQSxDQUFBO09BTkE7YUFRQSxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsSUFBOUIsRUFUYztJQUFBLENBVGhCLENBQUE7O0FBQUEsK0JBdUJBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO0FBQ2hCLFVBQUEsYUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFsQixDQUFBO0FBQ0EsTUFBQSxJQUFtQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQW5DO0FBQUEsUUFBQSxJQUFDLENBQUEsd0JBQUQsQ0FBMEIsSUFBMUIsQ0FBQSxDQUFBO09BREE7QUFBQSxNQUVBLE1BQUEsQ0FBQSxJQUFRLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FGaEIsQ0FBQTtBQUFBLE1BSUEsS0FBQSxHQUFRO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLFFBQUEsTUFBUDtPQUpSLENBQUE7YUFLQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxtQkFBZCxFQUFtQyxLQUFuQyxFQU5nQjtJQUFBLENBdkJsQixDQUFBOztBQUFBLCtCQW9DQSw0QkFBQSxHQUE4QixTQUFDLElBQUQsR0FBQTtBQUM1QixVQUFBLDBDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQWxCLENBQUE7QUFBQSxNQUVBLFlBQUEsR0FBZSxNQUFNLENBQUMsUUFBUCxDQUFBLENBRmYsQ0FBQTtBQUFBLE1BR0EsYUFBQSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBaUIsa0JBQUEsR0FBaUIsSUFBbEMsQ0FIaEIsQ0FBQTtBQUFBLE1BS0EsS0FBQSxHQUFRO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLFFBQUEsTUFBUDtPQUxSLENBQUE7QUFPQSxNQUFBLElBQUcsYUFBQSxJQUFrQixDQUFBLFlBQXJCO0FBQ0UsUUFBQSxNQUFNLENBQUMsY0FBUCxDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHFCQUFkLEVBQXFDLEtBQXJDLEVBRkY7T0FBQSxNQUdLLElBQUcsWUFBQSxJQUFpQixDQUFBLGFBQXBCO0FBQ0gsUUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyx1QkFBZCxFQUF1QyxLQUF2QyxFQUZHO09BWHVCO0lBQUEsQ0FwQzlCLENBQUE7O0FBQUEsK0JBeURBLHNCQUFBLEdBQXdCLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUN0QixVQUFBLHFCQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWUsa0JBQUEsR0FBaUIsSUFBaEMsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVyxDQUFBLElBQUEsQ0FBM0IsR0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BRkYsQ0FBQTtBQUtBLE1BQUEsSUFBMEMsb0NBQTFDO0FBQUEsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsV0FBaEIsRUFBNkIsSUFBN0IsQ0FBQSxDQUFBO09BTEE7QUFBQSxNQU9BLElBQUMsQ0FBQSxvQkFBcUIsQ0FBQSxJQUFBLENBQUssQ0FBQyxHQUE1QixDQUFnQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsV0FBcEIsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDL0QsS0FBQyxDQUFBLDRCQUFELENBQThCLElBQTlCLEVBRCtEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakMsQ0FBaEMsQ0FQQSxDQUFBO0FBQUEsTUFVQSxRQUFBLEdBQVcsRUFWWCxDQUFBO0FBQUEsTUFXQSxRQUFTLENBQUMsaUJBQUEsR0FBZ0IsSUFBakIsQ0FBVCxHQUFxQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ25DLFVBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFdBQWhCLEVBQTZCLENBQUEsSUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFdBQWhCLENBQWpDLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsNEJBQUQsQ0FBOEIsSUFBOUIsRUFGbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVhyQyxDQUFBO2FBZUEsSUFBQyxDQUFBLG9CQUFxQixDQUFBLElBQUEsQ0FBSyxDQUFDLEdBQTVCLENBQWdDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsUUFBcEMsQ0FBaEMsRUFoQnNCO0lBQUEsQ0F6RHhCLENBQUE7O0FBQUEsK0JBZ0ZBLHdCQUFBLEdBQTBCLFNBQUMsSUFBRCxHQUFBO0FBQ3hCLE1BQUEsSUFBQyxDQUFBLG9CQUFxQixDQUFBLElBQUEsQ0FBSyxDQUFDLE9BQTVCLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQUEsSUFBUSxDQUFBLG9CQUFxQixDQUFBLElBQUEsQ0FEN0IsQ0FBQTthQUVBLE1BQUEsQ0FBQSxJQUFRLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFXLENBQUEsSUFBQSxFQUhWO0lBQUEsQ0FoRjFCLENBQUE7OzRCQUFBOztLQUY2QixNQWYvQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/plugin-management.coffee