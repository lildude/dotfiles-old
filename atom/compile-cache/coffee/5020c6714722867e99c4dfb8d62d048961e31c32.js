(function() {
  var IgnoredCommands, PathRE, Reporter, crypto, fs, grim, path, stripPath;

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
      return this.ensureUserInfo((function(_this) {
        return function() {
          return _this.begin(sessionLength);
        };
      })(this));
    },
    deactivate: function() {
      var _ref, _ref1, _ref2;
      if ((_ref = this.errorSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.paneItemSubscription) != null) {
        _ref1.dispose();
      }
      return (_ref2 = this.commandSubscription) != null ? _ref2.dispose() : void 0;
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
      this.paneItemSubscription = atom.workspace.onDidAddPaneItem(function(_arg) {
        var item;
        item = _arg.item;
        return Reporter.sendPaneItem(item);
      });
      this.errorSubscription = atom.onDidThrowError(function(event) {
        var errorMessage;
        errorMessage = event;
        if (typeof event !== 'string') {
          errorMessage = event.message;
        }
        errorMessage = stripPath(errorMessage) || 'Unknown';
        errorMessage = errorMessage.replace('Uncaught ', '').slice(0, 150);
        return Reporter.sendException(errorMessage);
      });
      this.commandSubscription = atom.commands.onWillDispatch(function(commandEvent) {
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
      });
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
    watchDeprecations: function() {
      return grim.on('updated', (function(_this) {
        return function(deprecation) {
          return setImmediate(function() {
            var pack, packageName, packageNames, stack, version, _i, _len, _ref, _ref1, _ref2, _ref3;
            packageNames = {};
            _ref = deprecation.getStacks();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              stack = _ref[_i];
              packageName = (_ref1 = (_ref2 = stack.metadata) != null ? _ref2.packageName : void 0) != null ? _ref1 : (_this.getPackageName(stack) || '').toLowerCase();
              if (packageName) {
                pack = atom.packages.getLoadedPackage(packageName);
                version = pack != null ? (_ref3 = pack.metadata) != null ? _ref3.version : void 0 : void 0;
                packageNames[packageName] = version || 'unknown';
              }
            }
            for (packageName in packageNames) {
              version = packageNames[packageName];
              if (packageName != null) {
                Reporter.sendEvent('deprecation', packageName, version);
              }
            }
          });
        };
      })(this));
    },
    getPackageName: function(stack) {
      var fileName, functionName, i, location, packageName, packagePath, packagePaths, relativePath, resourcePath, _i, _ref, _ref1;
      resourcePath = atom.getLoadSettings().resourcePath;
      packagePaths = this.getPackagePathsByPackageName();
      for (packageName in packagePaths) {
        packagePath = packagePaths[packageName];
        if (packagePath.indexOf('.atom/dev/packages') > -1 || packagePath.indexOf('.atom/packages') > -1) {
          packagePaths[packageName] = fs.absolute(packagePath);
        }
      }
      for (i = _i = 1, _ref = stack.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        _ref1 = stack[i], functionName = _ref1.functionName, location = _ref1.location, fileName = _ref1.fileName;
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
      }
      return this.packagePathsByPackageName;
    }
  };

  PathRE = /'?((\/|\\|[a-z]:\\)[^\s']+)+'?/ig;

  stripPath = function(message) {
    return message.replace(PathRE, '<path>');
  };

}).call(this);
