(function() {
  var _;

  _ = require('lodash');

  module.exports = {
    configDefaults: {
      source: {
        python: {
          editorSettings: {
            tabLength: 4
          },
          editorViewSettings: {
            showInvisibles: false,
            softWrap: false,
            showIndentGuide: false
          }
        },
        go: {
          editorSettings: {
            tabLength: 4,
            softTabs: false
          }
        }
      }
    },
    settingsAllowed: {
      'editorSettings': ['softTabs', 'softWrap', 'tabLength'],
      'editorViewSettings': ['fontFamily', 'fontSize', 'invisibles', 'placeholderText', 'showIndentGuide', 'showInvisibles', 'softWrap'],
      'gutterViewSettings': ['showLineNumbers']
    },
    buffers: [],
    activate: function(state) {
      atom.workspaceView.command("syntax-settings:reload", (function(_this) {
        return function() {
          return _this.reloadSettings();
        };
      })(this));
      return this.loadSettings();
    },
    reloadSettings: function() {
      this.buffers = [];
      return this.loadSettings();
    },
    loadSettings: function() {
      this.defaults = _.merge({}, this.defaultOverrides, atom.config.get('syntax-settings'));
      return atom.workspaceView.eachEditorView(_.bind(this._loadSettingsForEditorView, this));
    },
    _loadSettingsForEditorView: function(editorView) {
      var editor, grammar, languageSettings;
      editor = editorView.getEditor();
      grammar = editor.getGrammar();
      if (!_.contains(this.buffers, editor.buffer)) {
        this.buffers.push(editor.buffer);
        editor.buffer.on('saved', _.bind(function() {
          return this._loadSettingsForEditorView(editorView);
        }, this));
        editor.buffer.on('destroyed', function() {
          return editor.buffer.off();
        });
      }
      languageSettings = this._extractGrammarSettings(this.defaults, grammar);
      if (languageSettings) {
        return this._setSyntaxSettings(editorView, editor, languageSettings);
      }
    },
    _extractGrammarSettings: function(settings, grammar) {
      var p, path, value, _i, _len;
      path = grammar.scopeName.split('.');
      value = settings;
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        p = path[_i];
        if (value == null) {
          break;
        }
        value = value[p];
      }
      return value;
    },
    _setSyntaxSettings: function(editorView, editor, languageSettings) {
      this._loopAndSetSettings(editor, languageSettings, 'editorSettings');
      this._loopAndSetSettings(editorView, languageSettings, 'editorViewSettings');
      return this._loopAndSetSettings(editorView.gutter, languageSettings, 'gutterViewSettings');
    },
    _loopAndSetSettings: function(object, settings, name) {
      var attributeName, key, objectSettings, value, _results;
      objectSettings = settings[name];
      _results = [];
      for (key in objectSettings) {
        value = objectSettings[key];
        if (!_.contains(this.settingsAllowed[name], key)) {
          continue;
        }
        attributeName = this._formatAttribute(key);
        if (object[attributeName]) {
          _results.push(object[attributeName](value));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    _formatAttribute: function(key) {
      return 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLENBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLE1BQUEsRUFDRTtBQUFBLFVBQUEsY0FBQSxFQUNFO0FBQUEsWUFBQSxTQUFBLEVBQVcsQ0FBWDtXQURGO0FBQUEsVUFFQSxrQkFBQSxFQUNFO0FBQUEsWUFBQSxjQUFBLEVBQWdCLEtBQWhCO0FBQUEsWUFDQSxRQUFBLEVBQVUsS0FEVjtBQUFBLFlBRUEsZUFBQSxFQUFpQixLQUZqQjtXQUhGO1NBREY7QUFBQSxRQU9BLEVBQUEsRUFDRTtBQUFBLFVBQUEsY0FBQSxFQUNFO0FBQUEsWUFBQSxTQUFBLEVBQVcsQ0FBWDtBQUFBLFlBQ0EsUUFBQSxFQUFVLEtBRFY7V0FERjtTQVJGO09BREY7S0FERjtBQUFBLElBY0EsZUFBQSxFQUFpQjtBQUFBLE1BQ2YsZ0JBQUEsRUFBa0IsQ0FDaEIsVUFEZ0IsRUFDSixVQURJLEVBQ1EsV0FEUixDQURIO0FBQUEsTUFJZixvQkFBQSxFQUFzQixDQUNwQixZQURvQixFQUNOLFVBRE0sRUFDTSxZQUROLEVBQ29CLGlCQURwQixFQUVwQixpQkFGb0IsRUFFRCxnQkFGQyxFQUVpQixVQUZqQixDQUpQO0FBQUEsTUFRZixvQkFBQSxFQUFzQixDQUNwQixpQkFEb0IsQ0FSUDtLQWRqQjtBQUFBLElBMkJBLE9BQUEsRUFBUyxFQTNCVDtBQUFBLElBNkJBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQix3QkFBM0IsRUFBcUQsQ0FBQSxTQUFBLEtB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
//# sourceURL=/Users/lildude/.atom/packages/syntax-settings/lib/syntax-settings.coffee