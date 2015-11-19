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
    var escapedQuoteRegex, newText, oppositeQuoteCharacter, oppositeQuoteRegex, prefix, quoteCharacter, quoteRegex, range, text;
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
    prefix = '';
    if (/[uUr]/.test(quoteCharacter)) {
      prefix = text[0], quoteCharacter = text[1];
    }
    oppositeQuoteCharacter = getOppositeQuote(quoteCharacter);
    quoteRegex = new RegExp(quoteCharacter, 'g');
    escapedQuoteRegex = new RegExp("\\\\" + quoteCharacter, 'g');
    oppositeQuoteRegex = new RegExp(oppositeQuoteCharacter, 'g');
    newText = text.replace(oppositeQuoteRegex, "\\" + oppositeQuoteCharacter).replace(escapedQuoteRegex, quoteCharacter);
    newText = prefix + oppositeQuoteCharacter + newText.slice(1 + prefix.length, -1) + oppositeQuoteCharacter;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLFNBQUMsTUFBRCxHQUFBO1dBQ2IsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSwwQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQVgsQ0FBQTtBQUFBLFFBQ0EscUJBQUEsQ0FBc0IsTUFBdEIsRUFBOEIsUUFBOUIsQ0FEQSxDQUFBO0FBQUEsc0JBRUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLFFBQXpCLEVBRkEsQ0FERjtBQUFBO3NCQURjO0lBQUEsQ0FBaEIsRUFEYTtFQUFBLENBQWYsQ0FBQTs7QUFBQSxFQU9BLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUN0QixRQUFBLHVIQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyw2QkFBckIsQ0FBbUQsZ0JBQW5ELEVBQXFFLFFBQXJFLENBQVIsQ0FBQTtBQUVBLElBQUEsSUFBTyxhQUFQO0FBSUUsTUFBQSxJQUFHLEtBQUEsR0FBUSxNQUFNLENBQUMsYUFBYSxDQUFDLDZCQUFyQixDQUFtRCxrQkFBbkQsRUFBdUUsUUFBdkUsQ0FBWDtBQUNFLFFBQUEsSUFBQSxDQUFBLGVBQTZCLENBQUMsSUFBaEIsQ0FBcUIsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLENBQXJCLENBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBREY7T0FKRjtLQUZBO0FBU0EsSUFBQSxJQUFjLGFBQWQ7QUFBQSxZQUFBLENBQUE7S0FUQTtBQUFBLElBV0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQVhQLENBQUE7QUFBQSxJQVlDLGlCQUFrQixPQVpuQixDQUFBO0FBQUEsSUFpQkEsTUFBQSxHQUFTLEVBakJULENBQUE7QUFrQkEsSUFBQSxJQUFtQyxPQUFPLENBQUMsSUFBUixDQUFhLGNBQWIsQ0FBbkM7QUFBQSxNQUFDLGdCQUFELEVBQVMsd0JBQVQsQ0FBQTtLQWxCQTtBQUFBLElBb0JBLHNCQUFBLEdBQXlCLGdCQUFBLENBQWlCLGNBQWpCLENBcEJ6QixDQUFBO0FBQUEsSUFxQkEsVUFBQSxHQUFpQixJQUFBLE1BQUEsQ0FBTyxjQUFQLEVBQXVCLEdBQXZCLENBckJqQixDQUFBO0FBQUEsSUFzQkEsaUJBQUEsR0FBd0IsSUFBQSxNQUFBLENBQVEsTUFBQSxHQUFLLGNBQWIsRUFBZ0MsR0FBaEMsQ0F0QnhCLENBQUE7QUFBQSxJQXVCQSxrQkFBQSxHQUF5QixJQUFBLE1BQUEsQ0FBTyxzQkFBUCxFQUErQixHQUEvQixDQXZCekIsQ0FBQTtBQUFBLElBeUJBLE9BQUEsR0FBVSxJQUNSLENBQUMsT0FETyxDQUNDLGtCQURELEVBQ3NCLElBQUEsR0FBRyxzQkFEekIsQ0FFUixDQUFDLE9BRk8sQ0FFQyxpQkFGRCxFQUVvQixjQUZwQixDQXpCVixDQUFBO0FBQUEsSUE0QkEsT0FBQSxHQUFVLE1BQUEsR0FBUyxzQkFBVCxHQUFrQyxPQUFRLDZCQUExQyxHQUFvRSxzQkE1QjlFLENBQUE7V0E4QkEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLEVBQW1DLE9BQW5DLEVBL0JzQjtFQUFBLENBUHhCLENBQUE7O0FBQUEsRUF3Q0EsZ0JBQUEsR0FBbUIsU0FBQyxjQUFELEdBQUE7QUFDakIsSUFBQSxJQUFHLGNBQUEsS0FBa0IsR0FBckI7YUFDRSxJQURGO0tBQUEsTUFBQTthQUdFLElBSEY7S0FEaUI7RUFBQSxDQXhDbkIsQ0FBQTs7QUFBQSxFQThDQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixzQkFBM0IsRUFBbUQsU0FBbkQsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQVQsQ0FBQTtlQUNBLFlBQUEsQ0FBYSxNQUFiLEVBRjREO01BQUEsQ0FBOUQsRUFEUTtJQUFBLENBQVY7QUFBQSxJQUtBLFlBQUEsRUFBYyxZQUxkO0dBL0NGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/toggle-quotes/lib/toggle-quotes.coffee