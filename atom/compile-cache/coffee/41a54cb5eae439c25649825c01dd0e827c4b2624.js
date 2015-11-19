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
    begin: function(sessionLength) {
      this.sessionStart = Date.now();
      if (sessionLength) {
        Reporter.sendEvent('window', 'ended', sessionLength);
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
      return require('getmac').getMac((function(_this) {
        return function(error, macAddress) {
          if (error != null) {
            return callback(require('node-uuid').v4());
          } else {
            return callback(crypto.createHash('sha1').update(macAddress, 'utf8').digest('hex'));
          }
        };
      })(this));
    }
  };

  PathRE = /'?((\/|\\|[a-z]:\\)[^\s']+)+'?/ig;

  stripPath = function(message) {
    return message.replace(PathRE, '<path>');
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQ0U7QUFBQSxJQUFBLGtCQUFBLEVBQW9CLElBQXBCO0FBQUEsSUFDQSxvQkFBQSxFQUFzQixJQUR0QjtBQUFBLElBRUEsb0JBQUEsRUFBc0IsSUFGdEI7QUFBQSxJQUdBLHFCQUFBLEVBQXVCLElBSHZCO0dBSkYsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BRFUsZ0JBQUQsS0FBQyxhQUNWLENBQUE7YUFBQSxJQUFDLENBQUEsY0FBRCxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNkLEtBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQURjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsRUFEUTtJQUFBLENBQVY7QUFBQSxJQUlBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLGtCQUFBOztZQUFrQixDQUFFLE9BQXBCLENBQUE7T0FBQTs7YUFDcUIsQ0FBRSxPQUF2QixDQUFBO09BREE7K0RBRW9CLENBQUUsT0FBdEIsQ0FBQSxXQUhVO0lBQUEsQ0FKWjtBQUFBLElBU0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxhQUFBLEVBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBQSxDQUFBLEdBQWEsSUFBQyxDQUFBLFlBQTdCO1FBRFM7SUFBQSxDQVRYO0FBQUEsSUFZQSxLQUFB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
//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/metrics.coffee