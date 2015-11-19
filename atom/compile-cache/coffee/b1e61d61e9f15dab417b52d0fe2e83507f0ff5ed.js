(function() {
  var Reporter, crypto;

  crypto = require('crypto');

  Reporter = require('./reporter');

  module.exports = {
    activate: function(_arg) {
      var sessionLength;
      sessionLength = _arg.sessionLength;
      if (atom.config.get('metrics.userId')) {
        return this.begin(sessionLength);
      } else {
        this.getUserId(function(userId) {
          return atom.config.set('metrics.userId', userId);
        });
        return this.begin(sessionLength);
      }
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.paneItemSubscription) != null ? _ref.dispose() : void 0;
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
      if (atom.getLoadSettings().shellLoadTime != null) {
        Reporter.sendTiming('shell', 'load', atom.getLoadSettings().shellLoadTime);
      }
      return process.nextTick(function() {
        return Reporter.sendTiming('core', 'load', atom.getWindowLoadTime());
      });
    },
    getUserId: function(callback) {
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixVQUFBLGFBQUE7QUFBQSxNQURVLGdCQUFELEtBQUMsYUFDVixDQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxTQUFDLE1BQUQsR0FBQTtpQkFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0JBQWhCLEVBQWtDLE1BQWxDLEVBQVo7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQUpGO09BRFE7SUFBQSxDQUFWO0FBQUEsSUFPQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOzhEQUFxQixDQUFFLE9BQXZCLENBQUEsV0FEVTtJQUFBLENBUFo7QUFBQSxJQVVBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsYUFBQSxFQUFlLElBQUksQ0FBQyxHQUFMLENBQUEsQ0FBQSxHQUFhLElBQUMsQ0FBQSxZQUE3QjtRQURTO0lBQUEsQ0FWWDtBQUFBLElBYUEsS0FBQSxFQUFPLFNBQUMsYUFBRCxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsR0FBTCxDQUFBLENBQWhCLENBQUE7QUFFQSxNQUFBLElBQXdELGFBQXhEO0FBQUEsUUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixRQUFuQixFQUE2QixPQUE3QixFQUFzQyxhQUF0QyxDQUFBLENBQUE7T0FGQTtBQUFBLE1BR0EsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsUUFBbkIsRUFBNkIsU0FBN0IsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZixDQUFnQyxTQUFDLElBQUQsR0FBQTtBQUN0RCxZQUFBLElBQUE7QUFBQSxRQUR3RCxPQUFELEtBQUMsSUFDeEQsQ0FBQTtlQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLElBQXRCLEVBRHNEO01BQUEsQ0FBaEMsQ0FKeEIsQ0FBQTtBQU9BLE1BQUEsSUFBRyw0Q0FBSDtBQUVFLFFBQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsT0FBcEIsRUFBNkIsTUFBN0IsRUFBcUMsSUFBSSxDQUFDLGVBQUwsQ0FBQSxDQUFzQixDQUFDLGFBQTVELENBQUEsQ0FGRjtPQVBBO2FBV0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsU0FBQSxHQUFBO2VBRWYsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEIsTUFBNUIsRUFBb0MsSUFBSSxDQUFDLGlCQUFMLENBQUEsQ0FBcEMsRUFGZTtNQUFBLENBQWpCLEVBWks7SUFBQSxDQWJQO0FBQUEsSUE2QkEsU0FBQSxFQUFXLFNBQUMsUUFBRCxHQUFBO2FBQ1QsT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQyxNQUFsQixDQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsVUFBUixHQUFBO0FBQ3ZCLFVBQUEsSUFBRyxhQUFIO21CQUNFLFFBQUEsQ0FBUyxPQUFBLENBQVEsV0FBUixDQUFvQixDQUFDLEVBQXJCLENBQUEsQ0FBVCxFQURGO1dBQUEsTUFBQTttQkFHRSxRQUFBLENBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsTUFBbEIsQ0FBeUIsQ0FBQyxNQUExQixDQUFpQyxVQUFqQyxFQUE2QyxNQUE3QyxDQUFvRCxDQUFDLE1BQXJELENBQTRELEtBQTVELENBQVQsRUFIRjtXQUR1QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLEVBRFM7SUFBQSxDQTdCWDtHQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/metrics.coffee