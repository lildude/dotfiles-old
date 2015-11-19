(function() {
  var GitNotFoundError, GitNotFoundErrorView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  GitNotFoundError = require('../git-bridge').GitNotFoundError;

  GitNotFoundErrorView = (function(_super) {
    __extends(GitNotFoundErrorView, _super);

    function GitNotFoundErrorView() {
      return GitNotFoundErrorView.__super__.constructor.apply(this, arguments);
    }

    GitNotFoundErrorView.content = function(err) {
      return this.div({
        "class": 'overlay from-top padded merge-conflict-error merge-conflicts-message'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'panel'
          }, function() {
            _this.div({
              "class": 'panel-heading no-path'
            }, function() {
              _this.code('git');
              return _this.text("can't be found in any of the default locations!");
            });
            _this.div({
              "class": 'panel-heading wrong-path'
            }, function() {
              _this.code('git');
              _this.text("can't be found at ");
              _this.code(atom.config.get('merge-conflicts.gitPath'));
              return _this.text('!');
            });
            return _this.div({
              "class": 'panel-body'
            }, function() {
              _this.div({
                "class": 'block'
              }, 'Please specify the correct path in the merge-conflicts package settings.');
              return _this.div({
                "class": 'block'
              }, function() {
                _this.button({
                  "class": 'btn btn-error inline-block-tight',
                  click: 'openSettings'
                }, 'Open Settings');
                return _this.button({
                  "class": 'btn inline-block-tight',
                  click: 'notRightNow'
                }, 'Not Right Now');
              });
            });
          });
        };
      })(this));
    };

    GitNotFoundErrorView.prototype.initialize = function(err) {
      if (atom.config.get('merge-conflicts.gitPath')) {
        this.find('.no-path').hide();
        return this.find('.wrong-path').show();
      } else {
        this.find('.no-path').show();
        return this.find('.wrong-path').hide();
      }
    };

    GitNotFoundErrorView.prototype.openSettings = function() {
      atom.workspace.open('atom://config/packages');
      return this.remove();
    };

    GitNotFoundErrorView.prototype.notRightNow = function() {
      return this.remove();
    };

    return GitNotFoundErrorView;

  })(View);

  module.exports = {
    handleErr: function(err) {
      if (err == null) {
        return false;
      }
      if (err instanceof GitNotFoundError) {
        atom.workspace.addTopPanel({
          item: new GitNotFoundErrorView(err)
        });
      } else {
        atom.notifications.addError(err.message);
        console.error(err.message, err.trace);
      }
      return true;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L2Vycm9yLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0MsbUJBQW9CLE9BQUEsQ0FBUSxlQUFSLEVBQXBCLGdCQURELENBQUE7O0FBQUEsRUFHTTtBQUVKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLG9CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsR0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHNFQUFQO09BQUwsRUFBb0YsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbEYsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sdUJBQVA7YUFBTCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQU4sQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0saURBQU4sRUFGbUM7WUFBQSxDQUFyQyxDQUFBLENBQUE7QUFBQSxZQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTywwQkFBUDthQUFMLEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxjQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sS0FBTixDQUFBLENBQUE7QUFBQSxjQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sb0JB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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/view/error-view.coffee
