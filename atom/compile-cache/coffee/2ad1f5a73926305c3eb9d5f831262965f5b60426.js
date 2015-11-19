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
        "default": true
      },
      showErrorPanel: {
        title: 'Show Error Panel at the bottom',
        type: 'boolean',
        "default": true
      },
      showErrorTabLine: {
        title: 'Show line tab in error panel',
        type: 'boolean',
        "default": false
      },
      showErrorTabFile: {
        title: 'Show file tab in error panel',
        type: 'boolean',
        "default": true
      },
      showErrorTabProject: {
        title: 'Show project tab in error panel',
        type: 'boolean',
        "default": true
      },
      defaultErrorTab: {
        type: 'string',
        "default": 'File',
        "enum": ['Line', 'File', 'Project']
      },
      showErrorInline: {
        title: 'Show Inline Tooltips',
        descriptions: 'Show inline tooltips for errors',
        type: 'boolean',
        "default": true
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true
      },
      statusIconPosition: {
        title: 'Position of Status Icon on Bottom Bar',
        description: 'Requires a reload/restart to update',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left'
      }
    },
    activate: function() {
      var LinterPlus, atomPackage, implementation, legacy, linter, _i, _len, _ref, _ref1, _results;
      LinterPlus = require('./linter-plus.coffee');
      this.instance = new LinterPlus();
      legacy = require('./legacy.coffee');
      _ref = atom.packages.getLoadedPackages();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        atomPackage = _ref[_i];
        if (atomPackage.metadata['linter-package'] === true) {
          implementation = (_ref1 = atomPackage.metadata['linter-implementation']) != null ? _ref1 : atomPackage.name;
          linter = legacy(require("" + atomPackage.path + "/lib/" + implementation));
          _results.push(this.consumeLinter(linter));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
