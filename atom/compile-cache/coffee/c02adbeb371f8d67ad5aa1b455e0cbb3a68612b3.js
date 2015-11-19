(function() {
  var CompositeDisposable, Emitter, EventsDelegation, Main, MinimapQuickSettingsElement, SpacePenDSL, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-utils'), EventsDelegation = _ref.EventsDelegation, SpacePenDSL = _ref.SpacePenDSL;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Emitter = _ref1.Emitter;

  Main = require('./main');

  module.exports = MinimapQuickSettingsElement = (function(_super) {
    __extends(MinimapQuickSettingsElement, _super);

    function MinimapQuickSettingsElement() {
      this.toggleSelectedItem = __bind(this.toggleSelectedItem, this);
      return MinimapQuickSettingsElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(MinimapQuickSettingsElement);

    EventsDelegation.includeInto(MinimapQuickSettingsElement);

    MinimapQuickSettingsElement.content = function() {
      return this.div({
        "class": 'select-list popover-list minimap-quick-settings'
      }, (function(_this) {
        return function() {
          _this.input({
            type: 'text',
            "class": 'hidden-input',
            outlet: 'hiddenInput'
          });
          _this.ol({
            "class": 'list-group mark-active',
            outlet: 'list'
          }, function() {
            _this.li({
              "class": 'separator',
              outlet: 'separator'
            });
            _this.li({
              "class": 'code-highlights',
              outlet: 'codeHighlights'
            }, 'code-highlights');
            return _this.li({
              "class": 'absolute-mode',
              outlet: 'absoluteMode'
            }, 'absolute-mode');
          });
          return _this.div({
            "class": 'btn-group'
          }, function() {
            _this.button({
              "class": 'btn btn-default',
              outlet: 'onLeftButton'
            }, 'On Left');
            return _this.button({
              "class": 'btn btn-default',
              outlet: 'onRightButton'
            }, 'On Right');
          });
        };
      })(this));
    };

    MinimapQuickSettingsElement.prototype.selectedItem = null;

    MinimapQuickSettingsElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.plugins = {};
      this.itemsActions = new WeakMap;
      this.subscriptions.add(Main.onDidAddPlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.addItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Main.onDidRemovePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.removeItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Main.onDidActivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.activateItem(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Main.onDidDeactivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.deactivateItem(name, plugin);
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('minimap-quick-settings', {
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
        'core:move-left': function() {
          return atom.config.set('minimap.displayMinimapOnLeft', true);
        },
        'core:move-right': function() {
          return atom.config.set('minimap.displayMinimapOnLeft', false);
        },
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
      this.codeHighlights.classList.toggle('active', this.minimap.displayCodeHighlights);
      this.subscriptions.add(this.subscribeTo(this.codeHighlights, {
        'mousedown': (function(_this) {
          return function(e) {
            e.preventDefault();
            return atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
          };
        })(this)
      }));
      this.itemsActions.set(this.codeHighlights, (function(_this) {
        return function() {
          return atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
        };
      })(this));
      this.subscriptions.add(this.subscribeTo(this.absoluteMode, {
        'mousedown': (function(_this) {
          return function(e) {
            e.preventDefault();
            return atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
          };
        })(this)
      }));
      this.itemsActions.set(this.absoluteMode, (function(_this) {
        return function() {
          return atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
        };
      })(this));
      this.subscriptions.add(this.subscribeTo(this.hiddenInput, {
        'focusout': (function(_this) {
          return function(e) {
            return _this.destroy();
          };
        })(this)
      }));
      this.subscriptions.add(this.subscribeTo(this.onLeftButton, {
        'mousedown': function(e) {
          e.preventDefault();
          return atom.config.set('minimap.displayMinimapOnLeft', true);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.onRightButton, {
        'mousedown': function(e) {
          e.preventDefault();
          return atom.config.set('minimap.displayMinimapOnLeft', false);
        }
      }));
      this.subscriptions.add(atom.config.observe('minimap.displayCodeHighlights', (function(_this) {
        return function(bool) {
          return _this.codeHighlights.classList.toggle('active', bool);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.absoluteMode', (function(_this) {
        return function(bool) {
          return _this.absoluteMode.classList.toggle('active', bool);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.displayMinimapOnLeft', (function(_this) {
        return function(bool) {
          _this.onLeftButton.classList.toggle('selected', bool);
          return _this.onRightButton.classList.toggle('selected', !bool);
        };
      })(this)));
      return this.initList();
    };

    MinimapQuickSettingsElement.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    MinimapQuickSettingsElement.prototype.attach = function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.appendChild(this);
      return this.hiddenInput.focus();
    };

    MinimapQuickSettingsElement.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      return this.parentNode.removeChild(this);
    };

    MinimapQuickSettingsElement.prototype.initList = function() {
      var name, plugin, _ref2, _results;
      this.itemsDisposables = new WeakMap;
      _ref2 = Main.plugins;
      _results = [];
      for (name in _ref2) {
        plugin = _ref2[name];
        _results.push(this.addItemFor(name, plugin));
      }
      return _results;
    };

    MinimapQuickSettingsElement.prototype.toggleSelectedItem = function() {
      var _base;
      return typeof (_base = this.itemsActions.get(this.selectedItem)) === "function" ? _base() : void 0;
    };

    MinimapQuickSettingsElement.prototype.selectNextItem = function() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.nextSibling != null) {
        this.selectedItem = this.selectedItem.nextSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.nextSibling;
        }
      } else {
        this.selectedItem = this.list.firstChild;
      }
      return this.selectedItem.classList.add('selected');
    };

    MinimapQuickSettingsElement.prototype.selectPreviousItem = function() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.previousSibling != null) {
        this.selectedItem = this.selectedItem.previousSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.previousSibling;
        }
      } else {
        this.selectedItem = this.list.lastChild;
      }
      return this.selectedItem.classList.add('selected');
    };

    MinimapQuickSettingsElement.prototype.addItemFor = function(name, plugin) {
      var action, item;
      item = document.createElement('li');
      if (plugin.isActive()) {
        item.classList.add('active');
      }
      item.textContent = name;
      action = (function(_this) {
        return function() {
          return Main.togglePluginActivation(name);
        };
      })(this);
      this.itemsActions.set(item, action);
      this.itemsDisposables.set(item, this.addDisposableEventListener(item, 'mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return action();
        };
      })(this)));
      this.plugins[name] = item;
      this.list.insertBefore(item, this.separator);
      if (this.selectedItem == null) {
        this.selectedItem = item;
        return this.selectedItem.classList.add('selected');
      }
    };

    MinimapQuickSettingsElement.prototype.removeItemFor = function(name, plugin) {
      try {
        this.list.removeChild(this.plugins[name]);
      } catch (_error) {}
      return delete this.plugins[name];
    };

    MinimapQuickSettingsElement.prototype.activateItem = function(name, plugin) {
      return this.plugins[name].classList.add('active');
    };

    MinimapQuickSettingsElement.prototype.deactivateItem = function(name, plugin) {
      return this.plugins[name].classList.remove('active');
    };

    return MinimapQuickSettingsElement;

  })(HTMLElement);

  module.exports = MinimapQuickSettingsElement = document.registerElement('minimap-quick-settings', {
    prototype: MinimapQuickSettingsElement.prototype
  });

}).call(this);
