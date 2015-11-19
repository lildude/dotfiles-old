(function() {
  var CompositeDisposable, EditorLinter, Emitter, Helpers, Range, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter, Range = _ref.Range;

  Helpers = require('./helpers');

  EditorLinter = (function() {
    function EditorLinter(linter, editor) {
      var _ref1;
      this.linter = linter;
      this.editor = editor;
      this.messages = new Map;
      this.status = true;
      this.inProgress = false;
      this.inProgressFly = false;
      if (this.editor === atom.workspace.getActiveTextEditor()) {
        this.linter.views.updateCurrentLine((_ref1 = this.editor.getCursorBufferPosition()) != null ? _ref1.row : void 0);
      }
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.lint(false);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(_arg) {
          var newBufferPosition;
          newBufferPosition = _arg.newBufferPosition;
          _this.linter.views.updateCurrentLine(newBufferPosition.row);
          return _this.linter.views.updateBubble(newBufferPosition);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.linter.lintOnFly) {
            return _this.lint(true);
          }
        };
      })(this)));
    }

    EditorLinter.prototype.toggleStatus = function() {
      return this.setStatus(!this.status);
    };

    EditorLinter.prototype.getStatus = function() {
      return this.status;
    };

    EditorLinter.prototype.setStatus = function(status) {
      this.status = status;
      if (!status) {
        this.messages.clear();
        return this.linter.views.render();
      }
    };

    EditorLinter.prototype.getMessages = function() {
      return this.messages;
    };

    EditorLinter.prototype.deleteMessages = function(linter) {
      this.messages["delete"](linter);
      if (this.editor === atom.workspace.getActiveTextEditor()) {
        return this.linter.views.render();
      }
    };

    EditorLinter.prototype.setMessages = function(linter, messages) {
      this.messages.set(linter, Helpers.validateResults(messages));
      if (this.editor === atom.workspace.getActiveTextEditor()) {
        return this.linter.views.render();
      }
    };

    EditorLinter.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      return this.subscriptions.dispose();
    };

    EditorLinter.prototype.onDidUpdate = function(callback) {
      return this.emitter.on('did-update', callback);
    };

    EditorLinter.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    EditorLinter.prototype.lint = function(wasTriggeredOnChange) {
      var scopes;
      if (!this.status) {
        return;
      }
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if (!this.editor.getPath()) {
        return;
      }
      if (this.lock(wasTriggeredOnChange)) {
        return;
      }
      scopes = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition()).scopes;
      scopes.push('*');
      return Promise.all(this.triggerLinters(wasTriggeredOnChange, scopes)).then((function(_this) {
        return function() {
          return _this.lock(wasTriggeredOnChange, false);
        };
      })(this));
    };

    EditorLinter.prototype.triggerLinters = function(wasTriggeredOnChange, scopes) {
      var Promises;
      Promises = [];
      this.linter.getLinters().forEach((function(_this) {
        return function(linter) {
          if (_this.linter.lintOnFly) {
            if (wasTriggeredOnChange !== linter.lintOnFly) {
              return;
            }
          }
          if (!scopes.some(function(entry) {
            return __indexOf.call(linter.grammarScopes, entry) >= 0;
          })) {
            return;
          }
          return Promises.push(new Promise(function(resolve) {
            return resolve(linter.lint(_this.editor));
          }).then(function(results) {
            if (linter.scope === 'project') {
              return _this.linter.setProjectMessages(linter, results);
            } else {
              _this.setMessages(linter, results);
              return _this.emitter.emit('did-update');
            }
          })["catch"](function(error) {
            return atom.notifications.addError(error.message, {
              detail: error.stack,
              dismissable: true
            });
          }));
        };
      })(this));
      return Promises;
    };

    EditorLinter.prototype.lock = function(wasTriggeredOnChange, value) {
      var key;
      key = wasTriggeredOnChange ? 'inProgressFly' : 'inProgress';
      if (typeof value === 'undefined') {
        return this[key];
      } else {
        return this[key] = value;
      }
    };

    return EditorLinter;

  })();

  module.exports = EditorLinter;

}).call(this);
