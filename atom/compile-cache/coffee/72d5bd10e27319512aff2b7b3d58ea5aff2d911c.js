(function() {
  var $, $$, NotationalVelocityView, Note, NoteDirectory, SelectListView, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  NoteDirectory = require('./note-directory');

  Note = require('./note');

  module.exports = NotationalVelocityView = (function(_super) {
    __extends(NotationalVelocityView, _super);

    function NotationalVelocityView() {
      return NotationalVelocityView.__super__.constructor.apply(this, arguments);
    }

    NotationalVelocityView.prototype.initialize = function() {
      NotationalVelocityView.__super__.initialize.apply(this, arguments);
      this.addClass('notational-velocity from-top overlay');
      this.rootDirectory = atom.config.get('notational-velocity.directory');
      if (!fs.existsSync(this.rootDirectory)) {
        throw new Error("The given directory " + this.rootDirectory + " does not exist. ", +"Set the note directory to the existing one from Settings.");
      }
      this.noteDirectory = new NoteDirectory(this.rootDirectory, null, (function(_this) {
        return function() {
          return _this.updateNotes();
        };
      })(this));
      this.updateNotes();
      this.prevFilterQuery = '';
      return this.prevCursorPosition = 0;
    };

    NotationalVelocityView.prototype.updateNotes = function() {
      this.notes = this.noteDirectory.getNotes();
      return this.setItems(this.notes);
    };

    NotationalVelocityView.prototype.selectItem = function(filterQuery) {
      var currCursorPosition, editor, titleItem, titleItems, titlePattern, titlePatterns, _i, _len;
      if (filterQuery.length === 0) {
        this.prevCursorPosition = 0;
        return null;
      }
      titlePatterns = [RegExp("^" + filterQuery + "$", "i"), RegExp("^" + filterQuery, "i")];
      titleItem = null;
      for (_i = 0, _len = titlePatterns.length; _i < _len; _i++) {
        titlePattern = titlePatterns[_i];
        titleItems = this.notes.filter(function(x) {
          return x.getTitle().match(titlePattern) !== null;
        });
        titleItem = titleItems.length > 0 ? titleItems[0] : null;
        if (titleItem !== null) {
          break;
        }
      }
      editor = this.filterEditorView.model;
      currCursorPosition = editor.getCursorBufferPosition().column;
      if (titleItem !== null && this.prevCursorPosition < currCursorPosition) {
        this.prevFilterQuery = titleItem.getTitle();
        editor.setText(titleItem.getTitle());
        editor.selectLeft(titleItem.getTitle().length - filterQuery.length);
      }
      this.prevCursorPosition = currCursorPosition;
      return titleItem;
    };

    NotationalVelocityView.prototype.filter = function(filterQuery) {
      var queries;
      if (filterQuery.length === 0) {
        return this.notes;
      }
      queries = filterQuery.split(' ').filter(function(x) {
        return x.length > 0;
      }).map(function(x) {
        return new RegExp(x, 'gi');
      });
      return this.notes.filter(function(x) {
        return queries.map(function(q) {
          return q.test(x.getText()) || q.test(x.getTitle());
        }).reduce(function(x, y) {
          return x && y;
        });
      });
    };

    NotationalVelocityView.prototype.getFilterKey = function() {
      return 'filetext';
    };

    NotationalVelocityView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.hide();
      } else {
        this.populateList();
        return this.show();
      }
    };

    NotationalVelocityView.prototype.viewForItem = function(item) {
      var content;
      content = item.getText().slice(0, 100);
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'primary-line'
            }, function() {
              _this.span("" + (item.getTitle()));
              return _this.div({
                "class": 'metadata'
              }, "" + (item.getModified().toLocaleDateString()));
            });
            return _this.div({
              "class": 'secondary-line'
            }, "" + content);
          };
        })(this));
      });
    };

    NotationalVelocityView.prototype.confirmSelection = function() {
      var filePath, item, sanitizedQuery;
      item = this.getSelectedItem();
      if (item != null) {
        atom.workspace.open(item.getFilePath());
        return this.cancel();
      } else {
        sanitizedQuery = this.getFilterQuery().replace(/\s+$/, '');
        if (sanitizedQuery.length > 0) {
          filePath = path.join(this.rootDirectory, sanitizedQuery + '.md');
          fs.writeFileSync(filePath, '');
          atom.workspace.open(filePath);
        }
        return this.cancel();
      }
    };

    NotationalVelocityView.prototype.destroy = function() {
      var _ref1;
      this.cancel();
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    NotationalVelocityView.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    NotationalVelocityView.prototype.cancelled = function() {
      return this.hide();
    };

    NotationalVelocityView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    NotationalVelocityView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, n, selectedItem, _i, _ref1;
      if (this.notes == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      filteredItems = this.filter(filterQuery);
      selectedItem = this.selectItem(filterQuery);
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = _i = 0, _ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          item = filteredItems[i];
          itemView = $(this.viewForItem(item));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        if (selectedItem) {
          n = filteredItems.indexOf(selectedItem) + 1;
          return this.selectItemView(this.list.find("li:nth-child(" + n + ")"));
        }
      } else {
        return this.setError(this.getEmptyMessage(this.notes.length, filteredItems.length));
      }
    };

    NotationalVelocityView.prototype.schedulePopulateList = function() {
      var currFilterQuery;
      currFilterQuery = this.getFilterQuery();
      if (this.prevFilterQuery !== currFilterQuery) {
        NotationalVelocityView.__super__.schedulePopulateList.apply(this, arguments);
      }
      return this.prevFilterQuery = currFilterQuery;
    };

    return NotationalVelocityView;

  })(SelectListView);

}).call(this);
