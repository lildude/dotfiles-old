(function() {
  var getNextQuoteCharacter, toggleQuoteAtPosition, toggleQuotes;

  toggleQuotes = function(editor) {
    return editor.transact(function() {
      var cursor, position, _i, _len, _ref, _results;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        position = cursor.getBufferPosition();
        toggleQuoteAtPosition(editor, position);
        _results.push(cursor.setBufferPosition(position));
      }
      return _results;
    });
  };

  toggleQuoteAtPosition = function(editor, position) {
    var escapedQuoteRegex, inner, newText, nextQuoteCharacter, nextQuoteRegex, prefix, quoteCharacter, quoteChars, quoteRegex, range, text;
    quoteChars = atom.config.get('toggle-quotes.quoteCharacters');
    range = editor.displayBuffer.bufferRangeForScopeAtPosition('.string.quoted', position);
    if (range == null) {
      if (range = editor.displayBuffer.bufferRangeForScopeAtPosition('.invalid.illegal', position)) {
        inner = quoteChars.split('').map(function(character) {
          return "" + character + ".*" + character;
        }).join('|');
        if (!RegExp("^(" + inner + ")$", "g").test(editor.getTextInBufferRange(range))) {
          return;
        }
      }
    }
    if (range == null) {
      return;
    }
    text = editor.getTextInBufferRange(range);
    quoteCharacter = text[0];
    prefix = '';
    if (/[uUr]/.test(quoteCharacter)) {
      prefix = text[0], quoteCharacter = text[1];
    }
    nextQuoteCharacter = getNextQuoteCharacter(quoteCharacter, quoteChars);
    if (!nextQuoteCharacter) {
      return;
    }
    quoteRegex = new RegExp(quoteCharacter, 'g');
    escapedQuoteRegex = new RegExp("\\\\" + quoteCharacter, 'g');
    nextQuoteRegex = new RegExp(nextQuoteCharacter, 'g');
    newText = text.replace(nextQuoteRegex, "\\" + nextQuoteCharacter).replace(escapedQuoteRegex, quoteCharacter);
    newText = prefix + nextQuoteCharacter + newText.slice(1 + prefix.length, -1) + nextQuoteCharacter;
    return editor.setTextInBufferRange(range, newText);
  };

  getNextQuoteCharacter = function(quoteCharacter, allQuoteCharacters) {
    var index;
    index = allQuoteCharacters.indexOf(quoteCharacter);
    if (index === -1) {
      return null;
    } else {
      return allQuoteCharacters[(index + 1) % allQuoteCharacters.length];
    }
  };

  module.exports = {
    config: {
      quoteCharacters: {
        type: 'string',
        "default": '"\''
      }
    },
    activate: function() {
      return atom.commands.add('atom-text-editor', 'toggle-quotes:toggle', function() {
        var editor;
        if (editor = atom.workspace.getActiveTextEditor()) {
          return toggleQuotes(editor);
        }
      });
    },
    toggleQuotes: toggleQuotes
  };

}).call(this);
