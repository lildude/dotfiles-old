(function() {
  var RangeFinder, sortLines, sortLinesInsensitive, sortLinesReversed, sortTextLines, uniqueLines;

  RangeFinder = require('./range-finder');

  module.exports = {
    activate: function() {
      return atom.commands.add('atom-text-editor', {
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
