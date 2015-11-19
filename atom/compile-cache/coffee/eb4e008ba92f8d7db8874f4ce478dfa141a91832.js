(function() {
  var Commands, CompositeDisposable,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Commands = (function() {
    function Commands(linter) {
      this.linter = linter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'linter:next-error': (function(_this) {
          return function() {
            return _this.nextError();
          };
        })(this),
        'linter:previous-error': (function(_this) {
          return function() {
            return _this.previousError();
          };
        })(this),
        'linter:toggle': (function(_this) {
          return function() {
            return _this.toggleLinter();
          };
        })(this),
        'linter:togglePanel': (function(_this) {
          return function() {
            return _this.togglePanel();
          };
        })(this),
        'linter:set-bubble-transparent': (function(_this) {
          return function() {
            return _this.setBubbleTransparent();
          };
        })(this),
        'linter:expand-multiline-messages': (function(_this) {
          return function() {
            return _this.expandMultilineMessages();
          };
        })(this),
        'linter:lint': (function(_this) {
          return function() {
            return _this.lint();
          };
        })(this)
      }));
      this.index = null;
    }

    Commands.prototype.togglePanel = function() {
      return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    };

    Commands.prototype.toggleLinter = function() {
      var activeEditor, editorLinter;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      editorLinter = this.linter.getEditorLinter(activeEditor);
      if (editorLinter) {
        return editorLinter.destroy();
      } else {
        return this.linter.createEditorLinter(activeEditor);
      }
    };

    Commands.prototype.setBubbleTransparent = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.add('transparent');
        document.addEventListener('keyup', this.setBubbleOpaque);
        return window.addEventListener('blur', this.setBubbleOpaque);
      }
    };

    Commands.prototype.setBubbleOpaque = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.remove('transparent');
      }
      document.removeEventListener('keyup', this.setBubbleOpaque);
      return window.removeEventListener('blur', this.setBubbleOpaque);
    };

    Commands.prototype.expandMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.add('expanded');
      }
      document.addEventListener('keyup', this.collapseMultilineMessages);
      return window.addEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.collapseMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.remove('expanded');
      }
      document.removeEventListener('keyup', this.collapseMultilineMessages);
      return window.removeEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.lint = function() {
      var error, _ref;
      try {
        return (_ref = this.linter.getActiveEditorLinter()) != null ? _ref.lint(false) : void 0;
      } catch (_error) {
        error = _error;
        return atom.notifications.addError(error.message, {
          detail: error.stack,
          dismissable: true
        });
      }
    };

    Commands.prototype.getMessage = function(index) {
      var messages;
      messages = this.linter.views.messages;
      return messages[__modulo(index, messages.length)];
    };

    Commands.prototype.nextError = function() {
      var message;
      if (this.index != null) {
        this.index++;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.previousError = function() {
      var message;
      if (this.index != null) {
        this.index--;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.dispose = function() {
      this.messages = null;
      return this.subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9jb21tYW5kcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQSw2REFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRU07QUFDUyxJQUFBLGtCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtBQUFBLFFBQ0EsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEekI7QUFBQSxRQUVBLGVBQUEsRUFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGakI7QUFBQSxRQUdBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxH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

//# sourceURL=/Users/lildude/.atom/packages/linter/lib/commands.coffee
