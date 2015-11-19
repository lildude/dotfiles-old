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
      if (range = editor.displayBuffer.bufferRangeForScopeAtPosition('.invalid.illegal', position)) {
        if (!/^(".*"|'.*')$/.test(editor.getTextInBufferRange(range))) {
          return;
        }
      }
    }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLFNBQUMsTUFBRCxHQUFBO1dBQ2IsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSwwQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQVgsQ0FBQTtBQUFBLFFBQ0EscUJBQUEsQ0FBc0IsTUFBdEIsRUFBOEIsUUFBOUIsQ0FEQSxDQUFBO0FBQUEsc0JBRUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLFFBQXpCLEVBRkEsQ0FERjtBQUFBO3NCQURjO0lBQUEsQ0FBaEIsRUFEYTtFQUFBLENBQWYsQ0FBQTs7QUFBQSxFQU9BLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUN0QixRQUFBLCtHQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyw2QkFBckIsQ0FBbUQsZ0JBQW5ELEVBQXFFLFFBQXJFLENBQVIsQ0FBQTtBQUVBLElBQUEsSUFBTyxhQUFQO0FBSUUsTUFBQSxJQUFHLEtBQUEsR0FBUSxNQUFNLENBQUMsYUFBYSxDQUFDLDZCQUFyQixDQUFtRCxrQkFBbkQsRUFBdUUsUUFBdkUsQ0FBWDtBQUNFLFFBQUEsSUFBQSxDQUFBLGVBQTZCLENBQUMsSUFBaEIsQ0FBcUIsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLENBQXJCLENBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBREY7T0FKRjtLQUZBO0FBU0EsSUFBQSxJQUFjLGFBQWQ7QUFBQSxZQUFBLENBQUE7S0FUQTtBQUFBLElBV0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQVhQLENBQUE7QUFBQSxJQVlBLGNBQUEsR0FBaUIsSUFBSyxDQUFBLENBQUEsQ0FadEIsQ0FBQTtBQUFBLElBYUEsc0JBQUEsR0FBeUIsZ0JBQUEsQ0FBaUIsY0FBakIsQ0FiekIsQ0FBQTtBQUFBLElBY0EsVUFBQSxHQUFpQixJQUFBLE1BQUEsQ0FBTyxjQUFQLEVBQXVCLEdBQXZCLENBZGpCLENBQUE7QUFBQSxJQWVBLGlCQUFBLEdBQXdCLElBQUEsTUFBQSxDQUFRLE1BQUEsR0FBSyxjQUFiLEVBQWdDLEdBQWhDLENBZnhCLENBQUE7QUFBQSxJQWdCQSxrQkFBQSxHQUF5QixJQUFBLE1BQUEsQ0FBTyxzQkFBUCxFQUErQixHQUEvQixDQWhCekIsQ0FBQTtBQUFBLElBa0JBLE9BQUEsR0FBVSxJQUNSLENBQUMsT0FETyxDQUNDLGtCQURELEVBQ3NCLElBQUEsR0FBRyxzQkFEekIsQ0FFUixDQUFDLE9BRk8sQ0FFQyxpQkFGRCxFQUVvQixjQUZwQixDQWxCVixDQUFBO0FBQUEsSUFxQkEsT0FBQSxHQUFVLHNCQUFBLEdBQXlCLE9BQVEsYUFBakMsR0FBMkMsc0JBckJyRCxDQUFBO1dBdUJBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxPQUFuQyxFQXhCc0I7RUFBQSxDQVB4QixDQUFBOztBQUFBLEVBaUNBLGdCQUFBLEdBQW1CLFNBQUMsY0FBRCxHQUFBO0FBQ2pCLElBQUEsSUFBRyxjQUFBLEtBQWtCLEdBQXJCO2FBQ0UsSUFERjtLQUFBLE1BQUE7YUFHRSxJQUhGO0tBRGlCO0VBQUEsQ0FqQ25CLENBQUE7O0FBQUEsRUF1Q0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsc0JBQTNCLEVBQW1ELFNBQW5ELEVBQThELFNBQUEsR0FBQTtBQUM1RCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFULENBQUE7ZUFDQSxZQUFBLENBQWEsTUFBYixFQUY0RDtNQUFBLENBQTlELEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFLQSxZQUFBLEVBQWMsWUFMZDtHQXhDRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/toggle-quotes/lib/toggle-quotes.coffee