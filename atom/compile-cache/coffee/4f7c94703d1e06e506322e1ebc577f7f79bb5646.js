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
      atom.workspaceView.on('pane:item-added', function(event, item) {
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
            return callback(require('guid').raw());
          } else {
            return callback(crypto.createHash('sha1').update(macAddress, 'utf8').digest('hex'));
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixVQUFBLGFBQUE7QUFBQSxNQURVLGdCQUFELEtBQUMsYUFDVixDQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxTQUFDLE1BQUQsR0FBQTtpQkFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0JBQWhCLEVBQWtDLE1BQWxDLEVBQVo7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQUpGO09BRFE7SUFBQSxDQUFWO0FBQUEsSUFPQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLGFBQUEsRUFBZSxJQUFJLENBQUMsR0FBTCxDQUFBLENBQUEsR0FBYSxJQUFDLENBQUEsWUFBN0I7UUFEUztJQUFBLENBUFg7QUFBQSxJQVVBLEtBQUEsRUFBTyxTQUFDLGFBQUQsR0FBQTtBQUNMLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBSSxDQUFDLEdBQUwsQ0FBQSxDQUFoQixDQUFBO0FBRUEsTUFBQSxJQUF3RCxhQUF4RDtBQUFBLFFBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsUUFBbkIsRUFBNkIsT0FBN0IsRUFBc0MsYUFBdEMsQ0FBQSxDQUFBO09BRkE7QUFBQSxNQUdBLFFBQVEsQ0FBQyxTQUFULENBQW1CLFFBQW5CLEVBQTZCLFNBQTdCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFuQixDQUFzQixpQkFBdEIsRUFBeUMsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO2VBQ3ZDLFFBQVEsQ0FBQyxZQUFULENBQXNCLElBQXRCLEVBRHVDO01BQUEsQ0FBekMsQ0FKQSxDQUFBO0FBT0EsTUFBQSxJQUFHLDRDQUFIO0FBRUUsUUFBQSxRQUFRLENBQUMsVUFBVCxDQUFvQixPQUFwQixFQUE2QixNQUE3QixFQUFxQyxJQUFJLENBQUMsZUFBTCxDQUFBLENBQXNCLENBQUMsYUFBNUQsQ0FBQSxDQUZGO09BUEE7YUFXQSxPQUFPLENBQUMsUUFBUixDQUFpQixTQUFBLEdBQUE7ZUFFZixRQUFRLENBQUMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixNQUE1QixFQUFvQyxJQUFJLENBQUMsaUJBQUwsQ0FBQSxDQUFwQyxFQUZlO01BQUEsQ0FBakIsRUFaSztJQUFBLENBVlA7QUFBQSxJQTBCQSxTQUFBLEVBQVcsU0FBQyxRQUFELEdBQUE7YUFDVCxPQUFBLENBQVEsUUFBUixDQUFpQixDQUFDLE1BQWxCLENBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxVQUFSLEdBQUE7QUFDdkIsVUFBQSxJQUFHLGFBQUg7bUJBQ0UsUUFBQSxDQUFTLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxHQUFoQixDQUFBLENBQVQsRUFERjtXQUFBLE1BQUE7bUJBR0UsUUFBQSxDQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE1BQWxCLENBQXlCLENBQUMsTUFBMUIsQ0FBaUMsVUFBakMsRUFBNkMsTUFBN0MsQ0FBb0QsQ0FBQyxNQUFyRCxDQUE0RCxLQUE1RCxDQUFULEVBSEY7V0FEdUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixFQURTO0lBQUEsQ0ExQlg7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/metrics.coffee