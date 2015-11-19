(function() {
  var EditLine, LineMeta, MAX_SKIP_EMPTY_LINE_ALLOWED, config;

  config = require("../config");

  LineMeta = require("../helpers/line-meta");

  MAX_SKIP_EMPTY_LINE_ALLOWED = 5;

  module.exports = EditLine = (function() {
    function EditLine(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    EditLine.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            return _this[fn](e, selection);
          });
        };
      })(this));
    };

    EditLine.prototype.insertNewLine = function(e, selection) {
      var cursor, line, lineMeta;
      if (this._isRangeSelection(selection)) {
        return this.editor.insertNewline();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (cursor.column < line.length && !config.get("inlineNewLineContinuation")) {
        return this.editor.insertNewline();
      }
      lineMeta = new LineMeta(line);
      if (lineMeta.isContinuous()) {
        if (lineMeta.isEmptyBody()) {
          return this._insertNewlineWithoutContinuation(cursor);
        } else {
          return this._insertNewlineWithContinuation(lineMeta.nextLine);
        }
      } else {
        return this.editor.insertNewline();
      }
    };

    EditLine.prototype._insertNewlineWithContinuation = function(nextLine) {
      return this.editor.insertText("\n" + nextLine);
    };

    EditLine.prototype._insertNewlineWithoutContinuation = function(cursor) {
      var currentIndentation, emptyLineSkipped, indentation, line, nextLine, row, _i, _ref;
      nextLine = "\n";
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      if (currentIndentation > 0 && cursor.row > 1) {
        emptyLineSkipped = 0;
        for (row = _i = _ref = cursor.row - 1; _ref <= 0 ? _i <= 0 : _i >= 0; row = _ref <= 0 ? ++_i : --_i) {
          line = this.editor.lineTextForBufferRow(row);
          if (line.trim() === "") {
            if (emptyLineSkipped > MAX_SKIP_EMPTY_LINE_ALLOWED) {
              break;
            }
            emptyLineSkipped += 1;
          } else {
            indentation = this.editor.indentationForBufferRow(row);
            if (indentation >= currentIndentation) {
              continue;
            }
            if (indentation === currentIndentation - 1 && LineMeta.isList(line)) {
              nextLine = new LineMeta(line).nextLine;
            }
            break;
          }
        }
      }
      this.editor.selectToBeginningOfLine();
      return this.editor.insertText(nextLine);
    };

    EditLine.prototype.indentListLine = function(e, selection) {
      var cursor, line;
      if (this._isRangeSelection(selection)) {
        return selection.indentSelectedRows();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (LineMeta.isList(line)) {
        return selection.indentSelectedRows();
      } else if (this._isAtLineBeginning(line, cursor.column)) {
        return selection.indent();
      } else {
        return selection.insertText(" ");
      }
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    EditLine.prototype._isRangeSelection = function(selection) {
      var head, tail;
      head = selection.getHeadBufferPosition();
      tail = selection.getTailBufferPosition();
      return head.row !== tail.row || head.column !== tail.column;
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9lZGl0LWxpbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVEQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsc0JBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsMkJBQUEsR0FBOEIsQ0FIOUIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLGtCQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFYsQ0FEVztJQUFBLENBQWI7O0FBQUEsdUJBSUEsT0FBQSxHQUFTLFNBQUMsQ0FBRCxHQUFBO0FBQ1AsVUFBQSxFQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLEVBQTRCLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQUwsQ0FBQSxFQUFQO01BQUEsQ0FBNUIsQ0FBTCxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2YsS0FBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUEsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxTQUFDLFNBQUQsR0FBQTttQkFDOUIsS0FBRSxDQUFBLEVBQUEsQ0FBRixDQUFNLENBQU4sRUFBUyxTQUFULEVB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/commands/edit-line.coffee
