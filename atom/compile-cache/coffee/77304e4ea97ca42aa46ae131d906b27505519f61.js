(function() {
  var CompositeDisposable, LinterInitializer;

  CompositeDisposable = require('atom').CompositeDisposable;

  LinterInitializer = (function() {
    function LinterInitializer() {}

    LinterInitializer.prototype.config = {
      lintOnSave: {
        type: 'boolean',
        "default": true
      },
      lintOnChange: {
        type: 'boolean',
        "default": true
      },
      clearOnChange: {
        type: 'boolean',
        "default": false
      },
      lintOnEditorFocus: {
        type: 'boolean',
        "default": true
      },
      showHighlighting: {
        type: 'boolean',
        "default": true
      },
      showGutters: {
        type: 'boolean',
        "default": true
      },
      lintOnChangeInterval: {
        type: 'integer',
        "default": 1000
      },
      lintDebug: {
        type: 'boolean',
        "default": false
      },
      showErrorInline: {
        type: 'boolean',
        "default": true
      },
      showInfoMessages: {
        type: 'boolean',
        "default": false,
        description: "Display linter messages with error level “Info”."
      },
      statusBar: {
        type: 'string',
        "default": 'None',
        "enum": ['None', 'Show all errors', 'Show error of the selected line', 'Show error if the cursor is in range']
      },
      executionTimeout: {
        type: 'integer',
        "default": 5000,
        description: 'Linter executables are killed after this timeout. Set to 0 to disable.'
      }
    };

    LinterInitializer.prototype.setDefaultOldConfig = function() {
      if (atom.config.get('linter.showErrorInStatusBar') === false) {
        atom.config.set('linter.statusBar', 'None');
      } else if (atom.config.get('linter.showAllErrorsInStatusBar')) {
        atom.config.set('linter.statusBar', 'Show all errors');
      } else if (atom.config.get('linter.showStatusBarWhenCursorIsInErrorRange')) {
        atom.config.set('linter.statusBar', 'Show error if the cursor is in range');
      }
      atom.config.unset('linter.showAllErrorsInStatusBar');
      atom.config.unset('linter.showErrorInStatusBar');
      return atom.config.unset('linter.showStatusBarWhenCursorIsInErrorRange');
    };

    LinterInitializer.prototype.activate = function() {
      var InlineView, LinterView, StatusBarSummaryView, StatusBarView, atomPackage, implemention, linterClasses, _i, _len, _ref, _ref1;
      this.setDefaultOldConfig();
      this.linterViews = new Set();
      this.subscriptions = new CompositeDisposable;
      linterClasses = [];
      _ref = atom.packages.getLoadedPackages();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        atomPackage = _ref[_i];
        if (atomPackage.metadata['linter-package'] === true) {
          implemention = (_ref1 = atomPackage.metadata['linter-implementation']) != null ? _ref1 : atomPackage.name;
          linterClasses.push(require("" + atomPackage.path + "/lib/" + implemention));
        }
      }
      this.enabled = true;
      StatusBarView = require('./statusbar-view');
      this.statusBarView = new StatusBarView();
      StatusBarSummaryView = require('./statusbar-summary-view');
      this.statusBarSummaryView = new StatusBarSummaryView();
      InlineView = require('./inline-view');
      this.inlineView = new InlineView();
      LinterView = require('./linter-view');
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var linterView;
          if (editor.linterView != null) {
            return;
          }
          linterView = new LinterView(editor, _this.statusBarView, _this.statusBarSummaryView, _this.inlineView, linterClasses);
          _this.linterViews.add(linterView);
          return _this.subscriptions.add(linterView.onDidDestroy(function() {
            return _this.linterViews["delete"](linterView);
          }));
        };
      })(this)));
    };

    LinterInitializer.prototype.deactivate = function() {
      this.subscriptions.dispose();
      
    for (var linterView of this.linterViews) {
      linterView.remove();
    }
    ;
      this.linterViews = null;
      this.inlineView.remove();
      this.inlineView = null;
      this.statusBarView.remove();
      this.statusBarView = null;
      this.statusBarSummaryView.remove();
      return this.statusBarSummaryView = null;
    };

    return LinterInitializer;

  })();

  module.exports = new LinterInitializer();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFJTTttQ0FHSjs7QUFBQSxnQ0FBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUdBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BUEY7QUFBQSxNQVNBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQVZGO0FBQUEsTUFZQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FiRjtBQUFBLE1BZUEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FoQkY7QUFBQSxNQWtCQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FuQkY7QUFBQSxNQXFCQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQXRCRjtBQUFBLE1Bd0JBLGVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09B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
//# sourceURL=/Users/lildude/.atom/packages/linter/lib/init.coffee