(function() {
  var CompositeDisposable, Emitter, GitBridge, MergeConflictsView, handleErr, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  GitBridge = require('./git-bridge').GitBridge;

  MergeConflictsView = require('./view/merge-conflicts-view').MergeConflictsView;

  handleErr = require('./view/error-view').handleErr;

  module.exports = {
    activate: function(state) {
      var pkgEmitter;
      this.subs = new CompositeDisposable;
      this.emitter = new Emitter;
      pkgEmitter = {
        onDidResolveConflict: (function(_this) {
          return function(callback) {
            return _this.onDidResolveConflict(callback);
          };
        })(this),
        didResolveConflict: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-resolve-conflict', event);
          };
        })(this),
        onDidStageFile: (function(_this) {
          return function(callback) {
            return _this.onDidStageFile(callback);
          };
        })(this),
        didStageFile: (function(_this) {
          return function(event) {
            return _this.emitter.emit('did-stage-file', event);
          };
        })(this),
        onDidQuitConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidQuitConflictResolution(callback);
          };
        })(this),
        didQuitConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-quit-conflict-resolution');
          };
        })(this),
        onDidCompleteConflictResolution: (function(_this) {
          return function(callback) {
            return _this.onDidCompleteConflictResolution(callback);
          };
        })(this),
        didCompleteConflictResolution: (function(_this) {
          return function() {
            return _this.emitter.emit('did-complete-conflict-resolution');
          };
        })(this)
      };
      return this.subs.add(atom.commands.add('atom-workspace', 'merge-conflicts:detect', function() {
        return GitBridge.locateGitAnd(function(err) {
          if (err != null) {
            return handleErr(err);
          }
          return MergeConflictsView.detect(pkgEmitter);
        });
      }));
    },
    deactivate: function() {
      this.subs.dispose();
      return this.emitter.dispose();
    },
    config: {
      gitPath: {
        type: 'string',
        "default": '',
        description: 'Absolute path to your git executable.'
      }
    },
    onDidResolveConflict: function(callback) {
      return this.emitter.on('did-resolve-conflict', callback);
    },
    onDidStageFile: function(callback) {
      return this.emitter.on('did-stage-file', callback);
    },
    onDidQuitConflictResolution: function(callback) {
      return this.emitter.on('did-quit-conflict-resolution', callback);
    },
    onDidCompleteConflictResolution: function(callback) {
      return this.emitter.on('did-complete-conflict-resolution', callback);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RUFBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUF0QixDQUFBOztBQUFBLEVBRUMsWUFBYSxPQUFBLENBQVEsY0FBUixFQUFiLFNBRkQsQ0FBQTs7QUFBQSxFQUlDLHFCQUFzQixPQUFBLENBQVEsNkJBQVIsRUFBdEIsa0JBSkQsQ0FBQTs7QUFBQSxFQUtDLFlBQWEsT0FBQSxDQUFRLG1CQUFSLEVBQWIsU0FMRCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxVQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQUEsQ0FBQSxtQkFBUixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQURYLENBQUE7QUFBQSxNQUdBLFVBQUEsR0FDRTtBQUFBLFFBQUEsb0JBQUEsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLFFBQUQsR0FBQTttQkFBYyxLQUFDLENBQUEsb0JBQUQsQ0FBc0IsUUFBdEIsRUFBZDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO0FBQUEsUUFDQSxrQkFBQSxFQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO21CQUFXLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHNCQUFkLEVBQXNDLEtBQXRDLEVBQVg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxD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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/main.coffee
