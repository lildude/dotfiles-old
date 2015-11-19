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
        return [this.sortableRangeForEntireBuffer()];
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
      endCol = this.editor.lineLengthForBufferRow(endRow);
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return RangeFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixJQUFBLFdBQUMsQ0FBQSxTQUFELEdBQVksU0FBQyxNQUFELEdBQUE7YUFDTixJQUFBLFdBQUEsQ0FBWSxNQUFaLENBQW1CLENBQUMsTUFBcEIsQ0FBQSxFQURNO0lBQUEsQ0FBWixDQUFBOztBQUlhLElBQUEscUJBQUUsTUFBRixHQUFBO0FBQVcsTUFBVixJQUFDLENBQUEsU0FBQSxNQUFTLENBQVg7SUFBQSxDQUpiOztBQUFBLDBCQU9BLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLGVBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFsQixDQUFBO0FBQ0EsTUFBQSxJQUFHLGVBQWUsQ0FBQyxNQUFoQixLQUEwQixDQUE3QjtlQUNFLENBQUMsSUFBQyxDQUFBLDRCQUFELENBQUEsQ0FBRCxFQURGO09BQUEsTUFBQTtlQUdFLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsY0FBRCxHQUFBO21CQUNsQixLQUFDLENBQUEsaUJBQUQsQ0FBbUIsY0FBbkIsRUFEa0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixFQUhGO09BRk07SUFBQSxDQVBSLENBQUE7O0FBQUEsMEJBZ0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO2FBQ2YsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQWlDLENBQUMsTUFBbEMsQ0FBeUMsU0FBQyxLQUFELEdBQUE7ZUFDdkMsQ0FBQSxLQUFTLENBQUMsT0FBTixDQUFBLEVBRG1DO01BQUEsQ0FBekMsRUFEZTtJQUFBLENBaEJqQixDQUFBOztBQUFBLDBCQXFCQSw0QkFBQSxHQUE4QixTQUFBLEdBQUE7YUFDNUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxRQUFwQixDQUFBLEVBRDRCO0lBQUEsQ0FyQjlCLENBQUE7O0FBQUEsMEJBeUJBLGlCQUFBLEdBQW1CLFNBQUMsY0FBRCxHQUFBO0FBQ2pCLFVBQUEsa0NBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQWhDLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxDQURYLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBWSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQW5CLEtBQTZCLENBQWhDLEdBQ1AsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFuQixHQUF5QixDQURsQixHQUdQLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FMckIsQ0FBQTtBQUFBLE1BTUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsTUFBL0IsQ0FOVCxDQUFBO2FBUUksSUFBQSxLQUFBLENBQU0sQ0FBQyxRQUFELEVBQVcsUUFBWCxDQUFOLEVBQTRCLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBNUIsRUFUYTtJQUFBLENBekJuQixDQUFBOzt1QkFBQTs7TUFMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/sort-lines/lib/range-finder.coffee