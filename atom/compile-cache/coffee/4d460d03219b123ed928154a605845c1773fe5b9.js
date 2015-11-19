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
        return this.createUserId((function(_this) {
          return function(userId) {
            localStorage.setItem('metrics.userId', userId);
            return callback();
          };
        })(this));
      }
    },
    createUserId: function(callback) {
      var createUUID, e;
      createUUID = function() {
        return callback(require('node-uuid').v4());
      };
      try {
        return require('getmac').getMac((function(_this) {
          return function(error, macAddress) {
            if (error != null) {
              return createUUID();
            } else {
              return callback(crypto.createHash('sha1').update(macAddress, 'utf8').digest('hex'));
            }
          };
        })(this));
      } catch (_error) {
        e = _error;
        return createUUID();
      }
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
