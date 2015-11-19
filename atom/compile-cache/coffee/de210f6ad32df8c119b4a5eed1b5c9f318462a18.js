(function() {
  var $, CompositeDisposable, Minimap, MinimapQuickSettingsView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  $ = View.__super__.constructor;

  Minimap = require('./minimap');

  module.exports = MinimapQuickSettingsView = (function(_super) {
    __extends(MinimapQuickSettingsView, _super);

    function MinimapQuickSettingsView() {
      this.selectPreviousItem = __bind(this.selectPreviousItem, this);
      this.selectNextItem = __bind(this.selectNextItem, this);
      this.toggleSelectedItem = __bind(this.toggleSelectedItem, this);
      this.destroy = __bind(this.destroy, this);
      return MinimapQuickSettingsView.__super__.constructor.apply(this, arguments);
    }

    MinimapQuickSettingsView.content = function() {
      return this.div({
        "class": 'select-list popover-list minimap-quick-settings'
      }, (function(_this) {
        return function() {
          _this.input({
            type: 'text',
            "class": 'hidden-input',
            outlet: 'hiddenInput'
          });
          return _this.ol({
            "class": 'list-group mark-active',
            outlet: 'list'
          }, function() {
            _this.li({
              "class": 'separator',
              outlet: 'separator'
            });
            return _this.li({
              "class": '',
              outlet: 'codeHighlights'
            }, 'code-highlights');
          });
        };
      })(this));
    };

    MinimapQuickSettingsView.prototype.selectedItem = null;

    MinimapQuickSettingsView.prototype.initialize = function(minimapView) {
      this.minimapView = minimapView;
      this.subscriptions = new CompositeDisposable;
      this.plugins = {};
      this.subscriptions.add(Minimap.onDidAddPlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.addItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Minimap.onDidRemovePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.removeItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Minimap.onDidActivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.activateItem(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Minimap.onDidDeactivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.deactivateItem(name, plugin);
        };
      })(this)));
      this.on('core:move-up', this.selectPreviousItem);
      this.on('core:move-down', this.selectNextItem);
      this.on('core:cancel', this.destroy);
      this.on('core:validate', this.toggleSelectedItem);
      this.codeHighlights.toggleClass('active', this.minimapView.displayCodeHighlights);
      this.codeHighlights.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.minimapView.setDisplayCodeHighlights(!_this.minimapView.displayCodeHighlights);
          return _this.codeHighlights.toggleClass('active', _this.minimapView.displayCodeHighlights);
        };
      })(this));
      this.hiddenInput.on('focusout', this.destroy);
      return this.initList();
    };

    MinimapQuickSettingsView.prototype.attach = function() {
      atom.workspaceView.append(this);
      return this.hiddenInput.focus();
    };

    MinimapQuickSettingsView.prototype.destroy = function() {
      this.trigger('minimap:quick-settings-destroyed');
      this.off();
      this.hiddenInput.off();
      this.codeHighlights.off();
      this.subscriptions.dispose();
      return this.detach();
    };

    MinimapQuickSettingsView.prototype.initList = function() {
      var name, plugin, _ref, _results;
      _ref = Minimap.plugins;
      _results = [];
      for (name in _ref) {
        plugin = _ref[name];
        _results.push(this.addItemFor(name, plugin));
      }
      return _results;
    };

    MinimapQuickSettingsView.prototype.toggleSelectedItem = function() {
      return this.selectedItem.mousedown();
    };

    MinimapQuickSettingsView.prototype.selectNextItem = function() {
      this.selectedItem.removeClass('selected');
      if (this.selectedItem.index() !== this.list.children().length - 1) {
        this.selectedItem = this.selectedItem.next();
        if (this.selectedItem.is('.separator')) {
          this.selectedItem = this.selectedItem.next();
        }
      } else {
        this.selectedItem = this.list.children().first();
      }
      return this.selectedItem.addClass('selected');
    };

    MinimapQuickSettingsView.prototype.selectPreviousItem = function() {
      this.selectedItem.removeClass('selected');
      if (this.selectedItem.index() !== 0) {
        this.selectedItem = this.selectedItem.prev();
        if (this.selectedItem.is('.separator')) {
          this.selectedItem = this.selectedItem.prev();
        }
      } else {
        this.selectedItem = this.list.children().last();
      }
      return this.selectedItem.addClass('selected');
    };

    MinimapQuickSettingsView.prototype.addItemFor = function(name, plugin) {
      var cls, item;
      cls = plugin.isActive() ? 'active' : '';
      item = $("<li class='" + cls + "'>" + name + "</li>");
      item.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.trigger("minimap:toggle-" + name);
        };
      })(this));
      this.plugins[name] = item;
      this.separator.before(item);
      if (this.selectedItem == null) {
        this.selectedItem = item;
        return this.selectedItem.addClass('selected');
      }
    };

    MinimapQuickSettingsView.prototype.removeItemFor = function(name, plugin) {
      this.list.remove(this.plugins[name]);
      return delete this.plugins[name];
    };

    MinimapQuickSettingsView.prototype.activateItem = function(name, plugin) {
      return this.plugins[name].addClass('active');
    };

    MinimapQuickSettingsView.prototype.deactivateItem = function(name, plugin) {
      return this.plugins[name].removeClass('active');
    };

    return MinimapQuickSettingsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FGbkIsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUpWLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0NBQUEsQ0FBQTs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLHdCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxpREFBUDtPQUFMLEVBQStELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDN0QsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLFlBQWMsT0FBQSxFQUFPLGNBQXJCO0FBQUEsWUFBcUMsTUFBQSxFQUFRLGFBQTdDO1dBQVAsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyx3QkFBUDtBQUFBLFlBQWlDLE1BQUEsRUFBUSxNQUF6QztXQUFKLEVBQXFELFNBQUEsR0FBQTtBQUNuRCxZQUFBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxjQUFBLE9BQUEsRUFBTyxXQUFQO0FBQUEsY0FBb0IsTUFBQSxFQUFRLFdBQTVCO2FBQUosQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxjQUFBLE9BQUEsRUFB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-quick-settings-view.coffee