(function() {
  var Disposable;

  Disposable = require('atom').Disposable;

  module.exports = {
    instance: null,
    config: {
      lintOnFly: {
        title: 'Lint on fly',
        description: 'Lint files while typing, without the need to save them',
        type: 'boolean',
        "default": true,
        order: 1
      },
      ignoredMessageTypes: {
        title: 'Ignored message Types',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 2
      },
      showErrorInline: {
        title: 'Show Inline Tooltips',
        description: 'Show inline tooltips for errors',
        type: 'boolean',
        "default": true,
        order: 3
      },
      gutterEnabled: {
        title: 'Highlight error lines in gutter',
        type: 'boolean',
        "default": true,
        order: 3
      },
      gutterPosition: {
        title: 'Position of gutter highlights',
        "enum": ['Left', 'Right'],
        "default": 'Right',
        order: 3,
        type: 'string'
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showProviderName: {
        title: 'Show Provider Name (when available)',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showErrorPanel: {
        title: 'Show Error Panel at the Bottom',
        description: 'Show the list of errors in a bottom panel',
        type: 'boolean',
        "default": true,
        order: 4
      },
      errorPanelHeight: {
        title: 'Error Panel Height',
        description: 'The error panel height in pixels',
        type: 'number',
        "default": 150,
        order: 4
      },
      alwaysTakeMinimumSpace: {
        title: 'Always Take Minimum Space',
        description: 'Resize the error panel smaller than the height where possible',
        type: 'boolean',
        "default": true,
        order: 4
      },
      displayLinterInfo: {
        title: 'Display Linter Info in Status Bar',
        description: 'Whether to show any linter information in the status bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabLine: {
        title: 'Show Line tab in Status Bar',
        type: 'boolean',
        "default": false,
        order: 5
      },
      showErrorTabFile: {
        title: 'Show File tab in Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabProject: {
        title: 'Show Project tab in Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      statusIconScope: {
        title: 'Scope of messages to show in status icon',
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project',
        order: 5
      },
      statusIconPosition: {
        title: 'Position of Status Icon in Status Bar',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left',
        order: 5
      }
    },
    activate: function(state) {
      var LinterPlus;
      this.state = state;
      LinterPlus = require('./linter.coffee');
      return this.instance = new LinterPlus(state);
    },
    serialize: function() {
      return this.state;
    },
    consumeLinter: function(linters) {
      var linter, _i, _len;
      if (!(linters instanceof Array)) {
        linters = [linters];
      }
      for (_i = 0, _len = linters.length; _i < _len; _i++) {
        linter = linters[_i];
        this.instance.addLinter(linter);
      }
      return new Disposable((function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = linters.length; _j < _len1; _j++) {
            linter = linters[_j];
            _results.push(_this.instance.deleteLinter(linter));
          }
          return _results;
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.instance.views.attachBottom(statusBar);
    },
    provideLinter: function() {
      return this.instance;
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxJQUFWO0FBQUEsSUFDQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx3REFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURGO0FBQUEsTUFPQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sdUJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLFFBR0EsS0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQUpGO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQVJGO0FBQUEsTUFlQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLGlDQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BaEJGO0FBQUEsTUFxQkEsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8saUNBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtBQUFBLFFBR0EsS0FBQSxFQUFP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

//# sourceURL=/Users/lildude/.atom/packages/linter/lib/main.coffee
