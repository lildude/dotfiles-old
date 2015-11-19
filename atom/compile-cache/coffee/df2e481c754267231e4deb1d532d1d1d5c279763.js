(function() {
  var Commands, CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Path, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Commands = require('./commands');

  Linter = (function() {
    function Linter() {
      this.lintOnFly = true;
      this.views = new LinterViews(this);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      this.editorLinters = new Map;
      this.messagesProject = new Map;
      this.linters = new Set;
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.views.setShowBubble(showBubble);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorPanel', (function(_this) {
        return function(showPanel) {
          return _this.views.setShowPanel(showPanel);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.underlineIssues', (function(_this) {
        return function(underlineIssues) {
          return _this.views.setUnderlineIssues(underlineIssues);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var currentEditorLinter;
          currentEditorLinter = new EditorLinter(_this, editor);
          _this.editorLinters.set(editor, currentEditorLinter);
          _this.emitter.emit('observe-editor-linters', currentEditorLinter);
          currentEditorLinter.lint(false);
          return editor.onDidDestroy(function() {
            currentEditorLinter.destroy();
            return _this.editorLinters["delete"](editor);
          });
        };
      })(this)));
    }

    Linter.prototype.addLinter = function(linter) {
      var err;
      try {
        if (Helpers.validateLinter(linter)) {
          return this.linters.add(linter);
        }
      } catch (_error) {
        err = _error;
        return atom.notifications.addError("Invalid Linter: " + err.message, {
          detail: err.stack,
          dismissable: true
        });
      }
    };

    Linter.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      this.linters["delete"](linter);
      if (linter.scope === 'project') {
        this.deleteProjectMessages(linter);
      } else {
        this.eachEditorLinter(function(editorLinter) {
          return editorLinter.deleteMessages(linter);
        });
      }
      return this.views.render();
    };

    Linter.prototype.hasLinter = function(linter) {
      return this.linters.has(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters;
    };

    Linter.prototype.onDidChangeProjectMessages = function(callback) {
      return this.emitter.on('did-change-project-messages', callback);
    };

    Linter.prototype.getProjectMessages = function() {
      return this.messagesProject;
    };

    Linter.prototype.setProjectMessages = function(linter, messages) {
      this.messagesProject.set(linter, Helpers.validateResults(messages));
      this.emitter.emit('did-change-project-messages', this.messagesProject);
      return this.views.render();
    };

    Linter.prototype.deleteProjectMessages = function(linter) {
      this.messagesProject["delete"](linter);
      this.emitter.emit('did-change-project-messages', this.messagesProject);
      return this.views.render();
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.getEditorLinter(atom.workspace.getActiveTextEditor());
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editorLinters.get(editor);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editorLinters.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      this.eachEditorLinter(callback);
      return this.emitter.on('observe-editor-linters', callback);
    };

    Linter.prototype.deactivate = function() {
      this.subscriptions.dispose();
      this.eachEditorLinter(function(linter) {
        return linter.destroy();
      });
      this.views.destroy();
      return this.commands.destroy();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);
