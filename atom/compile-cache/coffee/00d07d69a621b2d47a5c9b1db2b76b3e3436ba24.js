(function() {
  var Commands, CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  Commands = (function() {
    function Commands(linter) {
      this.linter = linter;
      this._subscriptions = new CompositeDisposable;
      this._subscriptions.add(atom.commands.add('atom-workspace', {
        'linter:next-error': this.nextError.bind(this),
        'linter:toggle': this.toggleLinter.bind(this)
      }));
      this._messages = null;
    }

    Commands.prototype.toggleLinter = function() {
      var activeEditorLinter;
      activeEditorLinter = this.linter.getActiveEditorLinter();
      if (!activeEditorLinter) {
        return;
      }
      return activeEditorLinter.toggleStatus();
    };

    Commands.prototype.nextError = function() {
      var message, next;
      if (!this._messages || (next = this._messages.next()).done) {
        next = (this._messages = this.linter.views.getMessages().values()).next();
      }
      if (next.done) {
        return;
      }
      message = next.value;
      if (!message.filePath) {
        return;
      }
      if (!message.range) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.destroy = function() {
      this._messages = null;
      return this._subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);
