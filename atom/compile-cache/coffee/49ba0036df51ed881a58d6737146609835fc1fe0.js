(function() {
  var Commands, HEADING_REGEX, LIST_OL_REGEX, LIST_TL_REGEX, LIST_UL_REGEX, REFERENCE_REGEX, TABLE_COL_REGEX, TABLE_VAL_REGEX, utils;

  utils = require("./utils");

  HEADING_REGEX = /^\#{1,6} +.+$/g;

  REFERENCE_REGEX = /\[?([^\s\]]+)(?:\]|\]:)?/;

  LIST_UL_REGEX = /^(\s*)([*+-])\s+(.*)$/;

  LIST_OL_REGEX = /^(\s*)(\d+)\.\s+(.*)$/;

  LIST_TL_REGEX = /^(\s*)(- \[[xX ]\])\s+(.*)$/;

  TABLE_COL_REGEX = /([^\|]*?)\s*\|/;

  TABLE_VAL_REGEX = /(?:^|\|)([^\|]+)/g;

  Commands = (function() {
    function Commands() {}

    Commands.prototype.trigger = function(command) {
      var fn;
      fn = command.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this[fn]();
    };

    Commands.prototype.insertNewLine = function() {
      var editor, line, replaceLine, value, _ref;
      editor = atom.workspace.getActiveEditor();
      line = editor.lineTextForBufferRow(editor.getCursorBufferPosition().row);
      _ref = this._findNewLineValue(line), replaceLine = _ref.replaceLine, value = _ref.value;
      if (replaceLine) {
        editor.selectToBeginningOfLine();
      }
      return editor.insertText(value);
    };

    Commands.prototype._findNewLineValue = function(line) {
      var matches, value;
      if (matches = LIST_TL_REGEX.exec(line)) {
        value = "\n" + matches[1] + "- [ ] ";
      } else if (matches = LIST_UL_REGEX.exec(line)) {
        value = "\n" + matches[1] + matches[2] + " ";
      } else if (matches = LIST_OL_REGEX.exec(line)) {
        value = "\n" + matches[1] + (parseInt(matches[2], 10) + 1) + ". ";
      }
      if (matches && !matches[3]) {
        return {
          replaceLine: true,
          value: matches[1] || "\n"
        };
      } else {
        return {
          replaceLine: false,
          value: value || "\n"
        };
      }
    };

    Commands.prototype.jumpToPreviousHeading = function() {
      var editor, row;
      editor = atom.workspace.getActiveEditor();
      row = editor.getCursorBufferPosition().row;
      return this._executeMoveToPreviousHeading(editor, [[0, 0], [row - 1, 0]]);
    };

    Commands.prototype._executeMoveToPreviousHeading = function(editor, range) {
      var found;
      found = false;
      editor.buffer.backwardsScanInRange(HEADING_REGEX, range, function(match) {
        found = true;
        editor.setCursorBufferPosition(match.range.start);
        return match.stop();
      });
      return found;
    };

    Commands.prototype.jumpToNextHeading = function() {
      var curPosition, editor, eofPosition, range;
      editor = atom.workspace.getActiveEditor();
      curPosition = editor.getCursorBufferPosition();
      eofPosition = editor.getEofBufferPosition();
      range = [[curPosition.row + 1, 0], [eofPosition.row + 1, 0]];
      if (this._executeMoveToNextHeading(editor, range)) {
        return;
      }
      return this._executeMoveToNextHeading(editor, [[0, 0], [eofPosition.row + 1, 0]]);
    };

    Commands.prototype._executeMoveToNextHeading = function(editor, range) {
      var found;
      found = false;
      editor.buffer.scanInRange(HEADING_REGEX, range, function(match) {
        found = true;
        editor.setCursorBufferPosition(match.range.start);
        return match.stop();
      });
      return found;
    };

    Commands.prototype.jumpBetweenReferenceDefinition = function() {
      var cursor, editor, key;
      editor = atom.workspace.getActiveEditor();
      cursor = editor.getCursorBufferPosition();
      key = editor.getSelectedText() || editor.getWordUnderCursor();
      key = utils.regexpEscape(REFERENCE_REGEX.exec(key)[1]);
      return editor.buffer.scan(RegExp("\\[" + key + "\\]", "g"), function(match) {
        var end;
        end = match.range.end;
        if (end.row !== cursor.row) {
          editor.setCursorBufferPosition([end.row, end.column - 1]);
          return match.stop();
        }
      });
    };

    Commands.prototype.jumpToNextTableCell = function() {
      var cell, column, editor, line, row, _ref;
      editor = atom.workspace.getActiveEditor();
      _ref = editor.getCursorBufferPosition(), row = _ref.row, column = _ref.column;
      line = editor.lineForBufferRow(row);
      cell = line.indexOf("|", column);
      if (cell === -1) {
        row += 1;
        line = editor.lineForBufferRow(row);
      }
      if (utils.isTableSeparator(line)) {
        row += 1;
        cell = -1;
        line = editor.lineForBufferRow(row);
      }
      cell = this._findNextTableCellIdx(line, cell + 1);
      return editor.setCursorBufferPosition([row, cell]);
    };

    Commands.prototype._findNextTableCellIdx = function(line, column) {
      var td;
      if (td = TABLE_COL_REGEX.exec(line.slice(column))) {
        return column + td[1].length;
      } else {
        return line.length + 1;
      }
    };

    Commands.prototype.formatTable = function() {
      var editor, lines, range, values;
      editor = atom.workspace.getActiveEditor();
      if (!editor.getSelectedText()) {
        editor.moveCursorToBeginningOfPreviousParagraph();
        editor.selectToBeginningOfNextParagraph();
      }
      lines = editor.getSelectedText().split("\n");
      range = this._findTableRange(lines, editor.getSelectedBufferRange());
      values = this._parseTable(lines);
      editor.setSelectedBufferRange(range);
      return editor.insertText(this._createTable(values));
    };

    Commands.prototype._findTableRange = function(lines, _arg) {
      var end, head, start, tail;
      start = _arg.start, end = _arg.end;
      head = lines.findIndex(function(line) {
        return line !== "";
      });
      tail = lines.slice(0).reverse().findIndex(function(line) {
        return line !== "";
      });
      return [[start.row + head, 0], [end.row - tail, lines[lines.length - 1 - tail].length]];
    };

    Commands.prototype._parseTable = function(lines) {
      var col, columns, j, line, maxes, table, _i, _j, _len, _len1;
      table = [];
      maxes = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (line.trim() === "") {
          continue;
        }
        if (utils.isTableSeparator(line)) {
          continue;
        }
        columns = line.split("|").map(function(col) {
          return col.trim();
        });
        table.push(columns);
        for (j = _j = 0, _len1 = columns.length; _j < _len1; j = ++_j) {
          col = columns[j];
          if (maxes[j] != null) {
            if (col.length > maxes[j]) {
              maxes[j] = col.length;
            }
          } else {
            maxes[j] = col.length;
          }
        }
      }
      return {
        table: table,
        maxes: maxes
      };
    };

    Commands.prototype._createTable = function(_arg) {
      var maxes, result, table, vals, _i, _len, _ref;
      table = _arg.table, maxes = _arg.maxes;
      result = [];
      result.push(this._createTableRow(table[0], maxes, " | "));
      result.push(maxes.map(function(n) {
        return '-'.repeat(n);
      }).join("-|-"));
      _ref = table.slice(1);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vals = _ref[_i];
        result.push(this._createTableRow(vals, maxes, " | "));
      }
      return result.join("\n");
    };

    Commands.prototype._createTableRow = function(vals, widths, separator) {
      return vals.map(function(val, i) {
        return "" + val + (' '.repeat(widths[i] - val.length));
      }).join(separator).trimRight();
    };

    Commands.prototype.openCheatSheet = function() {
      var cheatsheet, packageDir;
      packageDir = atom.packages.getLoadedPackage("markdown-writer").path;
      cheatsheet = require("path").join(packageDir, "CHEATSHEET.md");
      return atom.workspace.open("markdown-preview://" + (encodeURI(cheatsheet)), {
        split: 'right',
        searchAllPanes: true
      });
    };

    return Commands;

  })();

  module.exports = new Commands();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhIQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBa0IsZ0JBRmxCLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLDBCQUhsQixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFrQix1QkFMbEIsQ0FBQTs7QUFBQSxFQU1BLGFBQUEsR0FBa0IsdUJBTmxCLENBQUE7O0FBQUEsRUFPQSxhQUFBLEdBQWtCLDZCQVBsQixDQUFBOztBQUFBLEVBU0EsZUFBQSxHQUFrQixnQkFUbEIsQ0FBQTs7QUFBQSxFQVVBLGVBQUEsR0FBa0IsbUJBVmxCLENBQUE7O0FBQUEsRUFZTTswQkFFSjs7QUFBQSx1QkFBQSxPQUFBLEdBQVMsU0FBQyxPQUFELEdBQUE7QUFDUCxVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxPQUFPLENBQUMsT0FBUixDQUFnQixVQUFoQixFQUE0QixTQUFDLENBQUQsR0FBQTtlQUFPLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFMLENBQUEsRUFBUDtNQUFBLENBQTVCLENBQUwsQ0FBQTthQUNBLElBQUUsQ0FBQSxFQUFBLENBQUYsQ0FBQSxFQUZPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLHVCQUlBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixVQUFBLHNDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWdDLENBQUMsR0FBN0QsQ0FEUCxDQUFBO0FBQUEsTUFHQSxPQUF1QixJQUFDLENBQUEsaUJBQUQsQ0FB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
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/commands.coffee