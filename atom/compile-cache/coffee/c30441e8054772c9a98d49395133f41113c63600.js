(function() {
  var BottomStatus, BottomTab, LinterViews, Message;

  BottomTab = require('./views/bottom-tab');

  BottomStatus = require('./views/bottom-status');

  Message = require('./views/message');

  LinterViews = (function() {
    function LinterViews(linter) {
      var visibleTabs, _ref;
      this.linter = linter;
      this.showPanel = true;
      this.showBubble = true;
      this.underlineIssues = true;
      this.messages = new Set;
      this.markers = [];
      this.statusTiles = [];
      this.tabs = new Map;
      this.tabs.set('line', new BottomTab());
      this.tabs.set('file', new BottomTab());
      this.tabs.set('project', new BottomTab());
      this.panel = document.createElement('div');
      this.bubble = null;
      this.bottomStatus = new BottomStatus();
      this.tabs.get('line').initialize('Line', (function(_this) {
        return function() {
          return _this.changeTab('line');
        };
      })(this));
      this.tabs.get('file').initialize('File', (function(_this) {
        return function() {
          return _this.changeTab('file');
        };
      })(this));
      this.tabs.get('project').initialize('Project', (function(_this) {
        return function() {
          return _this.changeTab('project');
        };
      })(this));
      this.bottomStatus.initialize();
      this.bottomStatus.addEventListener('click', function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter:next-error');
      });
      this.panelWorkspace = atom.workspace.addBottomPanel({
        item: this.panel,
        visible: false
      });
      visibleTabs = this.getVisibleTabKeys();
      this.scope = (_ref = atom.config.get('linter.defaultErrorTab', 'File')) != null ? _ref.toLowerCase() : void 0;
      if (visibleTabs.indexOf(this.scope) === -1) {
        this.scope = visibleTabs[0];
      }
      this.tabs.forEach((function(_this) {
        return function(tab, key) {
          tab.visible = false;
          return tab.active = _this.scope === key;
        };
      })(this));
      this.panel.id = 'linter-panel';
    }

    LinterViews.prototype.getMessages = function() {
      return this.messages;
    };

    LinterViews.prototype.setPanelVisibility = function(Status) {
      if (Status) {
        if (!this.panelWorkspace.isVisible()) {
          return this.panelWorkspace.show();
        }
      } else {
        if (this.panelWorkspace.isVisible()) {
          return this.panelWorkspace.hide();
        }
      }
    };

    LinterViews.prototype.setShowPanel = function(showPanel) {
      atom.config.set('linter.showErrorPanel', showPanel);
      this.showPanel = showPanel;
      if (showPanel) {
        return this.panel.removeAttribute('hidden');
      } else {
        return this.panel.setAttribute('hidden', true);
      }
    };

    LinterViews.prototype.setShowBubble = function(showBubble) {
      this.showBubble = showBubble;
    };

    LinterViews.prototype.setUnderlineIssues = function(underlineIssues) {
      this.underlineIssues = underlineIssues;
    };

    LinterViews.prototype.setBubbleOpaque = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.remove('transparent');
      }
      document.removeEventListener('keyup', this.setBubbleOpaque);
      return window.removeEventListener('blur', this.setBubbleOpaque);
    };

    LinterViews.prototype.setBubbleTransparent = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.add('transparent');
        document.addEventListener('keyup', this.setBubbleOpaque);
        return window.addEventListener('blur', this.setBubbleOpaque);
      }
    };

    LinterViews.prototype.render = function() {
      var counts, hasActiveEditor, visibleTabs;
      counts = {
        project: 0,
        file: 0
      };
      this.messages.clear();
      this.linter.eachEditorLinter((function(_this) {
        return function(editorLinter) {
          return _this.extractMessages(editorLinter.getMessages(), counts);
        };
      })(this));
      this.extractMessages(this.linter.getProjectMessages(), counts);
      this.updateLineMessages();
      this.renderPanel();
      this.tabs.get('file').count = counts.file;
      this.tabs.get('project').count = counts.project;
      this.bottomStatus.count = counts.project;
      hasActiveEditor = typeof atom.workspace.getActiveTextEditor() !== 'undefined';
      visibleTabs = this.getVisibleTabKeys();
      this.tabs.forEach(function(tab, key) {
        tab.visibility = hasActiveEditor && visibleTabs.indexOf(key) !== -1;
        tab.classList.remove('first-tab');
        return tab.classList.remove('last-tab');
      });
      if (visibleTabs.length > 0) {
        this.tabs.get(visibleTabs[0]).classList.add('first-tab');
        return this.tabs.get(visibleTabs[visibleTabs.length - 1]).classList.add('last-tab');
      }
    };

    LinterViews.prototype.updateBubble = function(point) {
      var activeEditor;
      this.removeBubble();
      if (!this.showBubble) {
        return;
      }
      if (!this.messages.size) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? activeEditor.getPath() : void 0)) {
        return;
      }
      point = point || activeEditor.getCursorBufferPosition();
      try {
        return this.messages.forEach((function(_this) {
          return function(message) {
            var _ref;
            if (!message.currentFile) {
              return;
            }
            if (!((_ref = message.range) != null ? _ref.containsPoint(point) : void 0)) {
              return;
            }
            _this.bubble = activeEditor.markBufferRange([point, point], {
              invalidate: 'never'
            });
            activeEditor.decorateMarker(_this.bubble, {
              type: 'overlay',
              position: 'tail',
              item: _this.renderBubble(message)
            });
            throw null;
          };
        })(this));
      } catch (_error) {}
    };

    LinterViews.prototype.updateCurrentLine = function(line) {
      if (this.currentLine !== line) {
        this.currentLine = line;
        this.updateLineMessages();
        return this.renderPanel();
      }
    };

    LinterViews.prototype.updateLineMessages = function() {
      var activeEditor;
      activeEditor = atom.workspace.getActiveTextEditor();
      return this.linter.eachEditorLinter((function(_this) {
        return function(editorLinter) {
          if (editorLinter.editor !== activeEditor) {
            return;
          }
          _this.lineMessages = [];
          _this.messages.forEach(function(message) {
            var _ref;
            if (message.currentFile && ((_ref = message.range) != null ? _ref.intersectsRow(_this.currentLine) : void 0)) {
              return _this.lineMessages.push(message);
            }
          });
          return _this.tabs.get('line').count = _this.lineMessages.length;
        };
      })(this));
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      var statusIconPosition;
      this.statusTiles.push(statusBar.addLeftTile({
        item: this.tabs.get('line'),
        priority: -1002
      }));
      this.statusTiles.push(statusBar.addLeftTile({
        item: this.tabs.get('file'),
        priority: -1001
      }));
      this.statusTiles.push(statusBar.addLeftTile({
        item: this.tabs.get('project'),
        priority: -1000
      }));
      statusIconPosition = atom.config.get('linter.statusIconPosition');
      return this.statusTiles.push(statusBar["add" + statusIconPosition + "Tile"]({
        item: this.bottomStatus,
        priority: 999
      }));
    };

    LinterViews.prototype.destroy = function() {
      var statusTile, _i, _len, _ref, _results;
      this.messages.clear();
      this.removeMarkers();
      this.panelWorkspace.destroy();
      this.removeBubble();
      _ref = this.statusTiles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        statusTile = _ref[_i];
        _results.push(statusTile.destroy());
      }
      return _results;
    };

    LinterViews.prototype.changeTab = function(Tab) {
      if (this.getActiveTabKey() === Tab) {
        this.showPanel = !this.showPanel;
        this.tabs.forEach(function(tab, key) {
          return tab.active = false;
        });
      } else {
        this.showPanel = true;
        this.scope = Tab;
        this.tabs.forEach(function(tab, key) {
          return tab.active = Tab === key;
        });
        this.renderPanel();
      }
      return this.setShowPanel(this.showPanel);
    };

    LinterViews.prototype.getActiveTabKey = function() {
      var activeKey;
      activeKey = null;
      this.tabs.forEach(function(tab, key) {
        if (tab.active) {
          return activeKey = key;
        }
      });
      return activeKey;
    };

    LinterViews.prototype.getActiveTab = function() {
      return this.tabs.entries().find(function(tab) {
        return tab.active;
      });
    };

    LinterViews.prototype.getVisibleTabKeys = function() {
      return [atom.config.get('linter.showErrorTabLine') ? 'line' : void 0, atom.config.get('linter.showErrorTabFile') ? 'file' : void 0, atom.config.get('linter.showErrorTabProject') ? 'project' : void 0].filter(function(key) {
        return key;
      });
    };

    LinterViews.prototype.removeBubble = function() {
      if (!this.bubble) {
        return;
      }
      this.bubble.destroy();
      return this.bubble = null;
    };

    LinterViews.prototype.renderBubble = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          return bubble.appendChild(Message.fromMessage(trace, {
            addPath: true
          }));
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderPanel = function() {
      var activeEditor;
      this.panel.innerHTML = '';
      this.removeMarkers();
      this.removeBubble();
      if (!this.messages.size) {
        return this.setPanelVisibility(false);
      }
      this.setPanelVisibility(true);
      activeEditor = atom.workspace.getActiveTextEditor();
      this.messages.forEach((function(_this) {
        return function(message) {
          var Element, marker;
          if (_this.scope === 'file') {
            if (!message.currentFile) {
              return;
            }
          }
          if (message.currentFile && message.range) {
            _this.markers.push(marker = activeEditor.markBufferRange(message.range, {
              invalidate: 'never'
            }));
            activeEditor.decorateMarker(marker, {
              type: 'line-number',
              "class": "linter-highlight " + message["class"]
            });
            if (_this.underlineIssues) {
              activeEditor.decorateMarker(marker, {
                type: 'highlight',
                "class": "linter-highlight " + message["class"]
              });
            }
          }
          if (_this.scope === 'line') {
            if (_this.lineMessages.indexOf(message) === -1) {
              return;
            }
          }
          Element = Message.fromMessage(message, {
            addPath: _this.scope === 'project',
            cloneNode: true
          });
          return _this.panel.appendChild(Element);
        };
      })(this));
      return this.updateBubble();
    };

    LinterViews.prototype.removeMarkers = function() {
      var marker, _i, _len, _ref;
      if (!this.markers.length) {
        return;
      }
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        try {
          marker.destroy();
        } catch (_error) {}
      }
      return this.markers = [];
    };

    LinterViews.prototype.extractMessages = function(Gen, counts) {
      var activeEditor, activeFile, isProject;
      isProject = this.scope === 'project';
      activeEditor = atom.workspace.getActiveTextEditor();
      activeFile = activeEditor != null ? activeEditor.getPath() : void 0;
      return Gen.forEach((function(_this) {
        return function(Entry) {
          return Entry.forEach(function(message) {
            if (activeEditor && ((!message.filePath && !isProject) || message.filePath === activeFile)) {
              counts.file++;
              counts.project++;
              message.currentFile = true;
            } else {
              counts.project++;
              message.currentFile = false;
            }
            return _this.messages.add(message);
          });
        };
      })(this));
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);
