(function() {
  var BottomContainer, BottomPanel, BottomStatus, CompositeDisposable, LinterViews, Message;

  CompositeDisposable = require('atom').CompositeDisposable;

  BottomPanel = require('./ui/bottom-panel').BottomPanel;

  BottomContainer = require('./ui/bottom-container');

  BottomStatus = require('./ui/bottom-status');

  Message = require('./ui/message-element').Message;

  LinterViews = (function() {
    function LinterViews(linter) {
      this.linter = linter;
      this.state = this.linter.state;
      this.subscriptions = new CompositeDisposable;
      this.messages = [];
      this.panel = new BottomPanel(this.state.scope);
      this.bottomContainer = new BottomContainer().prepare(this.linter.state);
      this.bottomBar = null;
      this.bubble = null;
      this.count = {
        File: 0,
        Line: 0,
        Project: 0
      };
      this.subscriptions.add(this.panel);
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.showBubble = showBubble;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.classifyMessages(_this.messages);
          _this.renderBubble();
          _this.renderCount();
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onDidChangeTab((function(_this) {
        return function() {
          atom.config.set('linter.showErrorPanel', true);
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onShouldTogglePanel(function() {
        return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
      }));
    }

    LinterViews.prototype.render = function(_arg) {
      var added, messages, removed;
      added = _arg.added, removed = _arg.removed, messages = _arg.messages;
      this.messages = this.classifyMessages(messages);
      this.panel.setMessages({
        added: added,
        removed: removed
      });
      this.renderBubble();
      this.renderCount();
      return this.notifyEditors({
        added: added,
        removed: removed
      });
    };

    LinterViews.prototype.notifyEditors = function(_arg) {
      var added, removed;
      added = _arg.added, removed = _arg.removed;
      removed.forEach((function(_this) {
        return function(message) {
          var editorLinter;
          if (!(message.filePath && message.range)) {
            return;
          }
          if (!(editorLinter = _this.linter.getEditorLinterByPath(message.filePath))) {
            return;
          }
          return editorLinter.deleteMessage(message);
        };
      })(this));
      return added.forEach((function(_this) {
        return function(message) {
          var editorLinter;
          if (!(message.filePath && message.range)) {
            return;
          }
          if (!(editorLinter = _this.linter.getEditorLinterByPath(message.filePath))) {
            return;
          }
          return editorLinter.addMessage(message);
        };
      })(this));
    };

    LinterViews.prototype.notifyEditor = function(editorLinter) {
      var editorPath;
      editorPath = editorLinter.editor.getPath();
      return this.messages.forEach(function(message) {
        if (!(message.filePath && message.range && message.filePath === editorPath)) {
          return;
        }
        return editorLinter.addMessage(message);
      });
    };

    LinterViews.prototype.renderLineMessages = function(render) {
      if (render == null) {
        render = false;
      }
      this.classifyMessagesByLine(this.messages);
      if (render) {
        this.renderCount();
        return this.panel.refresh(this.state.scope);
      }
    };

    LinterViews.prototype.classifyMessages = function(messages) {
      var filePath, key, message, _ref;
      filePath = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      this.count.File = 0;
      this.count.Project = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentFile = filePath && message.filePath === filePath) {
          this.count.File++;
        }
        this.count.Project++;
      }
      return this.classifyMessagesByLine(messages);
    };

    LinterViews.prototype.classifyMessagesByLine = function(messages) {
      var key, message, row, _ref;
      row = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getCursorBufferPosition().row : void 0;
      this.count.Line = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentLine = message.currentFile && message.range && message.range.intersectsRow(row)) {
          this.count.Line++;
        }
      }
      return messages;
    };

    LinterViews.prototype.renderBubble = function() {
      var activeEditor, message, point, _i, _len, _ref, _results;
      this.removeBubble();
      if (!this.showBubble) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? typeof activeEditor.getPath === "function" ? activeEditor.getPath() : void 0 : void 0)) {
        return;
      }
      point = activeEditor.getCursorBufferPosition();
      _ref = this.messages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (!message.currentLine) {
          continue;
        }
        if (!message.range.containsPoint(point)) {
          continue;
        }
        this.bubble = activeEditor.markBufferRange([point, point], {
          invalidate: 'inside'
        });
        activeEditor.decorateMarker(this.bubble, {
          type: 'overlay',
          position: 'tail',
          item: this.renderBubbleContent(message)
        });
        break;
      }
      return _results;
    };

    LinterViews.prototype.renderBubbleContent = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message, false));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          var element;
          element = Message.fromMessage(trace);
          bubble.appendChild(element);
          return element.updateVisibility('Project');
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderCount = function() {
      return this.bottomContainer.setCount(this.count);
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', (function(_this) {
        return function(statusIconPosition) {
          var _ref;
          if ((_ref = _this.bottomBar) != null) {
            _ref.destroy();
          }
          return _this.bottomBar = statusBar["add" + statusIconPosition + "Tile"]({
            item: _this.bottomContainer,
            priority: statusIconPosition === 'Left' ? -100 : 100
          });
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', (function(_this) {
        return function(displayLinterInfo) {
          return _this.bottomContainer.setVisibility(displayLinterInfo);
        };
      })(this)));
    };

    LinterViews.prototype.removeBubble = function() {
      var _ref;
      if ((_ref = this.bubble) != null) {
        _ref.destroy();
      }
      return this.bubble = null;
    };

    LinterViews.prototype.dispose = function() {
      var _ref;
      this.notifyEditors({
        added: [],
        removed: this.messages
      });
      this.removeBubble();
      this.subscriptions.dispose();
      return (_ref = this.bottomBar) != null ? _ref.destroy() : void 0;
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItdmlld3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQyxjQUFlLE9BQUEsQ0FBUSxtQkFBUixFQUFmLFdBRkQsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHVCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLG9CQUFSLENBSmYsQ0FBQTs7QUFBQSxFQUtDLFVBQVcsT0FBQSxDQUFRLHNCQUFSLEVBQVgsT0FMRCxDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBRlosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQW5CLENBSGIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxlQUFBLENBQUEsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQWxDLENBSnZCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFMYixDQUFBO0FBQUEsTUFNQSxJQUFDLENB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

//# sourceURL=/Users/lildude/.atom/packages/linter/lib/linter-views.coffee
