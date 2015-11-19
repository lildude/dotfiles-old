(function() {
  var RangeFinder, sortLines, sortLinesInsensitive, sortLinesReversed, sortTextLines, uniqueLines;

  RangeFinder = require('./range-finder');

  module.exports = {
    activate: function() {
      return atom.commands.add('atom-text-editor:not([mini])', {
        'sort-lines:sort': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return sortLines(editor);
        },
        'sort-lines:reverse-sort': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return sortLinesReversed(editor);
        },
        'sort-lines:unique': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return uniqueLines(editor);
        },
        'sort-lines:case-insensitive-sort': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return sortLinesInsensitive(editor);
        }
      });
    }
  };

  sortTextLines = function(editor, sorter) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var textLines;
      textLines = editor.getTextInBufferRange(range).split("\n");
      textLines = sorter(textLines);
      return editor.setTextInBufferRange(range, textLines.join("\n"));
    });
  };

  sortLines = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(function(a, b) {
        return a.localeCompare(b);
      });
    });
  };

  sortLinesReversed = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(function(a, b) {
        return b.localeCompare(a);
      });
    });
  };

  uniqueLines = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });
    });
  };

  sortLinesInsensitive = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvc29ydC1saW5lcy9saWIvc29ydC1saW5lcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkZBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsOEJBQWxCLEVBQ0U7QUFBQSxRQUFBLGlCQUFBLEVBQW1CLFNBQUEsR0FBQTtBQUNqQixjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO2lCQUNBLFNBQUEsQ0FBVSxNQUFWLEVBRmlCO1FBQUEsQ0FBbkI7QUFBQSxRQUdBLHlCQUFBLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO2lCQUNBLGlCQUFBLENBQWtCLE1BQWxCLEVBRnlCO1FBQUEsQ0FIM0I7QUFBQSxRQU1BLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO2lCQUNBLFdBQUEsQ0FBWSxNQUFaLEVBRm1CO1FBQUEsQ0FOckI7QUFBQSxRQVNBLGtDQUFBLEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO2lCQUNBLG9CQUFBLENBQXFCLE1BQXJCLEVBRmtDO1FBQUEsQ0FUcEM7T0FERixFQURRO0lBQUEsQ0FBVjtHQUhGLENBQUE7O0FBQUEsRUFrQkEsYUFBQSxHQUFnQixTQUFDLE1BQUQsRUFBUyxNQUFULEdBQUE7QUFDZCxRQUFBLGNBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsV0FBVyxDQUFDLFNBQVosQ0FBc0IsTUFBdEIsQ0FBakIsQ0FBQTtXQUNBLGNBQWMsQ0FBQyxPQUFmLENBQXVCLFNBQUMsS0FBRCxHQUFBO0FBQ3JCLFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQUFrQyxDQUFDLEtBQW5DLENBQXlDLElBQXpDLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLE1BQUEsQ0FBTyxTQUFQLENBRFosQ0FBQTthQUVBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxTQUFTLENBQUMsSUFBVixDQUFlLElBQWYsQ0FBbkMsRUFIcUI7SUFBQSxDQUF2QixFQUZjO0VBQUEsQ0FsQmhCLENBQUE7O0FBQUEsRUF5QkEsU0FBQSxHQUFZLFNBQUMsTUFBRCxHQUFBO1dBQ1YsYUFBQSxDQUFjLE1BQWQsRUFBc0IsU0FBQyxTQUFELEdBQUE7YUFDcEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7ZUFBVSxDQUFDLENBQUMsYUFBRixDQUFnQixDQUFoQixFQUFWO01BQUEsQ0FBZixFQURvQjtJQUFBLENBQXRCLEVBRFU7RUFBQSxDQXpCWixDQUFBOztBQUFBLEVBNkJBLGlCQUFBLEdBQW9CLFNBQUMsTUFBRCxHQUFBO1dBQ2xCLGFBQUEsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsU0FBRCxHQUFBO2FBQ3BCLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2VBQVUsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsQ0FBaEIsRUFBVjtNQUFBLENBQWYsRUFEb0I7SUFBQSxDQUF0QixFQURrQjtFQUFBLENBN0JwQixDQUFBOztBQUFBLEVBaUNBLFdBQUEsR0FBYyxTQUFDLE1BQUQsR0FBQTtXQUNaLGFBQUEsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsU0FBRCxHQUFBO2FBQ3BCLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxJQUFmLEdBQUE7ZUFBd0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLENBQUEsS0FBdUIsTUFBL0M7TUFBQSxDQUFqQixFQURvQjtJQUFBLENBQXRCLEVBRFk7RUFBQSxDQWpDZCxDQUFBOztBQUFBLEVBcUNBLG9CQUFBLEdBQXVCLFNBQUMsTUFBRCxHQUFBO1dBQ3JCLGFBQUEsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsU0FBRCxHQUFBO2FBQ3BCLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2VBQVUsQ0FBQyxDQUFDLFdBQUYsQ0FBQSxDQUFlLENBQUMsYUFBaEIsQ0FBOEIsQ0FBQyxDQUFDLFdBQUYsQ0FBQSxDQUE5QixFQUFWO01BQUEsQ0FBZixFQURvQjtJQUFBLENBQXRCLEVBRHFCO0VBQUEsQ0FyQ3ZCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/sort-lines/lib/sort-lines.coffee
