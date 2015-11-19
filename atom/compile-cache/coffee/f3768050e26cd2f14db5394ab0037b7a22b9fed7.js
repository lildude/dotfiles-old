(function() {
  var FormatText, LIST_OL_REGEX, config, utils;

  config = require("../config");

  utils = require("../utils");

  LIST_OL_REGEX = /^(\s*)(\d+)\.\s*(.*)$/;

  module.exports = FormatText = (function() {
    function FormatText(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    FormatText.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          var formattedText, paragraphRange, range, text;
          paragraphRange = _this.editor.getCurrentParagraphBufferRange();
          range = _this.editor.getSelectedBufferRange();
          if (paragraphRange) {
            range = paragraphRange.union(range);
          }
          text = _this.editor.getTextInBufferRange(range);
          if (range.start.row === range.end.row || text.trim() === "") {
            return;
          }
          formattedText = _this[fn](e, range, text.split("\n"));
          if (formattedText) {
            return _this.editor.setTextInBufferRange(range, formattedText);
          }
        };
      })(this));
    };

    FormatText.prototype.correctOrderListNumbers = function(e, range, lines) {
      var correctedLines, idx, indent, indentStack, line, matches, orderStack, _i, _len;
      correctedLines = [];
      indentStack = [];
      orderStack = [];
      for (idx = _i = 0, _len = lines.length; _i < _len; idx = ++_i) {
        line = lines[idx];
        if (matches = LIST_OL_REGEX.exec(line)) {
          indent = matches[1];
          if (indentStack.length === 0 || indent.length > indentStack[0].length) {
            indentStack.unshift(indent);
            orderStack.unshift(1);
          } else if (indent.length < indentStack[0].length) {
            indentStack.shift();
            orderStack.shift();
            orderStack.unshift(orderStack.shift() + 1);
          } else {
            orderStack.unshift(orderStack.shift() + 1);
          }
          correctedLines[idx] = "" + indentStack[0] + orderStack[0] + ". " + matches[3];
        } else {
          correctedLines[idx] = line;
        }
      }
      return correctedLines.join("\n");
    };

    FormatText.prototype.formatTable = function(e, range, lines) {
      var options, row, rows, table, _i, _len, _ref, _ref1;
      if (lines.some(function(line) {
        return line.trim() !== "" && !utils.isTableRow(line);
      })) {
        return;
      }
      _ref = this._parseTable(lines), rows = _ref.rows, options = _ref.options;
      table = [];
      table.push(utils.createTableRow(rows[0], options).trimRight());
      table.push(utils.createTableSeparator(options));
      _ref1 = rows.slice(1);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        row = _ref1[_i];
        table.push(utils.createTableRow(row, options).trimRight());
      }
      return table.join("\n");
    };

    FormatText.prototype._parseTable = function(lines) {
      var columnWidth, i, line, options, row, rows, separator, _i, _j, _len, _len1, _ref;
      rows = [];
      options = {
        numOfColumns: 1,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (line.trim() === "") {
          continue;
        } else if (utils.isTableSeparator(line)) {
          separator = utils.parseTableSeparator(line);
          options.extraPipes = options.extraPipes || separator.extraPipes;
          options.alignments = separator.alignments;
          options.numOfColumns = Math.max(options.numOfColumns, separator.columns.length);
        } else {
          row = utils.parseTableRow(line);
          rows.push(row.columns);
          options.numOfColumns = Math.max(options.numOfColumns, row.columns.length);
          _ref = row.columnWidths;
          for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
            columnWidth = _ref[i];
            options.columnWidths[i] = Math.max(options.columnWidths[i] || 0, columnWidth);
          }
        }
      }
      return {
        rows: rows,
        options: options
      };
    };

    return FormatText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9mb3JtYXQtdGV4dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUdBLGFBQUEsR0FBZ0IsdUJBSGhCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRVMsSUFBQSxvQkFBQyxNQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURWLENBRFc7SUFBQSxDQUFiOztBQUFBLHlCQUlBLE9BQUEsR0FBUyxTQUFDLENBQUQsR0FBQTtBQUNQLFVBQUEsRUFBQTtBQUFBLE1BQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixVQUFoQixFQUE0QixTQUFDLENBQUQsR0FBQTtlQUFPLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFMLENBQUEsRUFBUDtNQUFBLENBQTVCLENBQUwsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBRWYsY0FBQSwwQ0FBQTtBQUFBLFVBQUEsY0FBQSxHQUFpQixLQUFDLENBQUEsTUFBTSxDQUFDLDhCQUFSLENBQUEsQ0FBakIsQ0FBQTtBQUFBLFVBRUEsS0FBQSxHQUFRLEtBQUMsQ0FBQSxNQUFNLENBQUMsc0JB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/commands/format-text.coffee
