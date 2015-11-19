(function() {
  var $, SelectListView, TextEditorView, View, fuzzyFilter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  fuzzyFilter = require('fuzzaldrin').filter;

  TextEditorView = require('./text-editor-view');

  atom.themes.requireStylesheet(require.resolve('../stylesheets/select-list.less'));

  module.exports = SelectListView = (function(_super) {
    __extends(SelectListView, _super);

    function SelectListView() {
      return SelectListView.__super__.constructor.apply(this, arguments);
    }

    SelectListView.content = function() {
      return this.div({
        "class": 'select-list'
      }, (function(_this) {
        return function() {
          _this.subview('filterEditorView', new TextEditorView({
            mini: true
          }));
          _this.div({
            "class": 'error-message',
            outlet: 'error'
          });
          _this.div({
            "class": 'loading',
            outlet: 'loadingArea'
          }, function() {
            _this.span({
              "class": 'loading-message',
              outlet: 'loading'
            });
            return _this.span({
              "class": 'badge',
              outlet: 'loadingBadge'
            });
          });
          return _this.ol({
            "class": 'list-group',
            outlet: 'list'
          });
        };
      })(this));
    };

    SelectListView.prototype.maxItems = Infinity;

    SelectListView.prototype.scheduleTimeout = null;

    SelectListView.prototype.inputThrottle = 50;

    SelectListView.prototype.cancelling = false;


    /*
    Section: Construction
     */

    SelectListView.prototype.initialize = function() {
      this.filterEditorView.getModel().getBuffer().onDidChange((function(_this) {
        return function() {
          return _this.schedulePopulateList();
        };
      })(this));
      this.filterEditorView.on('blur', (function(_this) {
        return function(e) {
          if (!_this.cancelling) {
            return _this.cancel();
          }
        };
      })(this));
      atom.commands.add(this.element, {
        'core:move-up': (function(_this) {
          return function(event) {
            _this.selectPreviousItemView();
            return event.stopPropagation();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function(event) {
            _this.selectNextItemView();
            return event.stopPropagation();
          };
        })(this),
        'core:move-to-top': (function(_this) {
          return function(event) {
            _this.selectItemView(_this.list.find('li:first'));
            _this.list.scrollToTop();
            return event.stopPropagation();
          };
        })(this),
        'core:move-to-bottom': (function(_this) {
          return function(event) {
            _this.selectItemView(_this.list.find('li:last'));
            _this.list.scrollToBottom();
            return event.stopPropagation();
          };
        })(this),
        'core:confirm': (function(_this) {
          return function(event) {
            _this.confirmSelection();
            return event.stopPropagation();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function(event) {
            _this.cancel();
            return event.stopPropagation();
          };
        })(this)
      });
      this.list.on('mousedown', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if (target === _this.list[0]) {
            return false;
          }
        };
      })(this));
      this.list.on('mousedown', 'li', (function(_this) {
        return function(e) {
          _this.selectItemView($(e.target).closest('li'));
          e.preventDefault();
          return false;
        };
      })(this));
      return this.list.on('mouseup', 'li', (function(_this) {
        return function(e) {
          if ($(e.target).closest('li').hasClass('selected')) {
            _this.confirmSelection();
          }
          e.preventDefault();
          return false;
        };
      })(this));
    };


    /*
    Section: Methods that must be overridden
     */

    SelectListView.prototype.viewForItem = function(item) {
      throw new Error("Subclass must implement a viewForItem(item) method");
    };

    SelectListView.prototype.confirmed = function(item) {
      throw new Error("Subclass must implement a confirmed(item) method");
    };


    /*
    Section: Managing the list of items
     */

    SelectListView.prototype.setItems = function(items) {
      this.items = items != null ? items : [];
      this.populateList();
      return this.setLoading();
    };

    SelectListView.prototype.getSelectedItem = function() {
      return this.getSelectedItemView().data('select-list-item');
    };

    SelectListView.prototype.getFilterKey = function() {};

    SelectListView.prototype.getFilterQuery = function() {
      return this.filterEditorView.getText();
    };

    SelectListView.prototype.setMaxItems = function(maxItems) {
      this.maxItems = maxItems;
    };

    SelectListView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, _i, _ref1;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        filteredItems = fuzzyFilter(this.items, filterQuery, {
          key: this.getFilterKey()
        });
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = _i = 0, _ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          item = filteredItems[i];
          itemView = $(this.viewForItem(item));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };


    /*
    Section: Messages to the user
     */

    SelectListView.prototype.setError = function(message) {
      if (message == null) {
        message = '';
      }
      if (message.length === 0) {
        return this.error.text('').hide();
      } else {
        this.setLoading();
        return this.error.text(message).show();
      }
    };

    SelectListView.prototype.setLoading = function(message) {
      if (message == null) {
        message = '';
      }
      if (message.length === 0) {
        this.loading.text("");
        this.loadingBadge.text("");
        return this.loadingArea.hide();
      } else {
        this.setError();
        this.loading.text(message);
        return this.loadingArea.show();
      }
    };

    SelectListView.prototype.getEmptyMessage = function(itemCount, filteredItemCount) {
      return 'No matches found';
    };


    /*
    Section: View Actions
     */

    SelectListView.prototype.cancel = function() {
      var filterEditorViewFocused;
      this.list.empty();
      this.cancelling = true;
      filterEditorViewFocused = this.filterEditorView.hasFocus();
      if (typeof this.cancelled === "function") {
        this.cancelled();
      }
      this.filterEditorView.setText('');
      if (filterEditorViewFocused) {
        this.restoreFocus();
      }
      this.cancelling = false;
      return clearTimeout(this.scheduleTimeout);
    };

    SelectListView.prototype.focusFilterEditor = function() {
      return this.filterEditorView.focus();
    };

    SelectListView.prototype.storeFocusedElement = function() {
      return this.previouslyFocusedElement = $(document.activeElement);
    };


    /*
    Section: Private
     */

    SelectListView.prototype.selectPreviousItemView = function() {
      var view;
      view = this.getSelectedItemView().prev();
      if (!view.length) {
        view = this.list.find('li:last');
      }
      return this.selectItemView(view);
    };

    SelectListView.prototype.selectNextItemView = function() {
      var view;
      view = this.getSelectedItemView().next();
      if (!view.length) {
        view = this.list.find('li:first');
      }
      return this.selectItemView(view);
    };

    SelectListView.prototype.selectItemView = function(view) {
      if (!view.length) {
        return;
      }
      this.list.find('.selected').removeClass('selected');
      view.addClass('selected');
      return this.scrollToItemView(view);
    };

    SelectListView.prototype.scrollToItemView = function(view) {
      var desiredBottom, desiredTop, scrollTop;
      scrollTop = this.list.scrollTop();
      desiredTop = view.position().top + scrollTop;
      desiredBottom = desiredTop + view.outerHeight();
      if (desiredTop < scrollTop) {
        return this.list.scrollTop(desiredTop);
      } else if (desiredBottom > this.list.scrollBottom()) {
        return this.list.scrollBottom(desiredBottom);
      }
    };

    SelectListView.prototype.restoreFocus = function() {
      var _ref1;
      return (_ref1 = this.previouslyFocusedElement) != null ? _ref1.focus() : void 0;
    };

    SelectListView.prototype.getSelectedItemView = function() {
      return this.list.find('li.selected');
    };

    SelectListView.prototype.confirmSelection = function() {
      var item;
      item = this.getSelectedItem();
      if (item != null) {
        return this.confirmed(item);
      } else {
        return this.cancel();
      }
    };

    SelectListView.prototype.schedulePopulateList = function() {
      var populateCallback;
      clearTimeout(this.scheduleTimeout);
      populateCallback = (function(_this) {
        return function() {
          if (_this.isOnDom()) {
            return _this.populateList();
          }
        };
      })(this);
      return this.scheduleTimeout = setTimeout(populateCallback, this.inputThrottle);
    };

    return SelectListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsWUFBUixDQUFxQixDQUFDLE1BRHBDLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBWixDQUE4QixPQUFPLENBQUMsT0FBUixDQUFnQixpQ0FBaEIsQ0FBOUIsQ0FKQSxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGFBQVA7T0FBTCxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxrQkFBVCxFQUFpQyxJQUFBLGNBQUEsQ0FBZTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47V0FBZixDQUFqQyxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO0FBQUEsWUFBd0IsTUFBQSxFQUFRLE9BQWhDO1dBQUwsQ0FEQSxDQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sU0FBUDtBQUFBLFlBQWtCLE1BQUEsRUFBUSxhQUExQjtXQUFMLEVBQThDLFNBQUEsR0FB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/node_modules/atom-space-pen-views/lib/select-list-view.coffee