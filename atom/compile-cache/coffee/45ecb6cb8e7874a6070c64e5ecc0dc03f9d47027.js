(function() {
  var CompositeDisposable, Emitter, LinterView, fs, log, moveToNextMessage, moveToPreviousMessage, path, rimraf, temp, warn, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp');

  path = require('path');

  rimraf = require('rimraf');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn, moveToPreviousMessage = _ref1.moveToPreviousMessage, moveToNextMessage = _ref1.moveToNextMessage;

  temp.track();

  LinterView = (function() {
    LinterView.prototype.linters = [];

    LinterView.prototype.totalProcessed = 0;

    LinterView.prototype.tempFile = '';

    LinterView.prototype.messages = [];

    function LinterView(editor, statusBarView, statusBarSummaryView, inlineView, allLinters) {
      this.editor = editor;
      this.statusBarView = statusBarView;
      this.statusBarSummaryView = statusBarSummaryView;
      this.inlineView = inlineView;
      this.allLinters = allLinters != null ? allLinters : [];
      this.processMessage = __bind(this.processMessage, this);
      this.handleEditorEvents = __bind(this.handleEditorEvents, this);
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      if (this.editor == null) {
        warn("No editor instance on this editor");
      }
      this.markers = null;
      this.initLinters();
      this.handleEditorEvents();
      this.handleConfigChanges();
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.updateViews();
        };
      })(this)));
    }

    LinterView.prototype.initLinters = function() {
      var grammarName, linter, _i, _len, _ref2, _results;
      this.linters = [];
      grammarName = this.editor.getGrammar().scopeName;
      _ref2 = this.allLinters;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        linter = _ref2[_i];
        if (_.isArray(linter.syntax) && __indexOf.call(linter.syntax, grammarName) >= 0 || _.isString(linter.syntax) && grammarName === linter.syntax || linter.syntax instanceof RegExp && linter.syntax.test(grammarName)) {
          _results.push(this.linters.push(new linter(this.editor)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LinterView.prototype.handleConfigChanges = function() {
      this.subscriptions.add(atom.config.observe('linter.lintOnSave', (function(_this) {
        return function(lintOnSave) {
          return _this.lintOnSave = lintOnSave;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChangeInterval', (function(_this) {
        return function(lintOnModifiedDelayMS) {
          var throttleInterval;
          throttleInterval = parseInt(lintOnModifiedDelayMS);
          if (isNaN(throttleInterval)) {
            throttleInterval = 1000;
          }
          return _this.throttledLint = (_.throttle(_this.lint, throttleInterval)).bind(_this);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChange', (function(_this) {
        return function(lintOnModified) {
          return _this.lintOnModified = lintOnModified;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnEditorFocus', (function(_this) {
        return function(lintOnEditorFocus) {
          return _this.lintOnEditorFocus = lintOnEditorFocus;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showGutters', (function(_this) {
        return function(showGutters) {
          _this.showGutters = showGutters;
          return _this.display();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.statusBar', (function(_this) {
        return function(statusBar) {
          _this.showMessagesAroundCursor = statusBar !== 'None';
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showErrorInline) {
          _this.showErrorInline = showErrorInline;
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showHighlighting', (function(_this) {
        return function(showHighlighting) {
          _this.showHighlighting = showHighlighting;
          return _this.display();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showInfoMessages', (function(_this) {
        return function(showInfoMessages) {
          _this.showInfoMessages = showInfoMessages;
          return _this.display();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.clearOnChange', (function(_this) {
        return function(clearOnChange) {
          return _this.clearOnChange = clearOnChange;
        };
      })(this)));
    };

    LinterView.prototype.handleEditorEvents = function() {
      var maybeLintOnSave;
      this.editor.onDidChangeGrammar((function(_this) {
        return function() {
          _this.initLinters();
          return _this.lint();
        };
      })(this));
      maybeLintOnSave = (function(_this) {
        return function() {
          if (_this.lintOnSave) {
            return _this.throttledLint();
          }
        };
      })(this);
      this.subscriptions.add(this.editor.getBuffer().onDidReload(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidSave(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.throttledLint();
          } else if (_this.clearOnChange && _this.messages.length > 0) {
            _this.messages = [];
            _this.updateViews();
            return _this.destroyMarkers();
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.remove();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function() {
          var _ref2;
          if (_this.editor.id === ((_ref2 = atom.workspace.getActiveTextEditor()) != null ? _ref2.id : void 0)) {
            if (_this.lintOnEditorFocus) {
              _this.throttledLint();
            }
            return _this.updateViews();
          } else {
            _this.statusBarView.hide();
            _this.statusBarSummaryView.remove();
            return _this.inlineView.remove();
          }
        };
      })(this)));
      this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:lint", (function(_this) {
        return function() {
          return _this.lint();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:next-message", (function(_this) {
        return function() {
          return moveToNextMessage(_this.messages, _this.editor);
        };
      })(this)));
      return this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:previous-message", (function(_this) {
        return function() {
          return moveToPreviousMessage(_this.messages, _this.editor);
        };
      })(this)));
    };

    LinterView.prototype.lint = function() {
      if (this.linters.length === 0) {
        return;
      }
      this.totalProcessed = 0;
      this.messages = [];
      this.destroyMarkers();
      return temp.mkdir({
        prefix: 'AtomLinter',
        suffix: this.editor.getGrammar().scopeName
      }, (function(_this) {
        return function(err, tmpDir) {
          var fileName, tempFileInfo;
          if (err != null) {
            throw err;
          }
          fileName = path.basename(_this.editor.getPath());
          tempFileInfo = {
            completedLinters: 0,
            path: path.join(tmpDir, fileName)
          };
          return fs.writeFile(tempFileInfo.path, _this.editor.getText(), function(err) {
            if (err != null) {
              throw err;
            }
            _this.linters.forEach(function(linter) {
              return linter.lintFile(tempFileInfo.path, function(messages) {
                return _this.processMessage(messages, tempFileInfo, linter);
              });
            });
          });
        };
      })(this));
    };

    LinterView.prototype.processMessage = function(messages, tempFileInfo, linter) {
      log("" + linter.linterName + " returned", linter, messages);
      this.messages = this.messages.concat(messages);
      tempFileInfo.completedLinters++;
      if (tempFileInfo.completedLinters === this.linters.length) {
        this.display(this.messages);
        return rimraf(tempFileInfo.path, function(err) {
          if (err != null) {
            throw err;
          }
        });
      }
    };

    LinterView.prototype.destroyMarkers = function() {
      var m, _i, _len, _ref2;
      if (this.markers == null) {
        return;
      }
      _ref2 = this.markers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        m.destroy();
      }
      return this.markers = null;
    };

    LinterView.prototype.createMarker = function(message) {
      var klass, marker;
      marker = this.editor.markBufferRange(message.range, {
        invalidate: 'never'
      });
      klass = 'linter-' + message.level;
      if (this.showGutters) {
        this.editor.decorateMarker(marker, {
          type: 'line-number',
          "class": klass
        });
      }
      if (this.showHighlighting) {
        this.editor.decorateMarker(marker, {
          type: 'highlight',
          "class": klass
        });
      }
      return marker;
    };

    LinterView.prototype.sortMessagesByLine = function(messages) {
      var lNum, levels, line, lines, message, msgLevel, _i, _len;
      lines = {};
      levels = ['warning', 'error'];
      if (this.showInfoMessages) {
        levels.unshift('info');
      }
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        message = messages[_i];
        lNum = message.line;
        line = lines[lNum] || {
          'level': -1
        };
        msgLevel = levels.indexOf(message.level);
        if (!(msgLevel > line.level)) {
          continue;
        }
        line.level = msgLevel;
        line.msg = message;
        lines[lNum] = line;
      }
      return lines;
    };

    LinterView.prototype.display = function(messages) {
      var lNum, line, marker, _ref2;
      if (messages == null) {
        messages = [];
      }
      this.destroyMarkers();
      if (!this.editor.isAlive()) {
        return;
      }
      if (!(this.showGutters || this.showHighlighting)) {
        this.updateViews();
        return;
      }
      if (this.markers == null) {
        this.markers = [];
      }
      _ref2 = this.sortMessagesByLine(messages);
      for (lNum in _ref2) {
        line = _ref2[lNum];
        marker = this.createMarker(line.msg);
        this.markers.push(marker);
      }
      return this.updateViews();
    };

    LinterView.prototype.updateViews = function() {
      this.statusBarSummaryView.render(this.messages, this.editor);
      if (this.showMessagesAroundCursor) {
        this.statusBarView.render(this.messages, this.editor);
      } else {
        this.statusBarView.render([], this.editor);
      }
      if (this.showErrorInline) {
        return this.inlineView.render(this.messages, this.editor);
      } else {
        return this.inlineView.render([], this.editor);
      }
    };

    LinterView.prototype.remove = function() {
      var l, _i, _len, _ref2;
      this.statusBarView.hide();
      this.statusBarSummaryView.remove();
      this.inlineView.remove();
      this.subscriptions.dispose();
      _ref2 = this.linters;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        l = _ref2[_i];
        l.destroy();
      }
      return this.emitter.emit('did-destroy');
    };

    LinterView.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFJQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUx0QixDQUFBOztBQUFBLEVBT0EsUUFBd0QsT0FBQSxDQUFRLFNBQVIsQ0FBeEQsRUFBQyxZQUFBLEdBQUQsRUFBTSxhQUFBLElBQU4sRUFBWSw4QkFBQSxxQkFBWixFQUFtQywwQkFBQSxpQkFQbkMsQ0FBQTs7QUFBQSxFQVVBLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FWQSxDQUFBOztBQUFBLEVBYU07QUFFSix5QkFBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLHlCQUNBLGNBQUEsR0FBZ0IsQ0FEaEIsQ0FBQTs7QUFBQSx5QkFFQSxRQUFBLEdBQVUsRUFGVixDQUFBOztBQUFBLHlCQUdBLFFBQUEsR0FBVSxFQUhWLENBQUE7O0FBVWEsSUFBQSxvQkFBRSxNQUFGLEVBQVcsYUFBWCxFQUEyQixvQkFBM0IsRUFBa0QsVUFBbEQsRUFBK0QsVUFBL0QsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLGdCQUFBLGFBQ3RCLENBQUE7QUFBQSxNQURxQyxJQUFD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
//# sourceURL=/Users/lildude/.atom/packages/linter/lib/linter-view.coffee