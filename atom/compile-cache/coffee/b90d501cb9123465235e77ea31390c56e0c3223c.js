(function() {
  var formatter, prettify, stringify;

  stringify = require("json-stable-stringify");

  prettify = function(editor, sorted) {
    var text, wholeFile;
    wholeFile = editor.getGrammar().name === 'JSON';
    if (wholeFile) {
      text = editor.getText();
      return editor.setText(formatter(text, sorted));
    } else {
      return text = editor.replaceSelectedText({}, function(text) {
        return formatter(text, sorted);
      });
    }
  };

  formatter = function(text, sorted) {
    var editorSettings, error, parsed, space;
    editorSettings = atom.config.get('editor');
    if (editorSettings.softTabs != null) {
      space = Array(editorSettings.tabLength + 1).join(" ");
    } else {
      space = "\t";
    }
    try {
      parsed = JSON.parse(text);
      if (sorted) {
        return stringify(parsed, {
          space: space
        });
      } else {
        return JSON.stringify(parsed, null, space);
      }
    } catch (_error) {
      error = _error;
      return text;
    }
  };

  module.exports = {
    activate: function() {
      return atom.commands.add('atom-workspace', {
        'pretty-json:prettify': function() {
          var editor;
          editor = atom.workspace.getActiveEditor();
          return prettify(editor);
        },
        'pretty-json:sort-and-prettify': function() {
          var editor;
          editor = atom.workspace.getActiveEditor();
          return prettify(editor, true);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSx1QkFBUixDQUFaLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ1QsUUFBQSxlQUFBO0FBQUEsSUFBQSxTQUFBLEdBQVksTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLElBQXBCLEtBQTRCLE1BQXhDLENBQUE7QUFFQSxJQUFBLElBQUcsU0FBSDtBQUNFLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUFBO2FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFBLENBQVUsSUFBVixFQUFnQixNQUFoQixDQUFmLEVBRkY7S0FBQSxNQUFBO2FBSUUsSUFBQSxHQUFPLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixFQUEzQixFQUErQixTQUFDLElBQUQsR0FBQTtlQUNwQyxTQUFBLENBQVUsSUFBVixFQUFnQixNQUFoQixFQURvQztNQUFBLENBQS9CLEVBSlQ7S0FIUztFQUFBLENBRlgsQ0FBQTs7QUFBQSxFQWFBLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7QUFDVixRQUFBLG9DQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixRQUFoQixDQUFqQixDQUFBO0FBQ0EsSUFBQSxJQUFHLCtCQUFIO0FBQ0UsTUFBQSxLQUFBLEdBQVEsS0FBQSxDQUFNLGNBQWMsQ0FBQyxTQUFmLEdBQTJCLENBQWpDLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsR0FBekMsQ0FBUixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsS0FBQSxHQUFRLElBQVIsQ0FIRjtLQURBO0FBTUE7QUFDRSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFHLE1BQUg7QUFDRSxlQUFPLFNBQUEsQ0FBVSxNQUFWLEVBQWtCO0FBQUEsVUFBRSxLQUFBLEVBQU8sS0FBVDtTQUFsQixDQUFQLENBREY7T0FBQSxNQUFBO0FBR0UsZUFBTyxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsRUFBdUIsSUFBdkIsRUFBNkIsS0FBN0IsQ0FBUCxDQUhGO09BRkY7S0FBQSxjQUFBO0FBT0UsTUFESSxjQUNKLENBQUE7YUFBQSxLQVBGO0tBUFU7RUFBQSxDQWJaLENBQUE7O0FBQUEsRUE2QkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsc0JBQUEsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLGNBQUEsTUFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxRQUFBLENBQVMsTUFBVCxFQUZzQjtRQUFBLENBQXhCO0FBQUEsUUFHQSwrQkFBQSxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBVCxDQUFBO2lCQUNBLFFBQUEsQ0FBUyxNQUFULEVBQWlCLElBQWpCLEVBRitCO1FBQUEsQ0FIakM7T0FERixFQURRO0lBQUEsQ0FBVjtHQTlCRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/pretty-json/index.coffee