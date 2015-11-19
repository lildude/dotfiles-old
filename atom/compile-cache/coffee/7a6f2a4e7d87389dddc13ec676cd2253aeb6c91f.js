(function() {
  var insertAfterCurrentParagraph, insertAtEndOfArticle, utils, _findFirstEmptyRow, _findFirstNonEmptyRowBackwards, _isReferenceLink;

  utils = require("./utils");

  insertAtEndOfArticle = function(editor, text) {
    var point, position, row;
    position = editor.getCursorBufferPosition();
    row = _findFirstNonEmptyRowBackwards(editor, editor.getLastBufferRow());
    point = [row, editor.lineLengthForBufferRow(row)];
    if (_isReferenceLink(editor, row)) {
      editor.setTextInBufferRange([point, point], "\n" + text);
    } else {
      editor.setTextInBufferRange([point, point], "\n\n" + text);
    }
    return editor.setCursorBufferPosition(position);
  };

  _findFirstNonEmptyRowBackwards = function(editor, row) {
    while (row >= 0 && editor.lineLengthForBufferRow(row) === 0) {
      row--;
    }
    return row;
  };

  insertAfterCurrentParagraph = function(editor, text) {
    var point, position, row;
    position = editor.getCursorBufferPosition();
    row = _findFirstEmptyRow(editor, position.row + 1);
    point = [row, editor.lineLengthForBufferRow(row)];
    if (_isReferenceLink(editor, row)) {
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
    while (row <= lastRow && editor.lineLengthForBufferRow(row) !== 0) {
      row++;
    }
    if (row > lastRow) {
      return lastRow;
    }
    while (row < lastRow && _isReferenceLink(editor, row + 1)) {
      row++;
    }
    return row;
  };

  _isReferenceLink = function(editor, row) {
    var line;
    line = editor.lineTextForBufferRow(row);
    return utils.isReferenceDefinition(line);
  };

  module.exports = {
    insertAfterCurrentParagraph: insertAfterCurrentParagraph,
    insertAtEndOfArticle: insertAtEndOfArticle
  };

}).call(this);
