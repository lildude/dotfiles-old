(function() {
  var CanvasDrawer, Mixin,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  module.exports = CanvasDrawer = (function(_super) {
    __extends(CanvasDrawer, _super);

    function CanvasDrawer() {
      return CanvasDrawer.__super__.constructor.apply(this, arguments);
    }

    CanvasDrawer.prototype.initializeCanvas = function() {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.canvas.webkitImageSmoothingEnabled = false;
      if (this.pendingChanges == null) {
        this.pendingChanges = [];
      }
      this.offscreenCanvas = document.createElement('canvas');
      return this.offscreenContext = this.offscreenCanvas.getContext('2d');
    };

    CanvasDrawer.prototype.updateCanvas = function() {
      var firstRow, intact, intactRanges, lastRow, _i, _len;
      firstRow = this.minimap.getFirstVisibleScreenRow();
      lastRow = this.minimap.getLastVisibleScreenRow();
      intactRanges = this.computeIntactRanges(firstRow, lastRow);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (intactRanges.length === 0) {
        this.drawLines(this.context, firstRow, lastRow, 0);
      } else {
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intact = intactRanges[_i];
          this.copyBitmapPart(this.context, this.offscreenCanvas, intact.domStart, intact.start - firstRow, intact.end - intact.start);
        }
        this.fillGapsBetweenIntactRanges(this.context, intactRanges, firstRow, lastRow);
      }
      this.offscreenCanvas.width = this.canvas.width;
      this.offscreenCanvas.height = this.canvas.height;
      this.offscreenContext.drawImage(this.canvas, 0, 0);
      this.offscreenFirstRow = firstRow;
      return this.offscreenLastRow = lastRow;
    };

    CanvasDrawer.prototype.getTextOpacity = function() {
      return this.textOpacity;
    };

    CanvasDrawer.prototype.getDefaultColor = function() {
      var color;
      color = this.retrieveStyleFromDom(['.editor'], 'color', false, false);
      return this.transparentize(color, this.getTextOpacity());
    };

    CanvasDrawer.prototype.getTokenColor = function(token) {
      var flatScopes;
      flatScopes = (token.scopeDescriptor || token.scopes).join();
      return this.retrieveTokenColorFromDom(token);
    };

    CanvasDrawer.prototype.getDecorationColor = function(decoration) {
      var properties;
      properties = decoration.getProperties();
      if (properties.color != null) {
        return properties.color;
      }
      return this.retrieveDecorationColorFromDom(decoration);
    };

    CanvasDrawer.prototype.retrieveTokenColorFromDom = function(token) {
      var color, scopes;
      scopes = token.scopeDescriptor || token.scopes;
      color = this.retrieveStyleFromDom(scopes, 'color');
      return this.transparentize(color, this.getTextOpacity());
    };

    CanvasDrawer.prototype.retrieveDecorationColorFromDom = function(decoration) {
      return this.retrieveStyleFromDom(decoration.getProperties().scope.split(/\s+/), 'background-color', false);
    };

    CanvasDrawer.prototype.transparentize = function(color, opacity) {
      if (opacity == null) {
        opacity = 1;
      }
      return color.replace('rgb(', 'rgba(').replace(')', ", " + opacity + ")");
    };

    CanvasDrawer.prototype.drawLines = function(context, firstRow, lastRow, offsetRow) {
      var canvasWidth, charHeight, charWidth, color, decoration, decorations, displayCodeHighlights, highlightDecorations, line, lineDecorations, lineHeight, lines, re, row, screenRow, token, value, w, x, y, y0, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
      if (firstRow > lastRow) {
        return;
      }
      lines = this.getTextEditor().tokenizedLinesForScreenRows(firstRow, lastRow);
      lineHeight = this.minimap.getLineHeight() * this.devicePixelRatio;
      charHeight = this.minimap.getCharHeight() * this.devicePixelRatio;
      charWidth = this.minimap.getCharWidth() * this.devicePixelRatio;
      canvasWidth = this.canvas.width;
      displayCodeHighlights = this.displayCodeHighlights;
      decorations = this.minimap.decorationsForScreenRowRange(firstRow, lastRow);
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
        lineDecorations = this.minimap.decorationsByTypesForRow(screenRow, 'line', decorations);
        if (lineDecorations.length) {
          this.drawLineDecorations(context, lineDecorations, y0, canvasWidth, lineHeight);
        }
        highlightDecorations = this.minimap.decorationsByTypesForRow(firstRow + row, 'highlight-under', decorations);
        for (_j = 0, _len1 = highlightDecorations.length; _j < _len1; _j++) {
          decoration = highlightDecorations[_j];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
        _ref = line.tokens;
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          token = _ref[_k];
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
          if (x > canvasWidth) {
            break;
          }
        }
        highlightDecorations = this.minimap.decorationsByTypesForRow(firstRow + row, 'highlight', 'highlight-over', decorations);
        for (_l = 0, _len3 = highlightDecorations.length; _l < _len3; _l++) {
          decoration = highlightDecorations[_l];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
      }
      return context.fill();
    };

    CanvasDrawer.prototype.drawToken = function(context, text, color, x, y, charWidth, charHeight) {
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

    CanvasDrawer.prototype.drawLineDecorations = function(context, decorations, y, canvasWidth, lineHeight) {
      var decoration, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        context.fillStyle = this.getDecorationColor(decoration);
        _results.push(context.fillRect(0, y, canvasWidth, lineHeight));
      }
      return _results;
    };

    CanvasDrawer.prototype.drawHighlightDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
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

    CanvasDrawer.prototype.copyBitmapPart = function(context, bitmapCanvas, srcRow, destRow, rowCount) {
      var lineHeight;
      lineHeight = this.minimap.getLineHeight() * this.devicePixelRatio;
      return context.drawImage(bitmapCanvas, 0, srcRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight, 0, destRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight);
    };


    /* Internal */

    CanvasDrawer.prototype.fillGapsBetweenIntactRanges = function(context, intactRanges, firstRow, lastRow) {
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

    CanvasDrawer.prototype.computeIntactRanges = function(firstRow, lastRow) {
      var change, intactRange, intactRanges, newIntactRanges, range, _i, _j, _len, _len1, _ref;
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
      _ref = this.pendingChanges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        change = _ref[_i];
        newIntactRanges = [];
        for (_j = 0, _len1 = intactRanges.length; _j < _len1; _j++) {
          range = intactRanges[_j];
          if (isNaN(change.screenDelta)) {
            change.screenDelta = change.end - change.start;
          }
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

    CanvasDrawer.prototype.truncateIntactRanges = function(intactRanges, firstRow, lastRow) {
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

    return CanvasDrawer;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwyQkFBQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBbkIsQ0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLDJCQUFSLEdBQXNDLEtBRnRDLENBQUE7O1FBR0EsSUFBQyxDQUFBLGlCQUFrQjtPQUhuQjtBQUFBLE1BS0EsSUFBQyxDQUFBLGVBQUQsR0FBbUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FMbkIsQ0FBQTthQU1BLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsZUFBZSxDQUFDLFVBQWpCLENBQTRCLElBQTVCLEVBUEo7SUFBQSxDQUFsQixDQUFBOztBQUFBLDJCQVNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLGlEQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyx3QkFBVCxDQUFBLENBQVgsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsdUJBQVQsQ0FBQSxDQURWLENBQUE7QUFBQSxNQUVBLFlBQUEsR0FBZSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsUUFBckIsRUFBK0IsT0FBL0IsQ0FGZixDQUFBO0FB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/canvas-drawer.coffee