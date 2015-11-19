(function() {
  var StyleLine, config, utils;

  config = require("../config");

  utils = require("../utils");

  module.exports = StyleLine = (function() {
    function StyleLine(style) {
      var _base, _base1, _base2, _base3, _base4, _base5;
      this.style = config.get("lineStyles." + style);
      if ((_base = this.style).before == null) {
        _base.before = "";
      }
      if ((_base1 = this.style).after == null) {
        _base1.after = "";
      }
      if ((_base2 = this.style).regexMatchBefore == null) {
        _base2.regexMatchBefore = this.style.regexBefore || this.style.before;
      }
      if ((_base3 = this.style).regexMatchAfter == null) {
        _base3.regexMatchAfter = this.style.regexAfter || this.style.after;
      }
      if (this.style.before) {
        if ((_base4 = this.style).regexBefore == null) {
          _base4.regexBefore = "" + this.style.before[0] + "+\\s";
        }
      }
      if (this.style.after) {
        if ((_base5 = this.style).regexAfter == null) {
          _base5.regexAfter = "\\s" + this.style.after[this.style.after.length - 1] + "*";
        }
      }
    }

    StyleLine.prototype.trigger = function(e) {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var line, range, row, rows, _i, _ref, _ref1;
            range = selection.getBufferRange();
            rows = selection.getBufferRowRange();
            for (row = _i = _ref = rows[0], _ref1 = rows[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
              selection.cursor.setBufferPosition([row, 0]);
              selection.selectToEndOfLine();
              if (line = selection.getText()) {
                _this.toggleStyle(selection, line);
              } else {
                _this.insertEmptyStyle(selection);
              }
            }
            if (rows[0] !== rows[1]) {
              return selection.setBufferRange(range);
            }
          });
        };
      })(this));
    };

    StyleLine.prototype.toggleStyle = function(selection, text) {
      if (this.isStyleOn(text)) {
        text = this.removeStyle(text);
      } else {
        text = this.addStyle(text);
      }
      return selection.insertText(text);
    };

    StyleLine.prototype.insertEmptyStyle = function(selection) {
      var position;
      selection.insertText(this.style.before);
      position = selection.cursor.getBufferPosition();
      selection.insertText(this.style.after);
      return selection.cursor.setBufferPosition(position);
    };

    StyleLine.prototype.isStyleOn = function(text) {
      return RegExp("^(\\s*)" + this.style.regexMatchBefore + "(.*?)" + this.style.regexMatchAfter + "(\\s*)$", "i").test(text);
    };

    StyleLine.prototype.addStyle = function(text) {
      var match;
      match = this.getStylePattern().exec(text);
      if (match) {
        return "" + match[1] + this.style.before + match[2] + this.style.after + match[3];
      } else {
        return "" + this.style.before + this.style.after;
      }
    };

    StyleLine.prototype.removeStyle = function(text) {
      var matches;
      matches = this.getStylePattern().exec(text);
      return matches.slice(1).join("");
    };

    StyleLine.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.regexpEscape(this.style.before);
      after = this.style.regexAfter || utils.regexpEscape(this.style.after);
      return RegExp("^(\\s*)(?:" + before + ")?(.*?)(?:" + after + ")?(\\s*)$", "i");
    };

    return StyleLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9zdHlsZS1saW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFULENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FEUixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQVVTLElBQUEsbUJBQUMsS0FBRCxHQUFBO0FBQ1gsVUFBQSw2Q0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUFNLENBQUMsR0FBUCxDQUFZLGFBQUEsR0FBYSxLQUF6QixDQUFULENBQUE7O2FBRU0sQ0FBQyxTQUFVO09BRmpCOztjQUdNLENBQUMsUUFBUztPQUhoQjs7Y0FLTSxDQUFDLG1CQUFvQixJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVAsSUFBc0IsSUFBQyxDQUFBLEtBQUssQ0FBQztPQUx4RDs7Y0FNTSxDQUFDLGtCQUFtQixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsSUFBcUIsSUFBQyxDQUFBLEtBQUssQ0FBQztPQU50RDtBQVFBLE1BQUEsSUFBbUQsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUExRDs7Z0JBQU0sQ0FBQyxjQUFlLEVBQUEsR0FBRyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQWpCLEdBQW9CO1NBQTFDO09BUkE7QUFTQSxNQUFBLElBQXVFLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBOUU7O2dCQUFNLENBQUMsYUFBZSxLQUFBLEdBQUssSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFNLENBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/commands/style-line.coffee
