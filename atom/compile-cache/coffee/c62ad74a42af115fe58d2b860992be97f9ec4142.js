
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
            if (!(prvwPkg = atom.packages.getLoadedPackage('markdown-preview-plus'))) {
              console.log('markdown-scroll-sync: markdown preview packages not found');
              return;
            }
          }
          viewPath = pathUtil.join(prvwPkg.path, 'lib/markdown-preview-view');
          MarkdownPreviewView = require(viewPath);
          return _this.subs.add(atom.workspace.observeActivePaneItem(function(editor) {
            var isMarkdown, preview, _i, _len, _ref;
            isMarkdown = function(editor) {
              var name, _i, _len, _ref;
              _ref = ["GitHub Markdown", "CoffeeScript (Literate)"];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                name = _ref[_i];
                if (editor.getGrammar().name === name) {
                  return true;
                }
              }
              return false;
            };
            if (editor instanceof TextEditor && editor.alive && isMarkdown(editor)) {
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
          $lines.find('.line[data-screen-row]').each(function(idx, ele) {
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
          if ((_this.resultNode = preview[0])) {
            _this.walkDOM(_this.resultNode);
            return _this.resultNode.scrollIntoView();
          }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tc2Nyb2xsLXN5bmMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLElBSkosQ0FBQTs7QUFBQSxFQU1NO2tDQUVKOztBQUFBLCtCQUFBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFFZixjQUFBLHFFQUFBO0FBQUEsVUFBQSxRQUFBLEdBQWUsT0FBQSxDQUFRLE1BQVIsQ0FBZixDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsT0FBRCxHQUFlLE9BQUEsQ0FBUSxTQUFSLENBRGYsQ0FBQTtBQUFBLFVBR0MsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBSEQsQ0FBQTtBQUFBLFVBSUMsSUFBYyxPQUFBLENBQVEsV0FBUixFQUFkLENBSkQsQ0FBQTtBQUFBLFVBS0EsT0FBQSxHQUFlLE9BQUEsQ0FBUSxVQUFSLENBTGYsQ0FBQTtBQUFBLFVBTUEsS0FBQyxDQUFBLElBQUQsR0FBZSxHQUFBLENBQUEsT0FOZixDQUFBO0FBUUEsVUFBQSxJQUFHLENBQUEsQ0FBSyxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixrQkFBL0IsQ0FBWCxDQUFQO0FBQ0UsWUFBQSxJQUFHLENBQUEsQ0FBTSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQix1QkFBL0IsQ0FBWCxDQUFSO0FBQ0UsY0FBQSxPQUFPLENBQUMsR0FBUixDQUFZLDJEQUFaLENBQUEsQ0FBQTtBQUNBLG9CQUFBLENBRkY7YUFERjtX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

//# sourceURL=/Users/lildude/.atom/packages/markdown-scroll-sync/lib/main.coffee
