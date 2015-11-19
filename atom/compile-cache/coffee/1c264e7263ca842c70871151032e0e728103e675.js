(function() {
  var StyleLine, config, utils;

  config = require("./config");

  utils = require("./utils");

  module.exports = StyleLine = (function() {
    StyleLine.prototype.editor = null;

    StyleLine.prototype.style = null;

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
      if ((_base5 = this.style).regexAfter == null) {
        _base5.regexAfter = this.style.after ? "\\s" + this.style.after[this.style.after.length - 1] + "*" : void 0;
      }
    }

    StyleLine.prototype.display = function() {
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
