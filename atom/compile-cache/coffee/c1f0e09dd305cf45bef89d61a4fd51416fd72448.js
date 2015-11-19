(function() {
  var Point, StatusBarView, View, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Point = require('atom').Point;

  View = require('space-pen').View;

  _ = require('lodash');

  StatusBarView = (function(_super) {
    __extends(StatusBarView, _super);

    function StatusBarView() {
      return StatusBarView.__super__.constructor.apply(this, arguments);
    }

    StatusBarView.content = function() {
      return this.div({
        "class": 'padded text-smaller'
      }, (function(_this) {
        return function() {
          return _this.dl({
            "class": 'linter-statusbar',
            outlet: 'violations'
          });
        };
      })(this));
    };

    StatusBarView.prototype.initialize = function() {
      this.on('click', '.copy', function() {
        var el;
        el = this.parentElement.getElementsByClassName('error-message')[0];
        return atom.clipboard.write(el.innerText);
      });
      return this.on('click', '.goToError', function() {
        var col, line, _ref;
        line = parseInt(this.dataset.line, 10);
        col = parseInt(this.dataset.col, 10);
        return (_ref = atom.workspace.getActiveEditor()) != null ? _ref.setCursorBufferPosition(new Point(line, col)) : void 0;
      });
    };

    StatusBarView.prototype.highlightLines = function(currentLine) {
      var $line;
      if (!this.showAllErrors) {
        return;
      }
      this.find('.error-message').removeClass('message-highlighted');
      $line = this.find('.linter-line-' + currentLine);
      return $line != null ? $line.addClass('message-highlighted') : void 0;
    };

    StatusBarView.prototype.detached = function() {
      this.off('click', '.copy');
      return this.off('click', '.goToError');
    };

    StatusBarView.prototype.computeMessages = function(messages, position, currentLine, limitOnErrorRange) {
      var index, item, message, pos, showInRange, showOnLine, violation, _i, _len, _ref, _ref1;
      this.violations.empty();
      if (this.showAllErrors) {
        messages.sort(function(a, b) {
          return a.line - b.line;
        });
      }
      for (index = _i = 0, _len = messages.length; _i < _len; index = ++_i) {
        item = messages[index];
        showInRange = ((_ref = item.range) != null ? _ref.containsPoint(position) : void 0) && index <= 10 && limitOnErrorRange;
        showOnLine = ((_ref1 = item.range) != null ? _ref1.start.row : void 0) === currentLine && !limitOnErrorRange;
        if (showInRange || showOnLine || this.showAllErrors) {
          pos = "line: " + item.line;
          if (item.col != null) {
            pos = "" + pos + " / col: " + item.col;
          }
          message = _.escape(item.message);
          violation = "<dt>\n  <span class='highlight-" + item.level + "'>" + item.linter + "</span>\n</dt>\n<dd>\n  <span class='copy icon-clippy'></span>\n  <span class='goToError' data-line='" + (item.line - 1) + "' data-col='" + (item.col - 1 || 0) + "'>\n    <span class='error-message linter-line-" + (item.line - 1) + "'>" + message + "</span>\n    <span class='pos'>" + pos + "</span>\n  </span>\n</dd>";
          this.violations.append(violation);
        }
      }
      if (violation != null) {
        this.show();
        return this.highlightLines(currentLine);
      }
    };

    StatusBarView.prototype.filterInfoMessages = function(messages, config) {
      var msg, showInfoMessages;
      showInfoMessages = config.get('linter.showInfoMessages');
      if (showInfoMessages) {
        return messages;
      }
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = messages.length; _i < _len; _i++) {
          msg = messages[_i];
          if (msg.level !== 'info') {
            _results.push(msg);
          }
        }
        return _results;
      })();
    };

    StatusBarView.prototype.render = function(messages, editor) {
      var currentLine, limitOnErrorRange, position, statusBarConfig;
      statusBarConfig = atom.config.get('linter.statusBar');
      limitOnErrorRange = statusBarConfig === 'Show error if the cursor is in range';
      this.showAllErrors = statusBarConfig === 'Show all errors';
      this.hide();
      messages = this.filterInfoMessages(messages, atom.config);
      if (!(messages.length > 0)) {
        return;
      }
      if (editor.getLastCursor() != null) {
        position = editor.getCursorBufferPosition();
      } else {
        return;
      }
      currentLine = position.row;
      this.computeMessages(messages, position, currentLine, limitOnErrorRange);
      if (!this.added) {
        atom.workspace.addBottomPanel({
          item: this
        });
        return this.added = true;
      }
    };

    return StatusBarView;

  })(View);

  module.exports = StatusBarView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsV0FBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUhKLENBQUE7O0FBQUEsRUFNTTtBQUVKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFCQUFQO09BQUwsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakMsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFBMkIsTUFBQSxFQUFRLFlBQW5DO1dBQUosRUFEaUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDRCQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFFVixNQUFBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLE9BQWIsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFlBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBc0MsZUFBdEMsQ0FBdUQsQ0FBQSxDQUFBLENBQTVELENBQUE7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsRUFBRSxDQUFDLFNBQXhCLEVBRm9CO01BQUEsQ0FBdEIsQ0FBQSxDQUFBO2FBSUEsSUFBQyxDQUFBLEVBQUQsQ0FB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
//# sourceURL=/Users/lildude/.atom/packages/linter/lib/statusbar-view.coffee