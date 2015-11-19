(function() {
  var SymbolsTreeView;

  SymbolsTreeView = require('./symbols-tree-view');

  module.exports = {
    config: {
      autoToggle: {
        type: 'boolean',
        "default": false,
        description: 'If this option is enabled then symbols-tree-view will auto open when you open files.'
      },
      scrollAnimation: {
        type: 'boolean',
        "default": true,
        description: 'If this option is enabled then when you click the item in symbols-tree it will scroll to the destination gradually.'
      },
      autoHide: {
        type: 'boolean',
        "default": false,
        description: 'If this option is enabled then symbols-tree-view is always hidden unless mouse hover over it.'
      },
      zAutoHideTypes: {
        title: 'AutoHideTypes',
        type: 'string',
        description: 'Here you can specify a list of types that will be hidden by default (ex: "variable class")',
        "default": ''
      }
    },
    symbolsTreeView: null,
    activate: function(state) {
      this.symbolsTreeView = new SymbolsTreeView(state.symbolsTreeViewState);
      atom.commands.add('atom-workspace', {
        'symbols-tree-view:toggle': (function(_this) {
          return function() {
            return _this.symbolsTreeView.toggle();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'symbols-tree-view:show': (function(_this) {
          return function() {
            return _this.symbolsTreeView.showView();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'symbols-tree-view:hide': (function(_this) {
          return function() {
            return _this.symbolsTreeView.hideView();
          };
        })(this)
      });
      atom.config.observe('tree-view.showOnRightSide', (function(_this) {
        return function(value) {
          if (_this.symbolsTreeView.hasParent()) {
            _this.symbolsTreeView.remove();
            _this.symbolsTreeView.populate();
            return _this.symbolsTreeView.attach();
          }
        };
      })(this));
      return atom.config.observe("symbols-tree-view.autoToggle", (function(_this) {
        return function(enabled) {
          if (enabled) {
            if (!_this.symbolsTreeView.hasParent()) {
              return _this.symbolsTreeView.toggle();
            }
          } else {
            if (_this.symbolsTreeView.hasParent()) {
              return _this.symbolsTreeView.toggle();
            }
          }
        };
      })(this));
    },
    deactivate: function() {
      return this.symbolsTreeView.destroy();
    },
    serialize: function() {
      return {
        symbolsTreeViewState: this.symbolsTreeView.serialize()
      };
    },
    getProvider: function() {
      var view;
      view = this.symbolsTreeView;
      return {
        getSuggestionForWord: (function(_this) {
          return function(textEditor, text, range) {
            return {
              range: range,
              callback: function() {
                return view.focusClickedTag.bind(view)(textEditor, text);
              }
            };
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvc3ltYm9scy10cmVlLXZpZXcvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHNGQUZiO09BREY7QUFBQSxNQUlBLGVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEscUhBRmI7T0FMRjtBQUFBLE1BUUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwrRkFGYjtPQVRGO0FBQUEsTUFZQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxlQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsV0FBQSxFQUFhLDRGQUZiO0FBQUEsUUFHQSxTQUFBLEVBQVMsRUFIVDtPQWJGO0tBREY7QUFBQSxJQXFCQSxlQUFBLEVBQWlCLElBckJqQjtBQUFBLElBdUJBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxlQUFBLENBQWdCLEtBQUssQ0FBQyxvQkFBdEIsQ0FBdkIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsMEJBQUEsRUFBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QjtPQUFwQyxDQURBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLHdCQUFBLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7T0FBcEMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSx3QkFBQSxFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO09BQXBDLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDJCQUFwQixFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDL0MsVUFBQSxJQUFHLEtBQUMsQ0FBQSxlQUFlLENBQUMsU0FBakIsQ0FBQSxDQUFIO0FBQ0UsWUFBQSxLQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQUEsQ0FEQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxlQUFlLENBQUMsTUFBakIsQ0FBQSxFQUhGO1dBRCtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakQsQ0FMQSxDQUFBO2FBV0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDhCQUFwQixFQUFvRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFDbEQsVUFBQSxJQUFHLE9BQUg7QUFDRSxZQUFBLElBQUEsQ0FBQSxLQUFrQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUFBLENBQWpDO3FCQUFBLEtBQUMsQ0FBQSxlQUFlLENBQUMsTUFBakIsQ0FBQSxFQUFBO2FBREY7V0FBQSxNQUFBO0FBR0UsWUFBQSxJQUE2QixLQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQUEsQ0FBN0I7cUJBQUEsS0FBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUFBLEVBQUE7YUFIRjtXQURrRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBELEVBWlE7SUFBQSxDQXZCVjtBQUFBLElBeUNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsZUFBZSxDQUFDLE9BQWpCLENBQUEsRUFEVTtJQUFBLENBekNaO0FBQUEsSUE0Q0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxvQkFBQSxFQUFzQixJQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQUEsQ0FBdEI7UUFEUztJQUFBLENBNUNYO0FBQUEsSUErQ0EsV0FBQSxFQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxlQUFSLENBQUE7YUFDQTtBQUFBLFFBQUUsb0JBQUEsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLEtBQW5CLEdBQUE7bUJBQ3RCO0FBQUEsY0FDRSxLQUFBLEVBQU8sS0FEVDtBQUFBLGNBRUUsUUFBQSxFQUFVLFNBQUEsR0FBQTt1QkFDUixJQUFJLENBQUMsZUFBZSxDQUFDLElBQXJCLENBQTBCLElBQTFCLENBQUEsQ0FBZ0MsVUFBaEMsRUFBNEMsSUFBNUMsRUFEUTtjQUFBLENBRlo7Y0FEc0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtRQUZXO0lBQUEsQ0EvQ2I7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/lildude/.atom/packages/symbols-tree-view/lib/main.coffee
