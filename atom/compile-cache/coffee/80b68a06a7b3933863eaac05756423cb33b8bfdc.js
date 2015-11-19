(function() {
  var formatter, minify, prettify, stringify, uglify;

  stringify = require("json-stable-stringify");

  uglify = require("jsonminify");

  formatter = {};

  prettify = function(editor, sorted) {
    var text, wholeFile;
    wholeFile = editor.getGrammar().name === 'JSON';
    if (wholeFile) {
      text = editor.getText();
      return editor.setText(formatter.pretty(text, sorted));
    } else {
      return text = editor.replaceSelectedText({}, function(text) {
        return formatter.pretty(text, sorted);
      });
    }
  };

  minify = function(editor, sorted) {
    var text, wholeFile;
    wholeFile = editor.getGrammar().name === 'JSON';
    if (wholeFile) {
      text = editor.getText();
      return editor.setText(formatter.minify(text));
    } else {
      return text = editor.replaceSelectedText({}, function(text) {
        return formatter.minify(text);
      });
    }
  };

  formatter.pretty = function(text, sorted) {
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

  formatter.minify = function(text) {
    var error;
    try {
      JSON.parse(text);
      return uglify(text);
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
        },
        'pretty-json:minify': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return minify(editor, true);
        }
      });
    }
  };

}).call(this);
