(function() {
  var IgnoredCommands, PathRE, Reporter, crypto, stripPath;

  crypto = require('crypto');

  Reporter = require('./reporter');

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
    }
  };

  PathRE = /'?((\/|\\|[a-z]:\\)[^\s']+)+'?/ig;

  stripPath = function(message) {
    return message.replace(PathRE, '<path>');
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQ0U7QUFBQSxJQUFBLGtCQUFBLEVBQW9CLElBQXBCO0FBQUEsSUFDQSxvQkFBQSxFQUFzQixJQUR0QjtBQUFBLElBRUEsb0JBQUEsRUFBc0IsSUFGdEI7QUFBQSxJQUdBLHFCQUFBLEVBQXVCLElBSHZCO0dBSkYsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BRFUsZ0JBQUQsS0FBQyxhQUNWLENBQUE7YUFBQSxJQUFDLENBQUEsY0FBRCxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNkLEtBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQURjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsRUFEUTtJQUFBLENBQVY7QUFBQSxJQUlBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLGtCQUFBOztZQUFrQixDQUFFLE9BQXBCLENBQUE7T0FBQTs7YUFDcUIsQ0FBRSxPQUF2QixDQUFBO09BREE7K0RBRW9CLENBQUUsT0FBdEIsQ0FBQSxXQUhVO0lBQUEsQ0FKWjtBQUFBLElBU0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxhQUFBLEVBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBQSxDQUFBLEdBQWEsSUFBQyxDQUFBLFlBQTdCO1FBRFM7SUFBQSxDQVRYO0FBQUEsSUFZQSxlQUFB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
//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/metrics.coffee