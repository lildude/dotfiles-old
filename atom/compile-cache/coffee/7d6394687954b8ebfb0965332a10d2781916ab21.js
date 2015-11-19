
/*
  lib/main.coffee
 */

(function() {
  var $, MarkdownScrlSync;

  $ = null;

  MarkdownScrlSync = (function() {
    function MarkdownScrlSync() {}

    MarkdownScrlSync.prototype.activate = function(state) {
      return process.nextTick((function(_this) {
        return function() {
          var MarkdownPreviewView, SubAtom, TextEditor, pathUtil, prvwPkg, viewPath;
          pathUtil = require('path');
          _this.roaster = require('roaster');
          TextEditor = require('atom').TextEditor;
          $ = require('space-pen').$;
          SubAtom = require('sub-atom');
          _this.subs = new SubAtom;
          if (!(prvwPkg = atom.packages.getLoadedPackage('markdown-preview'))) {
            console.log('markdown-scroll-sync: markdown-preview package not found');
            return;
          }
          viewPath = pathUtil.join(prvwPkg.path, 'lib/markdown-preview-view');
          MarkdownPreviewView = require(viewPath);
          return _this.subs.add(atom.workspace.observeActivePaneItem(function(editor) {
            var preview, _i, _len, _ref;
            if (editor instanceof TextEditor && editor.alive && editor.getGrammar().name === 'GitHub Markdown') {
              _this.stopTracking();
              _ref = atom.workspace.getPaneItems();
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                preview = _ref[_i];
                if (preview instanceof MarkdownPreviewView && preview.editor === editor) {
                  _this.startTracking(editor, preview);
                  break;
                }
              }
              return null;
            }
          }));
        };
      })(this));
    };

    MarkdownScrlSync.prototype.startTracking = function(editor, preview) {
      var $lines, editorView, lastBotRow, lastTopRow, shadow;
      editorView = atom.views.getView(editor);
      if (!(shadow = editorView.shadowRoot)) {
        return;
      }
      $lines = $(shadow.querySelector('.lines'));
      lastTopRow = lastBotRow = null;
      return this.scrollInterval = setInterval((function(_this) {
        return function() {
          var botRow, bufPos, e, endPos, mdBeforeTopLine, topRow;
          if (!editor.alive) {
            _this.stopTracking();
            return;
          }
          topRow = Math.min();
          botRow = Math.max();
          $lines.find('.line').each(function(idx, ele) {
            var row;
            row = $(ele).attr('data-screen-row');
            topRow = Math.min(topRow, row);
            return botRow = Math.max(botRow, row);
          });
          endPos = editor.screenPositionForBufferPosition(editor.getBuffer().getEndPosition()).row;
          if (botRow !== lastBotRow && botRow >= endPos - 1) {
            preview.scrollToBottom();
          } else if (topRow !== lastTopRow) {
            try {
              bufPos = editor.bufferPositionForScreenPosition([topRow + 1, 0]);
            } catch (_error) {
              e = _error;
              console.log('markdown-scroll-sync: error in bufferPositionForScreenPosition', {
                editor: editor,
                topRow: topRow,
                e: e
              });
              return;
            }
            mdBeforeTopLine = editor.getTextInBufferRange([[0, 0], bufPos]);
            _this.scroll(preview, mdBeforeTopLine);
          }
          lastTopRow = topRow;
          return lastBotRow = botRow;
        };
      })(this), 300);
    };

    MarkdownScrlSync.prototype.walkDOM = function(node) {
      var _ref;
      node = node.firstChild;
      while (node) {
        if ((_ref = node.nodeType) === 1 || _ref === 8) {
          this.resultNode = node;
          --this.numEles;
        }
        if (this.numEles <= 0) {
          return;
        }
        if (node.nodeName.toLowerCase().indexOf('atom-') < 0) {
          this.walkDOM(node);
        }
        if (this.numEles <= 0) {
          return;
        }
        node = node.nextSibling;
      }
    };

    MarkdownScrlSync.prototype.scroll = function(preview, text) {
      return this.roaster(text, {}, (function(_this) {
        return function(err, html) {
          var match, regex;
          _this.numEles = 0;
          regex = new RegExp('<([^\\/][a-z]*).*?>', 'g');
          while ((match = regex.exec(html))) {
            if (match[1].toLowerCase() !== 'code') {
              _this.numEles++;
            }
          }
          _this.resultNode = preview[0];
          _this.walkDOM(_this.resultNode);
          return _this.resultNode.scrollIntoView();
        };
      })(this));
    };

    MarkdownScrlSync.prototype.stopTracking = function() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
        return this.scrollInterval = null;
      }
    };

    MarkdownScrlSync.prototype.deactivate = function() {
      this.stopTracking();
      return this.subs.dispose();
    };

    return MarkdownScrlSync;

  })();

  module.exports = new MarkdownScrlSync;

}).call(this);
