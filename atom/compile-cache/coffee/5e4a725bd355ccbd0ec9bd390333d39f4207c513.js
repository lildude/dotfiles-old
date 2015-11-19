(function() {
  var $, $$, SymbolsContextMenu, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  module.exports = SymbolsContextMenu = (function(_super) {
    __extends(SymbolsContextMenu, _super);

    function SymbolsContextMenu() {
      return SymbolsContextMenu.__super__.constructor.apply(this, arguments);
    }

    SymbolsContextMenu.content = function() {
      return this.div({
        "class": 'symbols-context-menu'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'select-list popover-list'
          }, function() {
            _this.input({
              type: 'text',
              "class": 'hidden-input',
              outlet: 'hiddenInput'
            });
            return _this.ol({
              "class": 'list-group mark-active',
              outlet: 'menus'
            });
          });
        };
      })(this));
    };

    SymbolsContextMenu.prototype.initialize = function() {
      return this.hiddenInput.on('focusout', (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
    };

    SymbolsContextMenu.prototype.clear = function() {
      return this.menus.empty();
    };

    SymbolsContextMenu.prototype.addMenu = function(name, active, callback) {
      var menu;
      menu = $$(function() {
        return this.li({
          "class": (active ? 'active' : '')
        }, name);
      });
      menu.on('mousedown', (function(_this) {
        return function() {
          menu.toggleClass('active');
          _this.hiddenInput.blur();
          return callback(name);
        };
      })(this));
      return this.menus.append(menu);
    };

    SymbolsContextMenu.prototype.toggle = function(type) {
      var menu, _i, _len, _ref1, _results;
      _ref1 = this.menus.find('li');
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        menu = _ref1[_i];
        if ($(menu).text() === type) {
          _results.push($(menu).toggleClass('active'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SymbolsContextMenu.prototype.addSeparator = function() {
      return this.menus.append($$(function() {
        return this.li({
          "class": 'separator'
        });
      }));
    };

    SymbolsContextMenu.prototype.show = function() {
      if (this.menus.children().length > 0) {
        SymbolsContextMenu.__super__.show.apply(this, arguments);
        return this.hiddenInput.focus();
      }
    };

    SymbolsContextMenu.prototype.attach = function() {
      return atom.views.getView(atom.workspace).appendChild(this.element);
    };

    return SymbolsContextMenu;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvc3ltYm9scy10cmVlLXZpZXcvbGliL3N5bWJvbHMtY29udGV4dC1tZW51LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsWUFBQSxJQUFSLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHNCQUFQO09BQUwsRUFBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbEMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLDBCQUFQO1dBQUwsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGNBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxjQUFjLE9BQUEsRUFBTyxjQUFyQjtBQUFBLGNBQXFDLE1BQUEsRUFBUSxhQUE3QzthQUFQLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsY0FBQSxPQUFBLEVBQU8sd0JBQVA7QUFBQSxjQUFpQyxNQUFBLEVBQVEsT0FBekM7YUFBSixFQUZzQztVQUFBLENBQXhDLEVBRGtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxpQ0FNQSxVQUFBLEdBQVksU0FBQSxHQUFB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

//# sourceURL=/Users/lildude/.atom/packages/symbols-tree-view/lib/symbols-context-menu.coffee
