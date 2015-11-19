(function() {
  var CompositeDisposable, DecorationManagement, Delegato, Disposable, Emitter, MinimapRenderView, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom-space-pen-views').ScrollView;

  Emitter = require('emissary').Emitter;

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  Delegato = require('delegato');

  DecorationManagement = require('./mixins/decoration-management');

  module.exports = MinimapRenderView = (function(_super) {
    __extends(MinimapRenderView, _super);

    Emitter.includeInto(MinimapRenderView);

    Delegato.includeInto(MinimapRenderView);

    DecorationManagement.includeInto(MinimapRenderView);

    MinimapRenderView.delegatesMethods('getMarker', 'findMarkers', {
      toProperty: 'editor'
    });

    MinimapRenderView.content = function() {
      return this.div({
        "class": 'minimap-editor editor editor-colors'
      }, (function(_this) {
        return function() {
          return _this.tag('canvas', {
            outlet: 'lineCanvas',
            "class": 'minimap-canvas',
            id: 'line-canvas'
          });
        };
      })(this));
    };

    MinimapRenderView.prototype.frameRequested = false;


    /* Public */

    function MinimapRenderView() {
      this.update = __bind(this.update, this);
      this.subscriptions = new CompositeDisposable;
      MinimapRenderView.__super__.constructor.apply(this, arguments);
      this.pendingChanges = [];
      this.context = this.lineCanvas[0].getContext('2d');
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.initializeDecorations();
      this.tokenized = false;
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtxt = this.offscreenCanvas.getContext('2d');
    }

    MinimapRenderView.prototype.initialize = function() {
      this.lineCanvas.webkitImageSmoothingEnabled = false;
      this.subscriptions.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('minimap.textOpacity', (function(_this) {
        return function(textOpacity) {
          _this.textOpacity = textOpacity;
          return _this.forceUpdate();
        };
      })(this)));
    };

    MinimapRenderView.prototype.destroy = function() {
      this.subscriptions.dispose();
      return this.editorView = null;
    };

    MinimapRenderView.prototype.setEditorView = function(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      this.buffer = this.editorView.getEditor().getBuffer();
      this.displayBuffer = this.editor.displayBuffer;
      if (this.editor.onDidChangeScreenLines != null) {
        this.subscriptions.add(this.editor.onDidChangeScreenLines((function(_this) {
          return function(changes) {
            return _this.stackChanges(changes);
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.onDidChange((function(_this) {
          return function(changes) {
            return _this.stackChanges(changes);
          };
        })(this)));
      }
      this.subscriptions.add(this.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          _this.tokenized = true;
          return _this.forceUpdate();
        };
      })(this)));
      if (this.displayBuffer.tokenizedBuffer.fullyTokenized) {
        return this.tokenized = true;
      }
    };

    MinimapRenderView.prototype.update = function() {
      var firstRow, hasChanges, intact, intactRanges, lastRow, _i, _len;
      if (this.editorView == null) {
        return;
      }
      if (this.buffer.isDestroyed()) {
        return;
      }
      this.lineCanvas[0].width = this.lineCanvas[0].offsetWidth * devicePixelRatio;
      this.lineCanvas[0].height = this.lineCanvas[0].offsetHeight * devicePixelRatio;
      hasChanges = this.pendingChanges.length > 0;
      firstRow = this.getFirstVisibleScreenRow();
      lastRow = this.getLastVisibleScreenRow();
      intactRanges = this.computeIntactRanges(firstRow, lastRow);
      if (intactRanges.length === 0) {
        this.drawLines(this.context, firstRow, lastRow, 0);
      } else {
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intact = intactRanges[_i];
          this.copyBitmapPart(this.context, this.offscreenCanvas, intact.domStart, intact.start - firstRow, intact.end - intact.start);
        }
        this.fillGapsBetweenIntactRanges(this.context, intactRanges, firstRow, lastRow);
      }
      this.offscreenCanvas.width = this.lineCanvas[0].width;
      this.offscreenCanvas.height = this.lineCanvas[0].height;
      this.offscreenCtxt.drawImage(this.lineCanvas[0], 0, 0);
      this.offscreenFirstRow = firstRow;
      this.offscreenLastRow = lastRow;
      if (hasChanges) {
        return this.emit('minimap:updated');
      }
    };

    MinimapRenderView.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapRenderView.prototype.forceUpdate = function() {
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapRenderView.prototype.stackChanges = function(changes) {
      this.pendingChanges.push(changes);
      return this.requestUpdate();
    };

    MinimapRenderView.prototype.scrollTop = function(scrollTop) {
      if (scrollTop == null) {
        return this.cachedScrollTop || 0;
      }
      if (scrollTop === this.cachedScrollTop) {
        return;
      }
      this.cachedScrollTop = scrollTop;
      return this.update();
    };

    MinimapRenderView.prototype.getMinimapHeight = function() {
      return this.getLinesCount() * this.getLineHeight();
    };

    MinimapRenderView.prototype.getLineHeight = function() {
      return this.charHeight + this.interline;
    };

    MinimapRenderView.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    MinimapRenderView.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    MinimapRenderView.prototype.getTextOpacity = function() {
      return this.textOpacity;
    };

    MinimapRenderView.prototype.getLinesCount = function() {
      return this.editor.getScreenLineCount();
    };

    MinimapRenderView.prototype.getMinimapScreenHeight = function() {
      return this.minimapView.height();
    };

    MinimapRenderView.prototype.getMinimapHeightInLines = function() {
      return Math.ceil(this.getMinimapScreenHeight() / this.getLineHeight());
    };

    MinimapRenderView.prototype.getFirstVisibleScreenRow = function() {
      var screenRow;
      screenRow = Math.floor(this.scrollTop() / this.getLineHeight());
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapRenderView.prototype.getLastVisibleScreenRow = function() {
      var calculatedRow, screenRow;
      calculatedRow = Math.ceil((this.scrollTop() + this.getMinimapScreenHeight()) / this.getLineHeight()) - 1;
      screenRow = Math.max(0, Math.min(this.editor.getScreenLineCount() - 1, calculatedRow));
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapRenderView.prototype.getClientRect = function() {
      var canvas;
      canvas = this.lineCanvas[0];
      return {
        width: canvas.scrollWidth,
        height: this.getMinimapHeight()
      };
    };

    MinimapRenderView.prototype.pixelPositionForScreenPosition = function(position) {
      var actualRow, column, row, _ref1;
      _ref1 = this.buffer.constructor.Point.fromObject(position), row = _ref1.row, column = _ref1.column;
      actualRow = Math.floor(row);
      return {
        top: row * this.getLineHeight() * devicePixelRatio,
        left: column * devicePixelRatio
      };
    };

    MinimapRenderView.prototype.getDefaultColor = function() {
      return this.transparentize(this.minimapView.editorView.css('color'), this.getTextOpacity());
    };

    MinimapRenderView.prototype.getTokenColor = function(token) {
      var color, flatScopes;
      flatScopes = (token.scopeDescriptor || token.scopes).join();
      if (!(flatScopes in this.tokenColorCache)) {
        color = this.retrieveTokenColorFromDom(token);
        this.tokenColorCache[flatScopes] = color;
      }
      return this.tokenColorCache[flatScopes];
    };

    MinimapRenderView.prototype.getDecorationColor = function(decoration) {
      var color, properties;
      properties = decoration.getProperties();
      if (properties.color != null) {
        return properties.color;
      }
      if (!(properties.scope in this.decorationColorCache)) {
        color = this.retrieveDecorationColorFromDom(decoration);
        this.decorationColorCache[properties.scope] = color;
      }
      return this.decorationColorCache[properties.scope];
    };

    MinimapRenderView.prototype.retrieveTokenColorFromDom = function(token) {
      var color, scopes;
      scopes = token.scopeDescriptor || token.scopes;
      color = this.retrieveStyleFromDom(scopes, 'color');
      return this.transparentize(color, this.getTextOpacity());
    };

    MinimapRenderView.prototype.retrieveDecorationColorFromDom = function(decoration) {
      return this.retrieveStyleFromDom(decoration.getProperties().scope.split(/\s+/), 'background-color');
    };

    MinimapRenderView.prototype.retrieveStyleFromDom = function(scopes, property) {
      var node, parent, scope, value, _i, _len;
      this.ensureDummyNodeExistence();
      parent = this.dummyNode;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');
        if (parent != null) {
          parent.appendChild(node);
        }
        parent = node;
      }
      value = getComputedStyle(parent).getPropertyValue(property);
      this.dummyNode.innerHTML = '';
      return value;
    };

    MinimapRenderView.prototype.ensureDummyNodeExistence = function() {
      if (this.dummyNode == null) {
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
        return this.editorView.append(this.dummyNode);
      }
    };

    MinimapRenderView.prototype.transparentize = function(color, opacity) {
      if (opacity == null) {
        opacity = 1;
      }
      return color.replace('rgb(', 'rgba(').replace(')', ", " + opacity + ")");
    };

    MinimapRenderView.prototype.drawLines = function(context, firstRow, lastRow, offsetRow) {
      var canvasWidth, charHeight, charWidth, color, decoration, decorations, displayCodeHighlights, highlightDecorations, line, lineDecorations, lineHeight, lines, re, row, screenRow, token, value, w, x, y, y0, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref1;
      if (firstRow > lastRow) {
        return;
      }
      lines = this.editor.tokenizedLinesForScreenRows(firstRow, lastRow);
      lineHeight = this.getLineHeight() * devicePixelRatio;
      charHeight = this.getCharHeight() * devicePixelRatio;
      charWidth = this.getCharWidth() * devicePixelRatio;
      canvasWidth = this.lineCanvas.width() * devicePixelRatio;
      displayCodeHighlights = this.minimapView.displayCodeHighlights;
      decorations = this.decorationsForScreenRowRange(firstRow, lastRow);
      line = lines[0];
      if (line.invisibles != null) {
        re = RegExp("" + line.invisibles.cr + "|" + line.invisibles.eol + "|" + line.invisibles.space + "|" + line.invisibles.tab, "g");
      }
      for (row = _i = 0, _len = lines.length; _i < _len; row = ++_i) {
        line = lines[row];
        x = 0;
        y = offsetRow + row;
        screenRow = firstRow + row;
        y0 = y * lineHeight;
        lineDecorations = this.decorationsByTypesForRow(screenRow, 'line', decorations);
        for (_j = 0, _len1 = lineDecorations.length; _j < _len1; _j++) {
          decoration = lineDecorations[_j];
          context.fillStyle = this.getDecorationColor(decoration);
          context.fillRect(0, y0, canvasWidth, lineHeight);
        }
        highlightDecorations = this.decorationsByTypesForRow(firstRow + row, 'highlight-under', decorations);
        for (_k = 0, _len2 = highlightDecorations.length; _k < _len2; _k++) {
          decoration = highlightDecorations[_k];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
        _ref1 = line.tokens;
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          token = _ref1[_l];
          w = token.screenDelta;
          if (!token.isOnlyWhitespace()) {
            color = displayCodeHighlights && this.tokenized ? this.getTokenColor(token) : this.getDefaultColor();
            value = token.value;
            if (re != null) {
              value = value.replace(re, ' ');
            }
            x = this.drawToken(context, value, color, x, y0, charWidth, charHeight);
          } else {
            x += w * charWidth;
          }
        }
        highlightDecorations = this.decorationsByTypesForRow(firstRow + row, 'highlight', 'highlight-over', decorations);
        for (_m = 0, _len4 = highlightDecorations.length; _m < _len4; _m++) {
          decoration = highlightDecorations[_m];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
      }
      return context.fill();
    };

    MinimapRenderView.prototype.drawToken = function(context, text, color, x, y, charWidth, charHeight) {
      var char, chars, _i, _len;
      context.fillStyle = color;
      chars = 0;
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        char = text[_i];
        if (/\s/.test(char)) {
          if (chars > 0) {
            context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
          }
          chars = 0;
        } else {
          chars++;
        }
        x += charWidth;
      }
      if (chars > 0) {
        context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
      }
      return x;
    };

    MinimapRenderView.prototype.drawHighlightDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
      var colSpan, range, rowSpan, x;
      context.fillStyle = this.getDecorationColor(decoration);
      range = decoration.getMarker().getScreenRange();
      rowSpan = range.end.row - range.start.row;
      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        return context.fillRect(range.start.column * charWidth, y * lineHeight, colSpan * charWidth, lineHeight);
      } else {
        if (screenRow === range.start.row) {
          x = range.start.column * charWidth;
          return context.fillRect(x, y * lineHeight, canvasWidth - x, lineHeight);
        } else if (screenRow === range.end.row) {
          return context.fillRect(0, y * lineHeight, range.end.column * charWidth, lineHeight);
        } else {
          return context.fillRect(0, y * lineHeight, canvasWidth, lineHeight);
        }
      }
    };

    MinimapRenderView.prototype.copyBitmapPart = function(context, bitmapCanvas, srcRow, destRow, rowCount) {
      var lineHeight;
      lineHeight = this.getLineHeight() * devicePixelRatio;
      return context.drawImage(bitmapCanvas, 0, srcRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight, 0, destRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight);
    };


    /* Internal */

    MinimapRenderView.prototype.fillGapsBetweenIntactRanges = function(context, intactRanges, firstRow, lastRow) {
      var currentRow, intact, _i, _len;
      currentRow = firstRow;
      for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
        intact = intactRanges[_i];
        this.drawLines(context, currentRow, intact.start - 1, currentRow - firstRow);
        currentRow = intact.end;
      }
      if (currentRow <= lastRow) {
        return this.drawLines(context, currentRow, lastRow, currentRow - firstRow);
      }
    };

    MinimapRenderView.prototype.computeIntactRanges = function(firstRow, lastRow) {
      var change, intactRange, intactRanges, newIntactRanges, range, _i, _j, _len, _len1, _ref1;
      if ((this.offscreenFirstRow == null) && (this.offscreenLastRow == null)) {
        return [];
      }
      intactRanges = [
        {
          start: this.offscreenFirstRow,
          end: this.offscreenLastRow,
          domStart: 0
        }
      ];
      _ref1 = this.pendingChanges;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
        newIntactRanges = [];
        for (_j = 0, _len1 = intactRanges.length; _j < _len1; _j++) {
          range = intactRanges[_j];
          if (change.end < range.start && change.screenDelta !== 0) {
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              domStart: range.domStart
            });
          } else if (change.end < range.start || change.start > range.end) {
            newIntactRanges.push(range);
          } else {
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                domStart: range.domStart
              });
            }
            if (change.end < range.end) {
              newIntactRanges.push({
                start: change.end + change.screenDelta + 1,
                end: range.end + change.screenDelta,
                domStart: range.domStart + change.end + 1 - range.start
              });
            }
          }
          intactRange = newIntactRanges[newIntactRanges.length - 1];
          if ((intactRange != null) && (isNaN(intactRange.end) || isNaN(intactRange.start))) {
            debugger;
          }
        }
        intactRanges = newIntactRanges;
      }
      this.truncateIntactRanges(intactRanges, firstRow, lastRow);
      this.pendingChanges = [];
      return intactRanges;
    };

    MinimapRenderView.prototype.truncateIntactRanges = function(intactRanges, firstRow, lastRow) {
      var i, range;
      i = 0;
      while (i < intactRanges.length) {
        range = intactRanges[i];
        if (range.start < firstRow) {
          range.domStart += firstRow - range.start;
          range.start = firstRow;
        }
        if (range.end > lastRow) {
          range.end = lastRow;
        }
        if (range.start >= range.end) {
          intactRanges.splice(i--, 1);
        }
        i++;
      }
      return intactRanges.sort(function(a, b) {
        return a.domStart - b.domStart;
      });
    };

    return MinimapRenderView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsc0JBQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxVQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBRUEsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUZ0QixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSxnQ0FBUixDQUp2QixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixpQkFBcEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsaUJBQXJCLENBREEsQ0FBQTs7QUFBQSxJQUVBLG9CQUFvQixDQUFDLFdBQXJCLENBQWlDLGlCQUFqQyxDQUZBLENBQUE7O0FBQUEsSUFJQSxpQkFBQyxDQUFBLGdCQUFELENBQWtCLFdBQWxCLEVBQStCLGFBQS9CLEVBQThDO0FBQUEsTUFBQSxVQUFBLEVBQVksUUFBWjtLQUE5QyxDQUpBLENBQUE7O0FBQUEsSUFNQSxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8scUNBQVA7T0FBTCxFQUFtRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNqRCxLQUFDLENBQUEsR0FBRCxDQUFLLFFBQUwsRUFBZTtBQUFBLFlBQ2IsTUFBQSxFQUFR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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-render-view.coffee