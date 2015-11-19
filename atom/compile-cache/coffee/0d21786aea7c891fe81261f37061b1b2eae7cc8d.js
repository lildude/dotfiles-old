(function() {
  var getOppositeQuote, toggleQuoteAtPosition, toggleQuotes;

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
    var escapedQuoteRegex, newText, oppositeQuoteCharacter, oppositeQuoteRegex, quoteCharacter, quoteRegex, range, text;
    range = editor.displayBuffer.bufferRangeForScopeAtPosition('.string.quoted', position);
    if (range == null) {
      return;
    }
    text = editor.getTextInBufferRange(range);
    quoteCharacter = text[0];
    oppositeQuoteCharacter = getOppositeQuote(quoteCharacter);
    quoteRegex = new RegExp(quoteCharacter, 'g');
    escapedQuoteRegex = new RegExp("\\\\" + quoteCharacter, 'g');
    oppositeQuoteRegex = new RegExp(oppositeQuoteCharacter, 'g');
    newText = text.replace(oppositeQuoteRegex, "\\" + oppositeQuoteCharacter).replace(escapedQuoteRegex, quoteCharacter);
    newText = oppositeQuoteCharacter + newText.slice(1, -1) + oppositeQuoteCharacter;
    return editor.setTextInBufferRange(range, newText);
  };

  getOppositeQuote = function(quoteCharacter) {
    if (quoteCharacter === '"') {
      return "'";
    } else {
      return '"';
    }
  };

  module.exports = {
    activate: function() {
      return atom.workspaceView.command('toggle-quotes:toggle', '.editor', function() {
        var editor;
        editor = atom.workspace.getActiveEditor();
        return toggleQuotes(editor);
      });
    },
    toggleQuotes: toggleQuotes
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLFNBQUMsTUFBRCxHQUFBO1dBQ2IsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSwwQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQVgsQ0FBQTtBQUFBLFFBQ0EscUJBQUEsQ0FBc0IsTUFBdEIsRUFBOEIsUUFBOUIsQ0FEQSxDQUFBO0FBQUEsc0JBRUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLFFBQXpCLEVBRkEsQ0FERjtBQUFBO3NCQURjO0lBQUEsQ0FBaEIsRUFEYTtFQUFBLENBQWYsQ0FBQTs7QUFBQSxFQU9BLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUN0QixRQUFBLCtHQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyw2QkFBckIsQ0FBbUQsZ0JBQW5ELEVBQXFFLFFBQXJFLENBQVIsQ0FBQTtBQUNBLElBQUEsSUFBYyxhQUFkO0FBQUEsWUFBQSxDQUFBO0tBREE7QUFBQSxJQUdBLElBQUEsR0FBTyxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsQ0FIUCxDQUFBO0FBQUEsSUFJQSxjQUFBLEdBQWlCLElBQUssQ0FBQSxDQUFBLENBSnRCLENBQUE7QUFBQSxJQUtBLHNCQUFBLEdBQXlCLGdCQUFBLENBQWlCLGNBQWpCLENBTHpCLENBQUE7QUFBQSxJQU1BLFVBQUEsR0FBaUIsSUFBQSxNQUFBLENBQU8sY0FBUCxFQUF1QixHQUF2QixDQU5qQixDQUFBO0FBQUEsSUFPQSxpQkFBQSxHQUF3QixJQUFBLE1BQUEsQ0FBUSxNQUFBLEdBQUssY0FBYixFQUFnQyxHQUFoQyxDQVB4QixDQUFBO0FBQUEsSUFRQSxrQkFBQSxHQUF5QixJQUFBLE1BQUEsQ0FBTyxzQkFBUCxFQUErQixHQUEvQixDQVJ6QixDQUFBO0FBQUEsSUFVQSxPQUFBLEdBQVUsSUFDUixDQUFDLE9BRE8sQ0FDQyxrQkFERCxFQUNzQixJQUFBLEdBQUcsc0JBRHpCLENBRVIsQ0FBQyxPQUZPLENBRUMsaUJBRkQsRUFFb0IsY0FGcEIsQ0FWVixDQUFBO0FBQUEsSUFhQSxPQUFBLEdBQVUsc0JBQUEsR0FBeUIsT0FBUSxhQUFqQyxHQUEyQyxzQkFickQsQ0FBQTtXQWVBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxPQUFuQyxFQWhCc0I7RUFBQSxDQVB4QixDQUFBOztBQUFBLEVBeUJBLGdCQUFBLEdBQW1CLFNBQUMsY0FBRCxHQUFBO0FBQ2pCLElBQUEsSUFBRyxjQUFBLEtBQWtCLEdBQXJCO2FBQ0UsSUFERjtLQUFBLE1BQUE7YUFHRSxJQUhGO0tBRGlCO0VBQUEsQ0F6Qm5CLENBQUE7O0FBQUEsRUErQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsc0JBQTNCLEVBQW1ELFNBQW5ELEVBQThELFNBQUEsR0FBQTtBQUM1RCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFULENBQUE7ZUFDQSxZQUFBLENBQWEsTUFBYixFQUY0RDtNQUFBLENBQTlELEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFLQSxZQUFBLEVBQWMsWUFMZDtHQWhDRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/toggle-quotes/lib/toggle-quotes.coffee