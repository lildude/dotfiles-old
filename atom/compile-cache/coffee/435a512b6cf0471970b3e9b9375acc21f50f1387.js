(function() {
  var $, InsertTableView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

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
        columnWidth: 3,
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9pbnNlcnQtdGFibGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixFQUFVLHNCQUFBLGNBQVYsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQURULENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHdDQUFQO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwRCxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sY0FBUCxFQUF1QjtBQUFBLFlBQUEsT0FBQSxFQUFPLHNCQUFQO1dBQXZCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxNQUFQLEVBQWU7QUFBQSxjQUFBLE9BQUEsRUFBTyxTQUFQO2FBQWYsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFdBQVQsRUFBMEIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBMUIsQ0FEQSxDQUFBO0FBQUEsWUFF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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/insert-table-view.coffee
