(function() {
  var RangeFinder, sortLines, sortLinesReversed, uniqueLines;

  RangeFinder = require('./range-finder');

  module.exports = {
    activate: function() {
      atom.workspaceView.command('sort-lines:sort', '.editor', function() {
        var editor;
        editor = atom.workspace.getActiveEditor();
        return sortLines(editor);
      });
      atom.workspaceView.command('sort-lines:reverse-sort', '.editor', function() {
        var editor;
        editor = atom.workspace.getActiveEditor();
        return sortLinesReversed(editor);
      });
      return atom.workspaceView.command('sort-lines:unique', '.editor', function() {
        var editor;
        editor = atom.workspace.getActiveEditor();
        return uniqueLines(editor);
      });
    }
  };

  sortLines = function(editor) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var textLines;
      textLines = editor.getTextInBufferRange(range).split("\n");
      textLines.sort(function(a, b) {
        return a.localeCompare(b);
      });
      return editor.setTextInBufferRange(range, textLines.join("\n"));
    });
  };

  sortLinesReversed = function(editor) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var textLines;
      textLines = editor.getTextInBufferRange(range).split("\n");
      textLines.sort(function(a, b) {
        return b.localeCompare(a);
      });
      return editor.setTextInBufferRange(range, textLines.join("\n"));
    });
  };

  uniqueLines = function(editor) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var textLines, uniqued;
      textLines = editor.getTextInBufferRange(range).split("\n");
      uniqued = textLines.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });
      return editor.setTextInBufferRange(range, uniqued.join("\n"));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGlCQUEzQixFQUE4QyxTQUE5QyxFQUF5RCxTQUFBLEdBQUE7QUFDdkQsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBVCxDQUFBO2VBQ0EsU0FBQSxDQUFVLE1BQVYsRUFGdUQ7TUFBQSxDQUF6RCxDQUFBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIseUJBQTNCLEVBQXNELFNBQXRELEVBQWlFLFNBQUEsR0FBQTtBQUMvRCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFULENBQUE7ZUFDQSxpQkFBQSxDQUFrQixNQUFsQixFQUYrRDtNQUFBLENBQWpFLENBSkEsQ0FBQTthQVFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsbUJBQTNCLEVBQWdELFNBQWhELEVBQTJELFNBQUEsR0FBQTtBQUN6RCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFULENBQUE7ZUFDQSxXQUFBLENBQVksTUFBWixFQUZ5RDtNQUFBLENBQTNELEVBVFE7SUFBQSxDQUFWO0dBSEYsQ0FBQTs7QUFBQSxFQWdCQSxTQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixRQUFBLGNBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsV0FBVyxDQUFDLFNBQVosQ0FBc0IsTUFBdEIsQ0FBakIsQ0FBQTtXQUNBLGNBQWMsQ0FBQyxPQUFmLENBQXVCLFNBQUMsS0FBRCxHQUFBO0FBQ3JCLFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQUFrQyxDQUFDLEtBQW5DLENBQXlDLElBQXpDLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7ZUFBVSxDQUFDLENBQUMsYUFBRixDQUFnQixDQUFoQixFQUFWO01BQUEsQ0FBZixDQURBLENBQUE7YUFFQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsRUFBbUMsU0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFmLENBQW5DLEVBSHFCO0lBQUEsQ0FBdkIsRUFGVTtFQUFBLENBaEJaLENBQUE7O0FBQUEsRUF1QkEsaUJBQUEsR0FBb0IsU0FBQyxNQUFELEdBQUE7QUFDbEIsUUFBQSxjQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQWpCLENBQUE7V0FDQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLEtBQUQsR0FBQTtBQUNyQixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsQ0FBa0MsQ0FBQyxLQUFuQyxDQUF5QyxJQUF6QyxDQUFaLENBQUE7QUFBQSxNQUNBLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2VBQVUsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsQ0FBaEIsRUFBVjtNQUFBLENBQWYsQ0FEQSxDQUFBO2FBRUEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLEVBQW1DLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixDQUFuQyxFQUhxQjtJQUFBLENBQXZCLEVBRmtCO0VBQUEsQ0F2QnBCLENBQUE7O0FBQUEsRUE4QkEsV0FBQSxHQUFjLFNBQUMsTUFBRCxHQUFBO0FBQ1osUUFBQSxjQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQWpCLENBQUE7V0FDQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLEtBQUQsR0FBQTtBQUNyQixVQUFBLGtCQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLENBQWtDLENBQUMsS0FBbkMsQ0FBeUMsSUFBekMsQ0FBWixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLElBQWYsR0FBQTtlQUF3QixJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsQ0FBQSxLQUF1QixNQUEvQztNQUFBLENBQWpCLENBRFYsQ0FBQTthQUVBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FBbkMsRUFIcUI7SUFBQSxDQUF2QixFQUZZO0VBQUEsQ0E5QmQsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lildude/.atom/packages/sort-lines/lib/sort-lines.coffee