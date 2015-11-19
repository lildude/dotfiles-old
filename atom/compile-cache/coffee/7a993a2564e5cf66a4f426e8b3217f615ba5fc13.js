(function() {
  var $, InsertTableView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  module.exports = InsertTableView = (function(_super) {
    __extends(InsertTableView, _super);

    function InsertTableView() {
      return InsertTableView.__super__.constructor.apply(this, arguments);
    }

    InsertTableView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Table", {
            "class": "icon icon-diff-added"
          });
          return _this.div(function() {
            _this.label("Rows", {
              "class": "message"
            });
            _this.subview("rowEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Columns", {
              "class": "message"
            });
            return _this.subview("columnEditor", new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    InsertTableView.prototype.initialize = function() {
      utils.setTabIndex([this.rowEditor, this.columnEditor]);
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    InsertTableView.prototype.onConfirm = function() {
      var col, row;
      row = parseInt(this.rowEditor.getText(), 10);
      col = parseInt(this.columnEditor.getText(), 10);
      if (this.isValidRange(row, col)) {
        this.insertTable(row, col);
      }
      return this.detach();
    };

    InsertTableView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.rowEditor.setText("3");
      this.columnEditor.setText("3");
      this.panel.show();
      return this.rowEditor.focus();
    };

    InsertTableView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return InsertTableView.__super__.detach.apply(this, arguments);
    };

    InsertTableView.prototype.insertTable = function(row, col) {
      var cursor;
      cursor = this.editor.getCursorBufferPosition();
      this.editor.insertText(this.createTable(row, col));
      return this.editor.setCursorBufferPosition(cursor);
    };

    InsertTableView.prototype.createTable = function(row, col) {
      var options, table, _i, _ref1;
      options = {
        numOfColumns: col,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        alignment: config.get("tableAlignment")
      };
      table = [];
      table.push(utils.createTableRow([], options));
      table.push(utils.createTableSeparator(options));
      for (_i = 0, _ref1 = row - 2; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; 0 <= _ref1 ? _i++ : _i--) {
        table.push(utils.createTableRow([], options));
      }
      return table.join("\n");
    };

    InsertTableView.prototype.isValidRange = function(row, col) {
      if (isNaN(row) || isNaN(col)) {
        return false;
      }
      if (row < 2 || col < 1) {
        return false;
      }
      return true;
    };

    return InsertTableView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtdGFibGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixFQUFVLHNCQUFBLGNBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUZULENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FIUixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHdDQUFQO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwRCxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sY0FBUCxFQUF1QjtBQUFBLFlBQUEsT0FBQSxFQUFPLHNCQUFQO1dBQXZCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxNQUFQLEVBQWU7QUFBQSxjQUFBLE9BQUEsRUFBTyxTQUFQO2FBQWYsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFdBQVQsRUFBMEIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBMUIsQ0FEQSxDQUFBO0FB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/views/insert-table-view.coffee
