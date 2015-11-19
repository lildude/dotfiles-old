(function() {
  var StyleText, config, scopeSelectors, utils;

  config = require("../config");

  utils = require("../utils");

  scopeSelectors = {
    code: ".raw",
    bold: ".bold",
    italic: ".italic",
    strikethrough: ".strike"
  };

  module.exports = StyleText = (function() {
    function StyleText(style) {
      var _base, _base1;
      this.styleName = style;
      this.style = config.get("textStyles." + style);
      if ((_base = this.style).before == null) {
        _base.before = "";
      }
      if ((_base1 = this.style).after == null) {
        _base1.after = "";
      }
    }

    StyleText.prototype.trigger = function(e) {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var text;
            _this.normalizeSelection(selection);
            if (text = selection.getText()) {
              return _this.toggleStyle(selection, text);
            } else {
              return _this.insertEmptyStyle(selection);
            }
          });
        };
      })(this));
    };

    StyleText.prototype.normalizeSelection = function(selection) {
      var range, scopeSelector;
      scopeSelector = scopeSelectors[this.styleName];
      if (!scopeSelector) {
        return;
      }
      range = utils.getTextBufferRange(this.editor, scopeSelector, selection);
      return selection.setBufferRange(range);
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
      var position;
      selection.insertText(this.style.before);
      position = selection.cursor.getBufferPosition();
      selection.insertText(this.style.after);
      return selection.cursor.setBufferPosition(position);
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
      while (matches = this.getStylePattern().exec(text)) {
        text = matches.slice(1).join("");
      }
      return text;
    };

    StyleText.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.regexpEscape(this.style.before);
      after = this.style.regexAfter || utils.regexpEscape(this.style.after);
      return RegExp("^([\\s\\S]*?)" + before + "([\\s\\S]*?)" + after + "([\\s\\S]*?)$", "gm");
    };

    return StyleText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9zdHlsZS10ZXh0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFULENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FEUixDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLElBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxJQUVBLE1BQUEsRUFBUSxTQUZSO0FBQUEsSUFHQSxhQUFBLEVBQWUsU0FIZjtHQUxGLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBUVMsSUFBQSxtQkFBQyxLQUFELEdBQUE7QUFDWCxVQUFBLGFBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FBYixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLE1BQU0sQ0FBQyxHQUFQLENBQVksYUFBQSxHQUFhLEtBQXpCLENBRFQsQ0FBQTs7YUFHTSxDQUFDLFNBQVU7T0FIakI7O2NBSU0sQ0FBQyxRQUFTO09BTEw7SUFBQSxDQUFiOztBQUFBLHdCQU9BLE9BQUEsR0FBUyxTQUFDLENBQUQsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVixDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2YsS0FBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUEsQ0FBdUIsQ0FBQyxPQUF4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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/commands/style-text.coffee
