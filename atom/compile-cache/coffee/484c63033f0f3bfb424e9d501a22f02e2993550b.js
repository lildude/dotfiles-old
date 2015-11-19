(function() {
  var CompositeDisposable, IgnoredCommands, PathRE, Reporter, crypto, fs, grim, path, stripPath;

  CompositeDisposable = require('atom').CompositeDisposable;

  crypto = require('crypto');

  path = require('path');

  Reporter = require('./reporter');

  fs = require('fs-plus');

  grim = require('grim');

  IgnoredCommands = {
    'vim-mode:move-up': true,
    'vim-mode:move-down': true,
    'vim-mode:move-left': true,
    'vim-mode:move-right': true
  };

  module.exports = {
    activate: function(_arg) {
      var sessionLength;
      sessionLength = _arg.sessionLength;
      this.subscriptions = new CompositeDisposable;
      return this.ensureUserInfo((function(_this) {
        return function() {
          return _this.begin(sessionLength);
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    },
    serialize: function() {
      return {
        sessionLength: Date.now() - this.sessionStart
      };
    },
    provideReporter: function() {
      return {
        sendEvent: Reporter.sendEvent.bind(Reporter),
        sendTiming: Reporter.sendTiming.bind(Reporter),
        sendException: Reporter.sendException.bind(Reporter)
      };
    },
    begin: function(sessionLength) {
      this.sessionStart = Date.now();
      if (sessionLength) {
        Reporter.sendEvent('window', 'ended', null, sessionLength);
      }
      Reporter.sendEvent('window', 'started');
      this.subscriptions.add(atom.onDidThrowError(function(event) {
        var errorMessage;
        errorMessage = event;
        if (typeof event !== 'string') {
          errorMessage = event.message;
        }
        errorMessage = stripPath(errorMessage) || 'Unknown';
        errorMessage = errorMessage.replace('Uncaught ', '').slice(0, 150);
        return Reporter.sendException(errorMessage);
      }));
      this.watchPaneItems();
      this.watchCommands();
      this.watchDeprecations();
      if (atom.getLoadSettings().shellLoadTime != null) {
        Reporter.sendTiming('shell', 'load', atom.getLoadSettings().shellLoadTime);
      }
      return process.nextTick(function() {
        return Reporter.sendTiming('core', 'load', atom.getWindowLoadTime());
      });
    },
    ensureUserInfo: function(callback) {
      if (localStorage.getItem('metrics.userId')) {
        return callback();
      } else if (atom.config.get('metrics.userId')) {
        localStorage.setItem('metrics.userId', atom.config.get('metrics.userId'));
        return callback();
      } else {
        return this.createUserId(function(userId) {
          localStorage.setItem('metrics.userId', userId);
          return callback();
        });
      }
    },
    createUserId: function(callback) {
      return callback(require('node-uuid').v4());
    },
    getUserId: function() {
      var userId;
      return userId = localStorage.getItem('metrics.userId');
    },
    shouldWatchEvents: function() {
      var checksum, crc32, seed, userId;
      userId = this.getUserId();
      if (userId) {
        seed = 'the5%';
        crc32 = require('crc').crc32;
        checksum = crc32(userId + seed);
        return checksum % 100 < 5;
      } else {
        return false;
      }
    },
    watchPaneItems: function() {
      if (!this.shouldWatchEvents()) {
        return;
      }
      return this.subscriptions.add(atom.workspace.onDidAddPaneItem(function(_arg) {
        var item;
        item = _arg.item;
        return Reporter.sendPaneItem(item);
      }));
    },
    watchCommands: function() {
      if (!this.shouldWatchEvents()) {
        return;
      }
      return this.subscriptions.add(atom.commands.onWillDispatch(function(commandEvent) {
        var eventName, _ref;
        eventName = commandEvent.type;
        if ((_ref = commandEvent.detail) != null ? _ref.jQueryTrigger : void 0) {
          return;
        }
        if (eventName.startsWith('core:') || eventName.startsWith('editor:')) {
          return;
        }
        if (!(eventName.indexOf(':') > -1)) {
          return;
        }
        if (eventName in IgnoredCommands) {
          return;
        }
        return Reporter.sendCommand(eventName);
      }));
    },
    watchDeprecations: function() {
      this.deprecationCache = {};
      this.packageVersionCache = {};
      atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          var pack, packages, _i, _len, _ref;
          packages = atom.packages.getLoadedPackages();
          for (_i = 0, _len = packages.length; _i < _len; _i++) {
            pack = packages[_i];
            _this.packageVersionCache[pack.name] = (pack != null ? (_ref = pack.metadata) != null ? _ref.version : void 0 : void 0) || 'unknown';
          }
          setImmediate(function() {
            var deprecation, _j, _len1, _ref1;
            _ref1 = grim.getDeprecations();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              deprecation = _ref1[_j];
              _this.reportDeprecation(deprecation);
            }
          });
        };
      })(this));
      atom.packages.onDidLoadPackage((function(_this) {
        return function(pack) {
          var _ref;
          if (!_this.packageVersionCache[pack.name]) {
            return _this.packageVersionCache[pack.name] = (pack != null ? (_ref = pack.metadata) != null ? _ref.version : void 0 : void 0) || 'unknown';
          }
        };
      })(this));
      return grim.on('updated', (function(_this) {
        return function(deprecation) {
          return setImmediate(function() {
            return _this.reportDeprecation(deprecation);
          });
        };
      })(this));
    },
    reportDeprecation: function(deprecation) {
      var message, nameAndVersion, pack, packageName, packageNames, stack, version, __, _ref, _ref1, _ref2, _ref3;
      packageNames = {};
      message = deprecation.getMessage().slice(0, 500);
      _ref = deprecation.stacks;
      for (__ in _ref) {
        stack = _ref[__];
        packageName = (_ref1 = (_ref2 = stack.metadata) != null ? _ref2.packageName : void 0) != null ? _ref1 : (this.getPackageName(stack) || '').toLowerCase();
        if (!packageName) {
          continue;
        }
        if (!this.packageVersionCache[packageName]) {
          pack = atom.packages.getLoadedPackage(packageName);
          this.packageVersionCache[packageName] = (pack != null ? (_ref3 = pack.metadata) != null ? _ref3.version : void 0 : void 0) || 'unknown';
        }
        version = this.packageVersionCache[packageName];
        nameAndVersion = "" + packageName + "@" + version;
        if (this.deprecationCache[nameAndVersion + message] == null) {
          this.deprecationCache[nameAndVersion + message] = true;
          Reporter.sendEvent('deprecation-v3', nameAndVersion, message);
        }
      }
    },
    getFileNameFromCallSite: function(callsite) {
      var _ref;
      return (_ref = callsite.fileName) != null ? _ref : callsite.getFileName();
    },
    getPackageName: function(stack) {
      var fileName, i, packageName, packagePath, packagePaths, relativePath, resourcePath, _i, _ref;
      resourcePath = atom.getLoadSettings().resourcePath;
      packagePaths = this.getPackagePathsByPackageName();
      for (i = _i = 1, _ref = stack.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        fileName = this.getFileNameFromCallSite(stack[i]);
        if (!fileName) {
          return;
        }
        if (fileName.includes(path.sep + "node_modules" + path.sep)) {
          continue;
        }
        for (packageName in packagePaths) {
          packagePath = packagePaths[packageName];
          relativePath = path.relative(packagePath, fileName);
          if (!/^\.\./.test(relativePath)) {
            return packageName;
          }
        }
        if (atom.getUserInitScriptPath() === fileName) {
          return "init-script";
        }
      }
    },
    getPackagePathsByPackageName: function() {
      var pack, _i, _len, _ref;
      if (this.packagePathsByPackageName != null) {
        return this.packagePathsByPackageName;
      }
      this.packagePathsByPackageName = {};
      _ref = atom.packages.getLoadedPackages();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pack = _ref[_i];
        this.packagePathsByPackageName[pack.name] = pack.path;
        if (pack.path.indexOf('.atom/dev/packages') > -1 || pack.path.indexOf('.atom/packages') > -1) {
          this.packagePathsByPackageName[pack.name] = fs.absolute(pack.path);
        }
      }
      return this.packagePathsByPackageName;
    }
  };

  PathRE = /'?((\/|\\|[a-z]:\\)[^\s']+)+'?/ig;

  stripPath = function(message) {
    return message.replace(PathRE, '<path>');
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWV0cmljcy9saWIvbWV0cmljcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUZULENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUxMLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBUUEsZUFBQSxHQUNFO0FBQUEsSUFBQSxrQkFBQSxFQUFvQixJQUFwQjtBQUFBLElBQ0Esb0JBQUEsRUFBc0IsSUFEdEI7QUFBQSxJQUVBLG9CQUFBLEVBQXNCLElBRnRCO0FBQUEsSUFHQSxxQkFBQSxFQUF1QixJQUh2QjtHQVRGLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixVQUFBLGFBQUE7QUFBQSxNQURVLGdCQUFELEtBQUMsYUFDVixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNkLEtBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQURjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFB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

//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/metrics.coffee
