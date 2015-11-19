(function() {
  var insertAfterCurrentParagraph, insertAtEndOfArticle, removeDefinitionRange, utils, _findFirstEmptyRow, _findFirstNonEmptyRowBackwards, _isReferenceDefinition;

  utils = require("./utils");

  insertAtEndOfArticle = function(editor, text) {
    var point, position, row;
    position = editor.getCursorBufferPosition();
    row = _findFirstNonEmptyRowBackwards(editor, editor.getLastBufferRow());
    point = [row, editor.lineTextForBufferRow(row).length];
    if (_isReferenceDefinition(editor, row)) {
      editor.setTextInBufferRange([point, point], "\n" + text);
    } else {
      editor.setTextInBufferRange([point, point], "\n\n" + text);
    }
    return editor.setCursorBufferPosition(position);
  };

  _findFirstNonEmptyRowBackwards = function(editor, row) {
    while (row >= 0 && editor.lineTextForBufferRow(row).length === 0) {
      row--;
    }
    return row;
  };

  insertAfterCurrentParagraph = function(editor, text) {
    var point, position, row;
    position = editor.getCursorBufferPosition();
    row = _findFirstEmptyRow(editor, position.row + 1);
    point = [row, editor.lineTextForBufferRow(row).length];
    if (_isReferenceDefinition(editor, row)) {
      editor.setTextInBufferRange([point, point], "\n" + text);
    } else if (point[1] > 0) {
      editor.setTextInBufferRange([point, point], "\n\n" + text);
    } else {
      editor.setTextInBufferRange([point, point], "\n" + text + "\n");
    }
    return editor.setCursorBufferPosition(position);
  };

  _findFirstEmptyRow = function(editor, row) {
    var lastRow;
    lastRow = editor.getLastBufferRow();
    while (row <= lastRow && editor.lineTextForBufferRow(row).length !== 0) {
      row++;
    }
    if (row > lastRow) {
      return lastRow;
    }
    while (row < lastRow && _isReferenceDefinition(editor, row + 1)) {
      row++;
    }
    return row;
  };

  _isReferenceDefinition = function(editor, row) {
    var line;
    line = editor.lineTextForBufferRow(row);
    return utils.isReferenceDefinition(line);
  };

  removeDefinitionRange = function(editor, range) {
    var emptyLineAbove, emptyLineBelow, lineNum, _ref, _ref1;
    lineNum = range.start.row;
    emptyLineAbove = !!((_ref = editor.lineTextForBufferRow(lineNum - 1)) != null ? _ref.trim() : void 0);
    emptyLineBelow = !!((_ref1 = editor.lineTextForBufferRow(lineNum + 1)) != null ? _ref1.trim() : void 0);
    editor.setSelectedBufferRange(range);
    editor.deleteLine();
    if (emptyLineAbove && emptyLineBelow) {
      return editor.deleteLine();
    }
  };

  module.exports = {
    insertAtEndOfArticle: insertAtEndOfArticle,
    insertAfterCurrentParagraph: insertAfterCurrentParagraph,
    removeDefinitionRange: removeDefinitionRange
  };

}).call(this);
