(function() {
  var inputCfg, os;

  os = require('os');

  inputCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          key: 'altKey',
          mouse: 1,
          middleMouse: true
        };
      case 'darwin':
        return {
          key: 'altKey',
          mouse: 1,
          middleMouse: true
        };
      case 'linux':
        return {
          key: 'shiftKey',
          mouse: 2,
          middleMouse: false
        };
      default:
        return {
          key: 'shiftKey',
          mouse: 2,
          middleMouse: true
        };
    }
  })();

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this._handleLoad(editor);
        };
      })(this));
    },
    deactivate: function() {
      return this.unsubscribe();
    },
    _handleLoad: function(editor) {
      var editorBuffer, editorComponent, editorElement, hikackMouseEvent, mouseEnd, mouseStart, onBlur, onMouseDown, onMouseMove, resetState, selectBoxAroundCursors, _screenPositionForMouseEvent;
      editorBuffer = editor.displayBuffer;
      editorElement = atom.views.getView(editor);
      editorComponent = editorElement.component;
      mouseStart = null;
      mouseEnd = null;
      resetState = (function(_this) {
        return function() {
          mouseStart = null;
          return mouseEnd = null;
        };
      })(this);
      onMouseDown = (function(_this) {
        return function(e) {
          if (mouseStart) {
            e.preventDefault();
            return false;
          }
          if ((inputCfg.middleMouse && e.which === 2) || (e.which === inputCfg.mouse && e[inputCfg.key])) {
            resetState();
            mouseStart = _screenPositionForMouseEvent(e);
            mouseEnd = mouseStart;
            e.preventDefault();
            return false;
          }
        };
      })(this);
      onMouseMove = (function(_this) {
        return function(e) {
          if (mouseStart) {
            if ((inputCfg.middleMouse && e.which === 2) || (e.which === inputCfg.mouse)) {
              mouseEnd = _screenPositionForMouseEvent(e);
              selectBoxAroundCursors();
              e.preventDefault();
              return false;
            }
            if (e.which === 0) {
              return resetState();
            }
          }
        };
      })(this);
      hikackMouseEvent = (function(_this) {
        return function(e) {
          if (mouseStart) {
            e.preventDefault();
            return false;
          }
        };
      })(this);
      onBlur = (function(_this) {
        return function(e) {
          return resetState();
        };
      })(this);
      _screenPositionForMouseEvent = (function(_this) {
        return function(e) {
          var column, defaultCharWidth, pixelPosition, row, targetLeft, targetTop;
          pixelPosition = editorComponent.pixelPositionForMouseEvent(e);
          targetTop = pixelPosition.top;
          targetLeft = pixelPosition.left;
          defaultCharWidth = editorBuffer.defaultCharWidth;
          row = Math.floor(targetTop / editorBuffer.getLineHeightInPixels());
          if (row > editorBuffer.getLastRow()) {
            targetLeft = Infinity;
          }
          row = Math.min(row, editorBuffer.getLastRow());
          row = Math.max(0, row);
          column = Math.round(targetLeft / defaultCharWidth);
          return {
            row: row,
            column: column
          };
        };
      })(this);
      selectBoxAroundCursors = (function(_this) {
        return function() {
          var allRanges, range, rangesWithLength, row, _i, _ref, _ref1;
          if (mouseStart && mouseEnd) {
            allRanges = [];
            rangesWithLength = [];
            for (row = _i = _ref = mouseStart.row, _ref1 = mouseEnd.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
              range = editor.bufferRangeForScreenRange([[row, mouseStart.column], [row, mouseEnd.column]]);
              allRanges.push(range);
              if (editor.getTextInBufferRange(range).length > 0) {
                rangesWithLength.push(range);
              }
            }
            if (rangesWithLength.length) {
              return editor.setSelectedBufferRanges(rangesWithLength);
            } else if (allRanges.length) {
              return editor.setSelectedBufferRanges(allRanges);
            }
          }
        };
      })(this);
      editorElement.onmousedown = onMouseDown;
      editorElement.onmousemove = onMouseMove;
      editorElement.onmouseup = hikackMouseEvent;
      editorElement.onmouseleave = hikackMouseEvent;
      editorElement.onmouseenter = hikackMouseEvent;
      editorElement.oncontextmenu = hikackMouseEvent;
      return editorElement.onblur = onBlur;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsUUFBQTtBQUFXLFlBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFQO0FBQUEsV0FDSixPQURJO2VBRVA7QUFBQSxVQUFBLEdBQUEsRUFBSyxRQUFMO0FBQUEsVUFDQSxLQUFBLEVBQU8sQ0FEUDtBQUFBLFVBRUEsV0FBQSxFQUFhLElBRmI7VUFGTztBQUFBLFdBS0osUUFMSTtlQU1QO0FBQUEsVUFBQSxHQUFBLEVBQUssUUFBTDtBQUFBLFVBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxVQUVBLFdBQUEsRUFBYSxJQUZiO1VBTk87QUFBQSxXQVNKLE9BVEk7ZUFVUDtBQUFBLFVBQUEsR0FBQSxFQUFLLFVBQUw7QUFBQSxVQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsVUFFQSxXQUFBLEVBQWEsS0FGYjtVQVZPO0FBQUE7ZUFjUDtBQUFBLFVBQUEsR0FBQSxFQUFLLFVBQUw7QUFBQSxVQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsVUFFQSxXQUFBLEVBQWEsSUFGYjtVQWRPO0FBQUE7TUFGWCxDQUFBOztBQUFBLEVBb0JBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNoQyxLQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFEZ0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxFQURRO0lBQUEsQ0FBVjtBQUFBLElBSUEsVUFBQSxFQUFZLFNBQUEsR0FBQTth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
//# sourceURL=/Users/lildude/.atom/packages/Sublime-Style-Column-Selection/lib/sublime-select.coffee