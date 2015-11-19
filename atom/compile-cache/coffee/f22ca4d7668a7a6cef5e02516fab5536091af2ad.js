(function() {
  var CompositeDisposable, GitBridge, ResolverView, View, handleErr,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  GitBridge = require('../git-bridge').GitBridge;

  handleErr = require('./error-view').handleErr;

  ResolverView = (function(_super) {
    __extends(ResolverView, _super);

    function ResolverView() {
      return ResolverView.__super__.constructor.apply(this, arguments);
    }

    ResolverView.content = function(editor, state, pkg) {
      return this.div({
        "class": 'overlay from-top resolver'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block text-highlight'
          }, "We're done here");
          _this.div({
            "class": 'block'
          }, function() {
            _this.div({
              "class": 'block text-info'
            }, function() {
              return _this.text("You've dealt with all of the conflicts in this file.");
            });
            return _this.div({
              "class": 'block text-info'
            }, function() {
              _this.span({
                outlet: 'actionText'
              }, 'Save and stage');
              return _this.text(' this file for commit?');
            });
          });
          _this.div({
            "class": 'pull-left'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'dismiss'
            }, 'Maybe Later');
          });
          return _this.div({
            "class": 'pull-right'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'resolve'
            }, 'Stage');
          });
        };
      })(this));
    };

    ResolverView.prototype.initialize = function(editor, state, pkg) {
      this.editor = editor;
      this.state = state;
      this.pkg = pkg;
      this.subs = new CompositeDisposable();
      this.refresh();
      this.subs.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, 'merge-conflicts:quit', (function(_this) {
        return function() {
          return _this.dismiss();
        };
      })(this)));
    };

    ResolverView.prototype.detached = function() {
      return this.subs.dispose();
    };

    ResolverView.prototype.getModel = function() {
      return null;
    };

    ResolverView.prototype.relativePath = function() {
      return this.state.repo.relativize(this.editor.getURI());
    };

    ResolverView.prototype.refresh = function() {
      return GitBridge.isStaged(this.state.repo, this.relativePath(), (function(_this) {
        return function(err, staged) {
          var modified, needsSaved, needsStaged;
          if (handleErr(err)) {
            return;
          }
          modified = _this.editor.isModified();
          needsSaved = modified;
          needsStaged = modified || !staged;
          if (!(needsSaved || needsStaged)) {
            _this.hide('fast', function() {
              return this.remove();
            });
            _this.pkg.didStageFile({
              file: _this.editor.getURI()
            });
            return;
          }
          if (needsSaved) {
            return _this.actionText.text('Save and stage');
          } else if (needsStaged) {
            return _this.actionText.text('Stage');
          }
        };
      })(this));
    };

    ResolverView.prototype.resolve = function() {
      this.editor.save();
      return GitBridge.add(this.state.repo, this.relativePath(), (function(_this) {
        return function(err) {
          if (handleErr(err)) {
            return;
          }
          return _this.refresh();
        };
      })(this));
    };

    ResolverView.prototype.dismiss = function() {
      return this.hide('fast', (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
    };

    return ResolverView;

  })(View);

  module.exports = {
    ResolverView: ResolverView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L3Jlc29sdmVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLFdBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFHQyxZQUFhLE9BQUEsQ0FBUSxlQUFSLEVBQWIsU0FIRCxDQUFBOztBQUFBLEVBS0MsWUFBYSxPQUFBLENBQVEsY0FBUixFQUFiLFNBTEQsQ0FBQTs7QUFBQSxFQVFNO0FBRUosbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLEdBQWhCLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMkJBQVA7T0FBTCxFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3ZDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHNCQUFQO1dBQUwsRUFBb0MsaUJBQXBDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8saUJBQVA7YUFBTCxFQUErQixTQUFBLEdBQUE7cUJBQzdCLEtBQUMsQ0FBQSxJQUFELENBQU0sc0RBQU4sRUFENkI7WUFBQSxDQUEvQixDQUFBLENB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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/view/resolver-view.coffee
