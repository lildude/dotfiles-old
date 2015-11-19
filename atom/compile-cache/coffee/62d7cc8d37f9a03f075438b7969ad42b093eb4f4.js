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
          editor = atom.workspace.getActiveTextEditor();
          return prettify(editor);
        },
        'pretty-json:sort-and-prettify': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return prettify(editor, true);
        }
      });
    }
  };

}).call(this);
