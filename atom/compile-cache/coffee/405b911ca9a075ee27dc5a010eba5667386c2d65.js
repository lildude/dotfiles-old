(function() {
  var StyleLine, styles, utils;

  utils = require("./utils");

  styles = {
    h1: {
      before: "# ",
      after: ""
    },
    h2: {
      before: "## ",
      after: ""
    },
    h3: {
      before: "### ",
      after: ""
    },
    h4: {
      before: "#### ",
      after: ""
    },
    h5: {
      before: "##### ",
      after: ""
    },
    ul: {
      before: "- ",
      after: "",
      prefix: "-|\\*|\\d+\\."
    },
    ol: {
      before: "0. ",
      after: "",
      prefix: "-|\\*|\\d+\\."
    },
    task: {
      before: "- [ ] ",
      after: "",
      prefix: "- \\[ ]|- \\[x]|- \\[X]|-|\\*"
    },
    taskdone: {
      before: "- [x] ",
      after: "",
      prefix: "- \\[ ]|- \\[x]|- \\[X]|-|\\*"
    },
    blockquote: {
      before: "> ",
      after: ""
    }
  };

  module.exports = StyleLine = (function() {
    StyleLine.prototype.editor = null;

    StyleLine.prototype.style = null;

    function StyleLine(style) {
      this.style = styles[style];
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
              if (line = _this.getLine(selection)) {
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

    StyleLine.prototype.getLine = function(selection) {
      selection.selectToEndOfLine();
      return selection.getText();
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
      return selection.insertText(this.addStyle(""));
    };

    StyleLine.prototype.isStyleOn = function(text) {
      return this.getStylePattern().test(text);
    };

    StyleLine.prototype.addStyle = function(text) {
      var match, prefix;
      prefix = this.style.prefix || this.style.before[0];
      match = this.getStylePattern("(?:" + prefix + ")*\\s?").exec(text);
      return "" + match[1] + this.style.before + match[2] + this.style.after;
    };

    StyleLine.prototype.removeStyle = function(text) {
      var matches;
      matches = this.getStylePattern().exec(text);
      return matches.slice(1).join("");
    };

    StyleLine.prototype.getStylePattern = function(before, after) {
      if (before == null) {
        before = utils.regexpEscape(this.style.before);
      }
      if (after == null) {
        after = utils.regexpEscape(this.style.after);
      }
      return RegExp("^(\\s*)" + before + "(.*?)" + after + "$");
    };

    return StyleLine;

  })();

}).call(this);
