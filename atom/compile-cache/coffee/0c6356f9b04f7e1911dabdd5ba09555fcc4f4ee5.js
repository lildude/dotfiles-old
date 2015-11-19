(function() {
  var GitBridge, MergeState;

  GitBridge = require('./git-bridge').GitBridge;

  MergeState = (function() {
    function MergeState(conflicts, repo, isRebase) {
      this.conflicts = conflicts;
      this.repo = repo;
      this.isRebase = isRebase;
    }

    MergeState.prototype.conflictPaths = function() {
      var c, _i, _len, _ref, _results;
      _ref = this.conflicts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.path);
      }
      return _results;
    };

    MergeState.prototype.reread = function(callback) {
      return GitBridge.withConflicts(this.repo, (function(_this) {
        return function(err, conflicts) {
          _this.conflicts = conflicts;
          return callback(err, _this);
        };
      })(this));
    };

    MergeState.prototype.isEmpty = function() {
      return this.conflicts.length === 0;
    };

    MergeState.read = function(repo, callback) {
      var isr;
      isr = GitBridge.isRebasing();
      return GitBridge.withConflicts(repo, function(err, cs) {
        if (err != null) {
          return callback(err, null);
        } else {
          return callback(null, new MergeState(cs, repo, isr));
        }
      });
    };

    return MergeState;

  })();

  module.exports = {
    MergeState: MergeState
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9tZXJnZS1zdGF0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQyxZQUFhLE9BQUEsQ0FBUSxjQUFSLEVBQWIsU0FBRCxDQUFBOztBQUFBLEVBRU07QUFFUyxJQUFBLG9CQUFFLFNBQUYsRUFBYyxJQUFkLEVBQXFCLFFBQXJCLEdBQUE7QUFBZ0MsTUFBL0IsSUFBQyxDQUFBLFlBQUEsU0FBOEIsQ0FBQTtBQUFBLE1BQW5CLElBQUMsQ0FBQSxPQUFBLElBQWtCLENBQUE7QUFBQSxNQUFaLElBQUMsQ0FBQSxXQUFBLFFBQVcsQ0FBaEM7SUFBQSxDQUFiOztBQUFBLHlCQUVBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFBRyxVQUFBLDJCQUFBO0FBQUE7QUFBQTtXQUFBLDJDQUFBO3FCQUFBO0FBQUEsc0JBQUEsQ0FBQyxDQUFDLEtBQUYsQ0FBQTtBQUFBO3NCQUFIO0lBQUEsQ0FGZixDQUFBOztBQUFBLHlCQUlBLE1BQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTthQUNOLFNBQVMsQ0FBQyxhQUFWLENBQXdCLElBQUMsQ0FBQSxJQUF6QixFQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEVBQU8sU0FBUCxHQUFBO0FBQzdCLFVBRG1DLEtBQUMsQ0FBQSxZQUFBLFNBQ3BDLENBQUE7aUJBQUEsUUFBQSxDQUFTLEdBQVQsRUFBYyxLQUFkLEVBRDZCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0IsRUFETTtJQUFBLENBSlIsQ0FBQTs7QUFBQSx5QkFRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLEtBQXFCLEVBQXhCO0lBQUEsQ0FSVCxDQUFBOztBQUFBLElBVUEsVUFBQyxDQUFBLElBQUQsR0FBTyxTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDTCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxTQUFTLENBQUMsVUFBVixDQUFBLENBQU4sQ0FBQTthQUNBLFNBQVMsQ0FBQyxhQUFWLENBQXdCLElBQXhCLEVBQThCLFNBQUMsR0FBRCxFQUFNLEVBQU4sR0FBQTtBQUM1QixRQUFBLElBQUcsV0FBSDtpQkFDRSxRQUFBLENBQVMsR0FBVCxFQUFjLElBQWQsRUFERjtTQUFBLE1BQUE7aUJBR0UsUUFBQSxDQUFTLElBQVQsRUFBbUIsSUFBQSxVQUFBLENBQVcsRUFBWCxFQUFlLElBQWYsRUFBcUIsR0FBckIsQ0FBbkIsRUFIRjtTQUQ0QjtNQUFBLENBQTlCLEVBRks7SUFBQSxDQVZQLENBQUE7O3NCQUFBOztNQUpGLENBQUE7O0FBQUEsRUFzQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsVUFBQSxFQUFZLFVBQVo7R0F2QkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/merge-state.coffee
