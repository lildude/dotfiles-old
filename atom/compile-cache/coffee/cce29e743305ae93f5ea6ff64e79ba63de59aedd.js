(function() {
  var Range, RangeFinder;

  Range = require('atom').Range;

  module.exports = RangeFinder = (function() {
    RangeFinder.rangesFor = function(editor) {
      return new RangeFinder(editor).ranges();
    };

    function RangeFinder(editor) {
      this.editor = editor;
    }

    RangeFinder.prototype.ranges = function() {
      var selectionRanges;
      selectionRanges = this.selectionRanges();
      if (selectionRanges.length === 0) {
        return [this.sortableRangeFrom(this.sortableRangeForEntireBuffer())];
      } else {
        return selectionRanges.map((function(_this) {
          return function(selectionRange) {
            return _this.sortableRangeFrom(selectionRange);
          };
        })(this));
      }
    };

    RangeFinder.prototype.selectionRanges = function() {
      return this.editor.getSelectedBufferRanges().filter(function(range) {
        return !range.isEmpty();
      });
    };

    RangeFinder.prototype.sortableRangeForEntireBuffer = function() {
      return this.editor.getBuffer().getRange();
    };

    RangeFinder.prototype.sortableRangeFrom = function(selectionRange) {
      var endCol, endRow, startCol, startRow;
      startRow = selectionRange.start.row;
      startCol = 0;
      endRow = selectionRange.end.column === 0 ? selectionRange.end.row - 1 : selectionRange.end.row;
      endCol = this.editor.lineTextForBufferRow(endRow).length;
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return RangeFinder;

  })();

}).call(this);
