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
      editor = atom.workspace.getActiveTextEditor();
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
      editor = atom.workspace.getActiveTextEditor();
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
      editor = atom.workspace.getActiveTextEditor();
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
      editor = atom.workspace.getActiveTextEditor();
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
      editor = atom.workspace.getActiveTextEditor();
      _ref = editor.getCursorBufferPosition(), row = _ref.row, column = _ref.column;
      line = editor.lineTextForBufferRow(row);
      cell = line.indexOf("|", column);
      if (cell === -1) {
        row += 1;
        line = editor.lineTextForBufferRow(row);
      }
      if (utils.isTableSeparator(line)) {
        row += 1;
        cell = -1;
        line = editor.lineTextForBufferRow(row);
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
      editor = atom.workspace.getActiveTextEditor();
      if (!editor.getSelectedText()) {
        editor.moveToBeginningOfPreviousParagraph();
        editor.selectToBeginningOfNextParagraph();
      }
      lines = editor.getSelectedText().split("\n");
      if (lines.every(function(line) {
        return line.trim().length === 0;
      })) {
        return;
      }
      range = this._findTableRange(lines, editor.getSelectedBufferRange());
      values = this._parseTable(lines);
      editor.setSelectedBufferRange(range);
      return editor.insertText(this._createTable(values));
    };

    Commands.prototype._indexOfFirstNonEmptyLine = function(lines) {
      var i, line, _i, _len;
      for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
        line = lines[i];
        if (line.trim().length > 0) {
          return i;
        }
      }
      return -1;
    };

    Commands.prototype._findTableRange = function(lines, _arg) {
      var end, head, start, tail;
      start = _arg.start, end = _arg.end;
      head = this._indexOfFirstNonEmptyLine(lines);
      tail = this._indexOfFirstNonEmptyLine(lines.slice(0).reverse());
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
