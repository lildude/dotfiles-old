(function() {
  var StyleText, config, styles, utils;

  config = require("./config");

  utils = require("./utils");

  styles = {
    code: {
      before: "`",
      after: "`"
    },
    bold: {
      before: "**",
      after: "**"
    },
    italic: {
      before: "_",
      after: "_"
    },
    keystroke: {
      before: "<kbd>",
      after: "</kbd>"
    },
    strikethrough: {
      before: "~~",
      after: "~~"
    },
    codeblock: function() {
      return config.get("codeblock");
    }
  };

  module.exports = StyleText = (function() {
    StyleText.prototype.editor = null;

    StyleText.prototype.style = null;

    function StyleText(style) {
      this.style = styles[style];
      if (typeof styles[style] === "function") {
        this.style = this.style();
      }
    }

    StyleText.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var text;
            if (text = selection.getText()) {
              return _this.toggleStyle(selection, text);
            } else {
              return _this.insertEmptyStyle(selection);
            }
          });
        };
      })(this));
    };

    StyleText.prototype.toggleStyle = function(selection, text) {
      if (this.isStyleOn(text)) {
        text = this.removeStyle(text);
      } else {
        text = this.addStyle(text);
      }
      return selection.insertText(text);
    };

    StyleText.prototype.insertEmptyStyle = function(selection) {
      var column, row, _ref;
      selection.insertText(this.addStyle(""));
      _ref = selection.cursor.getBufferPosition(), row = _ref.row, column = _ref.column;
      return selection.cursor.setBufferPosition([row, column - this.style.after.length]);
    };

    StyleText.prototype.isStyleOn = function(text) {
      if (text) {
        return this.getStylePattern().test(text);
      }
    };

    StyleText.prototype.addStyle = function(text) {
      return "" + this.style.before + text + this.style.after;
    };

    StyleText.prototype.removeStyle = function(text) {
      var matches;
      matches = this.getStylePattern().exec(text);
      return matches.slice(1).join("");
    };

    StyleText.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.regexpEscape(this.style.before);
      after = this.style.regexAfter || utils.regexpEscape(this.style.after);
      return RegExp("^([\\s\\S]*?)(?:" + before + "([\\s\\S]*?)" + after + "([\\s\\S]+?))*" + before + "([\\s\\S]*?)" + after + "([\\s\\S]*)$", "gm");
    };

    return StyleText;

  })();

}).call(this);
