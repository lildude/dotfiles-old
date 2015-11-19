(function() {
  var $, CompositeDisposable, Emitter, Minimap, MinimapQuickSettingsView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Emitter = _ref1.Emitter;

  Minimap = require('./main');

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
      this.emitter = new Emitter;
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
      this.subscriptions.add(atom.commands.add('.minimap-quick-settings', {
        'core:move-up': (function(_this) {
          return function() {
            return _this.selectPreviousItem();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function() {
            return _this.selectNextItem();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this),
        'core:confirm': (function(_this) {
          return function() {
            return _this.toggleSelectedItem();
          };
        })(this)
      }));
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

    MinimapQuickSettingsView.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    MinimapQuickSettingsView.prototype.attach = function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.appendChild(this.element);
      return this.hiddenInput.focus();
    };

    MinimapQuickSettingsView.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      this.off();
      this.hiddenInput.off();
      this.codeHighlights.off();
      this.subscriptions.dispose();
      return this.detach();
    };

    MinimapQuickSettingsView.prototype.initList = function() {
      var name, plugin, _ref2, _results;
      _ref2 = Minimap.plugins;
      _results = [];
      for (name in _ref2) {
        plugin = _ref2[name];
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
          return atom.commands.dispatch(item[0], "minimap:toggle-" + name);
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
      try {
        this.list.remove(this.plugins[name]);
      } catch (_error) {}
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0EsUUFBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyw0QkFBQSxtQkFBRCxFQUFzQixnQkFBQSxPQUR0QixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxRQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwrQ0FBQSxDQUFBOzs7Ozs7OztLQUFBOztBQUFBLElBQUEsd0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGlEQUFQO09BQUwsRUFBK0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3RCxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxZQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsWUFBYyxPQUFBLEVBQU8sY0FBckI7QUFBQSxZQUFxQyxNQUFBLEVBQVEsYUFBN0M7V0FBUCxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFlBQUEsT0FBQSxFQUFPLHdCQUFQO0FBQUEsWUFBaUMsTUFBQSxFQUFRLE1BQXpDO1dBQUosRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFlBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsT0FBQSxFQUFPLFdBQVA7QUFBQSxjQUFvQixNQUFBLEVBQVEsV0FBNUI7YUFBSixDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsT0FBQSxF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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-quick-settings-view.coffee