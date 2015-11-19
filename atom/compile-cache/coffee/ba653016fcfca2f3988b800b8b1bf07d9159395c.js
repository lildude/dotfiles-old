(function() {
  var RangeFinder, sortLines, sortLinesReversed;

  RangeFinder = require('./range-finder');

  module.exports = {
    activate: function() {
      atom.workspaceView.command('sort-lines:sort', '.editor', function() {
        var editor;
        editor = atom.workspaceView.getActivePaneItem();
        return sortLines(editor);
      });
      return atom.workspaceView.command('sort-lines:reverse-sort', '.editor', function() {
        var editor;
        editor = atom.workspaceView.getActivePaneItem();
        return sortLinesReversed(editor);
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGlCQUEzQixFQUE4QyxTQUE5QyxFQUF5RCxTQUFBLEdBQUE7QUFDdkQsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBbkIsQ0FBQSxDQUFULENBQUE7ZUFDQSxTQUFBLENBQVUsTUFBVixFQUZ1RDtNQUFBLENBQXpELENBQUEsQ0FBQTthQUlBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIseUJBQTNCLEVBQXNELFNBQXRELEVBQWlFLFNBQUEsR0FBQTtBQUMvRCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFuQixDQUFBLENBQVQsQ0FBQTtlQUNBLGlCQUFBLENBQWtCLE1BQWxCLEVBRitEO01BQUEsQ0FBakUsRUFMUTtJQUFBLENBQVY7R0FIRixDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUFZLFNBQUMsTUFBRCxHQUFBO0FBQ1YsUUFBQSxjQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQWpCLENBQUE7V0FDQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLEtBQUQsR0FBQTtBQUNyQixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsQ0FBa0MsQ0FBQyxLQUFuQyxDQUF5QyxJQUF6QyxDQUFaLENBQUE7QUFBQSxNQUNBLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2VBQVUsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsQ0FBaEIsRUFBVjtNQUFBLENBQWYsQ0FEQSxDQUFBO2FBRUEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLEVBQW1DLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixDQUFuQyxFQUhxQjtJQUFBLENBQXZCLEVBRlU7RUFBQSxDQVpaLENBQUE7O0FBQUEsRUFtQkEsaUJBQUEsR0FBb0IsU0FBQyxNQUFELEdBQUE7QUFDbEIsUUFBQSxjQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQWpCLENBQUE7V0FDQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLEtBQUQsR0FBQTtBQUNyQixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsQ0FBa0MsQ0FBQyxLQUFuQyxDQUF5QyxJQUF6QyxDQUFaLENBQUE7QUFBQSxNQUNBLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2VBQVUsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsQ0FBaEIsRUFBVjtNQUFBLENBQWYsQ0FEQSxDQUFBO2FBRUEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLEVBQW1DLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixDQUFuQyxFQUhxQjtJQUFBLENBQXZCLEVBRmtCO0VBQUEsQ0FuQnBCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/sort-lines/lib/sort-lines.coffee