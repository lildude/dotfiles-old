(function() {
  var toggleQuotes;

  toggleQuotes = require('./toggle-quotes').toggleQuotes;

  module.exports = {
    config: {
      quoteCharacters: {
        type: 'string',
        "default": '"\''
      }
    },
    activate: function() {
      return this.subscription = atom.commands.add('atom-text-editor', 'toggle-quotes:toggle', function() {
        var editor;
        if (editor = atom.workspace.getActiveTextEditor()) {
          return toggleQuotes(editor);
        }
      });
    },
    deactivate: function() {
      return this.subscription.dispose();
    }
  };

}).call(this);
