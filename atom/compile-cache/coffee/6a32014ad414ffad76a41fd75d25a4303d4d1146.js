(function() {
  var CompositeDisposable, DOMStylesReader, DecorationManagement, Delegato, Disposable, Emitter, MinimapRenderView, ScrollView, deprecate, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom-space-pen-views').ScrollView;

  Emitter = require('event-kit').Emitter;

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  Delegato = require('delegato');

  DecorationManagement = require('./mixins/decoration-management');

  DOMStylesReader = require('./mixins/dom-styles-reader');

  deprecate = [][0];

  module.exports = MinimapRenderView = (function(_super) {
    __extends(MinimapRenderView, _super);

    Delegato.includeInto(MinimapRenderView);

    DecorationManagement.includeInto(MinimapRenderView);

    DOMStylesReader.includeInto(MinimapRenderView);

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
      this.emitter = new Emitter;
      MinimapRenderView.__super__.constructor.apply(this, arguments);
      this.pendingChanges = [];
      this.context = this.lineCanvas[0].getContext('2d');
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.initializeDecorations();
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtxt = this.offscreenCanvas.getContext('2d');
    }

    MinimapRenderView.prototype.initialize = function() {
      var subs;
      this.lineCanvas.webkitImageSmoothingEnabled = false;
      subs = this.subscriptions;
      subs.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.forceUpdate();
        };
      })(this)));
      subs.add(atom.styles.onDidRemoveStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.forceUpdate();
        };
      })(this)));
      subs.add(atom.styles.onDidUpdateStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.forceUpdate();
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          _this.emitter.emit('did-change-scale');
          return _this.forceUpdate();
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          _this.emitter.emit('did-change-scale');
          return _this.forceUpdate();
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          _this.emitter.emit('did-change-scale');
          return _this.forceUpdate();
        };
      })(this)));
      return subs.add(atom.config.observe('minimap.textOpacity', (function(_this) {
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

    MinimapRenderView.prototype.onDidUpdate = function(callback) {
      return this.emitter.on('did-update', callback);
    };

    MinimapRenderView.prototype.onDidChangeScale = function(callback) {
      return this.emitter.on('did-change-scale', callback);
    };

    MinimapRenderView.prototype.setEditorView = function(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      this.buffer = this.editor.getBuffer();
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
      return this.subscriptions.add(this.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          _this.invalidateIfFirstTokenization();
          return _this.forceUpdate();
        };
      })(this)));
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
      this.lineCanvas[0].height = this.editorView.offsetHeight * devicePixelRatio;
      this.lineCanvas[0].style.height = '';
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
        return this.emitter.emit('did-update');
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

    MinimapRenderView.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.minimapView.getEditorViewRoot();
      } else {
        return this.editorView;
      }
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
      var color;
      color = this.retrieveStyleFromDom(['.editor'], 'color', false, false);
      return this.transparentize(color, this.getTextOpacity());
    };

    MinimapRenderView.prototype.getTokenColor = function(token) {
      var flatScopes;
      flatScopes = (token.scopeDescriptor || token.scopes).join();
      return this.retrieveTokenColorFromDom(token);
    };

    MinimapRenderView.prototype.getDecorationColor = function(decoration) {
      var properties;
      properties = decoration.getProperties();
      if (properties.color != null) {
        return properties.color;
      }
      return this.retrieveDecorationColorFromDom(decoration);
    };

    MinimapRenderView.prototype.retrieveTokenColorFromDom = function(token) {
      var color, scopes;
      scopes = token.scopeDescriptor || token.scopes;
      color = this.retrieveStyleFromDom(scopes, 'color');
      return this.transparentize(color, this.getTextOpacity());
    };

    MinimapRenderView.prototype.retrieveDecorationColorFromDom = function(decoration) {
      return this.retrieveStyleFromDom(decoration.getProperties().scope.split(/\s+/), 'background-color', false);
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
      if ((line != null) && (line.invisibles != null)) {
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
            color = displayCodeHighlights ? this.getTokenColor(token) : this.getDefaultColor();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsc0JBQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxXQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBRUEsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUZ0QixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSxnQ0FBUixDQUp2QixDQUFBOztBQUFBLEVBS0EsZUFBQSxHQUFrQixPQUFBLENBQVEsNEJBQVIsQ0FMbEIsQ0FBQTs7QUFBQSxFQU1DLFlBQWEsS0FOZCxDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxRQUFRLENBQUMsV0FBVCxDQUFxQixpQkFBckIsQ0FBQSxDQUFBOztBQUFBLElBQ0Esb0JBQW9CLENBQUMsV0FBckIsQ0FBaUMsaUJBQWpDLENBREEsQ0FBQTs7QUFBQSxJQUVBLGVBQWUsQ0FBQyxXQUFoQixDQUE0QixpQkFBNUIsQ0FGQSxDQUFBOztBQUFBLElBSUEsaUJBQUMsQ0FBQSxnQkFBRCxDQUFrQixXQUFsQixFQUErQixhQUEvQixFQUE4QztBQUFBLE1BQUEsVUFBQSxFQUFZLFFBQVo7S0FBOUMsQ0FKQSxDQUFBOztBQUFBLElBTUEsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFDQUFQO09BQUwsRUFBbUQsQ0FBQSxTQUFBLEtBQUEs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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-render-view.coffee