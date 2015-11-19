(function() {
  var $, $$, Emitter, ScrollView, TreeNode, TreeView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, ScrollView = _ref.ScrollView;

  Emitter = require('event-kit').Emitter;

  module.exports = {
    TreeNode: TreeNode = (function(_super) {
      __extends(TreeNode, _super);

      function TreeNode() {
        this.dblClickItem = __bind(this.dblClickItem, this);
        this.clickItem = __bind(this.clickItem, this);
        return TreeNode.__super__.constructor.apply(this, arguments);
      }

      TreeNode.content = function(_arg) {
        var children, icon, label;
        label = _arg.label, icon = _arg.icon, children = _arg.children;
        if (children) {
          return this.li({
            "class": 'list-nested-item list-selectable-item'
          }, (function(_this) {
            return function() {
              _this.div({
                "class": 'list-item'
              }, function() {
                return _this.span({
                  "class": "icon " + icon
                }, label);
              });
              return _this.ul({
                "class": 'list-tree'
              }, function() {
                var child, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = children.length; _i < _len; _i++) {
                  child = children[_i];
                  _results.push(_this.subview('child', new TreeNode(child)));
                }
                return _results;
              });
            };
          })(this));
        } else {
          return this.li({
            "class": 'list-item list-selectable-item'
          }, (function(_this) {
            return function() {
              return _this.span({
                "class": "icon " + icon
              }, label);
            };
          })(this));
        }
      };

      TreeNode.prototype.initialize = function(item) {
        this.emitter = new Emitter;
        this.item = item;
        this.item.view = this;
        this.on('dblclick', this.dblClickItem);
        return this.on('click', this.clickItem);
      };

      TreeNode.prototype.setCollapsed = function() {
        if (this.item.children) {
          return this.toggleClass('collapsed');
        }
      };

      TreeNode.prototype.setSelected = function() {
        return this.addClass('selected');
      };

      TreeNode.prototype.onDblClick = function(callback) {
        var child, _i, _len, _ref1, _results;
        this.emitter.on('on-dbl-click', callback);
        if (this.item.children) {
          _ref1 = this.item.children;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            _results.push(child.view.onDblClick(callback));
          }
          return _results;
        }
      };

      TreeNode.prototype.onSelect = function(callback) {
        var child, _i, _len, _ref1, _results;
        this.emitter.on('on-select', callback);
        if (this.item.children) {
          _ref1 = this.item.children;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            _results.push(child.view.onSelect(callback));
          }
          return _results;
        }
      };

      TreeNode.prototype.clickItem = function(event) {
        var $target, left, right, selected, width;
        if (this.item.children) {
          selected = this.hasClass('selected');
          this.removeClass('selected');
          $target = this.find('.list-item:first');
          left = $target.position().left;
          right = $target.children('span').position().left;
          width = right - left;
          if (event.offsetX <= width) {
            this.toggleClass('collapsed');
          }
          if (selected) {
            this.addClass('selected');
          }
          if (event.offsetX <= width) {
            return false;
          }
        }
        this.emitter.emit('on-select', {
          node: this,
          item: this.item
        });
        return false;
      };

      TreeNode.prototype.dblClickItem = function(event) {
        this.emitter.emit('on-dbl-click', {
          node: this,
          item: this.item
        });
        return false;
      };

      return TreeNode;

    })(View),
    TreeView: TreeView = (function(_super) {
      __extends(TreeView, _super);

      function TreeView() {
        this.sortByRow = __bind(this.sortByRow, this);
        this.sortByName = __bind(this.sortByName, this);
        this.toggleTypeVisible = __bind(this.toggleTypeVisible, this);
        this.traversal = __bind(this.traversal, this);
        this.onSelect = __bind(this.onSelect, this);
        return TreeView.__super__.constructor.apply(this, arguments);
      }

      TreeView.content = function() {
        return this.div({
          "class": '-tree-view-'
        }, (function(_this) {
          return function() {
            return _this.ul({
              "class": 'list-tree has-collapsable-children',
              outlet: 'root'
            });
          };
        })(this));
      };

      TreeView.prototype.initialize = function() {
        TreeView.__super__.initialize.apply(this, arguments);
        return this.emitter = new Emitter;
      };

      TreeView.prototype.deactivate = function() {
        return this.remove();
      };

      TreeView.prototype.onSelect = function(callback) {
        return this.emitter.on('on-select', callback);
      };

      TreeView.prototype.setRoot = function(root, ignoreRoot) {
        if (ignoreRoot == null) {
          ignoreRoot = true;
        }
        this.rootNode = new TreeNode(root);
        this.rootNode.onDblClick((function(_this) {
          return function(_arg) {
            var item, node;
            node = _arg.node, item = _arg.item;
            return node.setCollapsed();
          };
        })(this));
        this.rootNode.onSelect((function(_this) {
          return function(_arg) {
            var item, node;
            node = _arg.node, item = _arg.item;
            _this.clearSelect();
            node.setSelected();
            return _this.emitter.emit('on-select', {
              node: node,
              item: item
            });
          };
        })(this));
        this.root.empty();
        return this.root.append($$(function() {
          return this.div((function(_this) {
            return function() {
              var child, _i, _len, _ref1, _results;
              if (ignoreRoot) {
                _ref1 = root.children;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  child = _ref1[_i];
                  _results.push(_this.subview('child', child.view));
                }
                return _results;
              } else {
                return _this.subview('root', root.view);
              }
            };
          })(this));
        }));
      };

      TreeView.prototype.traversal = function(root, doing) {
        var child, _i, _len, _ref1, _results;
        doing(root.item);
        if (root.item.children) {
          _ref1 = root.item.children;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            _results.push(this.traversal(child.view, doing));
          }
          return _results;
        }
      };

      TreeView.prototype.toggleTypeVisible = function(type) {
        return this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            if (item.type === type) {
              return item.view.toggle();
            }
          };
        })(this));
      };

      TreeView.prototype.sortByName = function(ascending) {
        if (ascending == null) {
          ascending = true;
        }
        this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            var _ref1;
            return (_ref1 = item.children) != null ? _ref1.sort(function(a, b) {
              if (ascending) {
                return a.name.localeCompare(b.name);
              } else {
                return b.name.localeCompare(a.name);
              }
            }) : void 0;
          };
        })(this));
        return this.setRoot(this.rootNode.item);
      };

      TreeView.prototype.sortByRow = function(ascending) {
        if (ascending == null) {
          ascending = true;
        }
        this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            var _ref1;
            return (_ref1 = item.children) != null ? _ref1.sort(function(a, b) {
              if (ascending) {
                return a.position.row - b.position.row;
              } else {
                return b.position.row - a.position.row;
              }
            }) : void 0;
          };
        })(this));
        return this.setRoot(this.rootNode.item);
      };

      TreeView.prototype.clearSelect = function() {
        return $('.list-selectable-item').removeClass('selected');
      };

      TreeView.prototype.select = function(item) {
        this.clearSelect();
        return item != null ? item.view.setSelected() : void 0;
      };

      return TreeView;

    })(ScrollView)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvc3ltYm9scy10cmVlLXZpZXcvbGliL3RyZWUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMERBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxZQUFBLElBQVIsRUFBYyxrQkFBQSxVQUFkLENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxXQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFnQjtBQUNkLGlDQUFBLENBQUE7Ozs7OztPQUFBOztBQUFBLE1BQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFlBQUEscUJBQUE7QUFBQSxRQURVLGFBQUEsT0FBTyxZQUFBLE1BQU0sZ0JBQUEsUUFDdkIsQ0FBQTtBQUFBLFFBQUEsSUFBRyxRQUFIO2lCQUNFLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyx1Q0FBUDtXQUFKLEVBQW9ELENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQSxHQUFBO0FBQ2xELGNBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxXQUFQO2VBQUwsRUFBeUIsU0FBQSxHQUFBO3VCQUN2QixLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsa0JBQUEsT0FBQSxFQUFRLE9BQUEsR0FBTyxJQUFmO2lCQUFOLEVBQTZCLEtBQTdCLEVBRHVCO2NBQUEsQ0FBekIsQ0FBQSxDQUFBO3FCQUVBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxnQkFBQSxPQUFBLEVBQU8s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

//# sourceURL=/Users/lildude/.atom/packages/symbols-tree-view/lib/tree-view.coffee
