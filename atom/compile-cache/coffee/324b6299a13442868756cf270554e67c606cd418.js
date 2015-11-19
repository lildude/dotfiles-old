(function() {
  var $, CompositeDisposable, Conflict, ConflictedEditor, Emitter, NavigationView, ResolverView, SideView, _, _ref;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  Conflict = require('./conflict').Conflict;

  SideView = require('./view/side-view').SideView;

  NavigationView = require('./view/navigation-view').NavigationView;

  ResolverView = require('./view/resolver-view').ResolverView;

  ConflictedEditor = (function() {
    function ConflictedEditor(state, pkg, editor) {
      this.state = state;
      this.pkg = pkg;
      this.editor = editor;
      this.subs = new CompositeDisposable;
      this.coveringViews = [];
      this.conflicts = [];
    }

    ConflictedEditor.prototype.mark = function() {
      var c, cv, _i, _j, _len, _len1, _ref1, _ref2;
      this.conflicts = Conflict.all(this.state, this.editor);
      this.coveringViews = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        this.coveringViews.push(new SideView(c.ours, this.editor));
        this.coveringViews.push(new NavigationView(c.navigator, this.editor));
        this.coveringViews.push(new SideView(c.theirs, this.editor));
        this.subs.add(c.onDidResolveConflict((function(_this) {
          return function() {
            var resolvedCount, unresolved, v;
            unresolved = (function() {
              var _j, _len1, _ref2, _results;
              _ref2 = this.coveringViews;
              _results = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                v = _ref2[_j];
                if (!v.conflict().isResolved()) {
                  _results.push(v);
                }
              }
              return _results;
            }).call(_this);
            resolvedCount = _this.conflicts.length - Math.floor(unresolved.length / 3);
            return _this.pkg.didResolveConflict({
              file: _this.editor.getPath(),
              total: _this.conflicts.length,
              resolved: resolvedCount,
              source: _this
            });
          };
        })(this)));
      }
      if (this.conflicts.length > 0) {
        atom.views.getView(this.editor).classList.add('conflicted');
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          cv = _ref2[_j];
          cv.decorate();
        }
        this.installEvents();
        return this.focusConflict(this.conflicts[0]);
      } else {
        this.pkg.didResolveConflict({
          file: this.editor.getPath(),
          total: 1,
          resolved: 1,
          source: this
        });
        return this.conflictsResolved();
      }
    };

    ConflictedEditor.prototype.installEvents = function() {
      this.subs.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.detectDirty();
        };
      })(this)));
      this.subs.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      this.subs.add(atom.commands.add('atom-text-editor', {
        'merge-conflicts:accept-current': (function(_this) {
          return function() {
            return _this.acceptCurrent();
          };
        })(this),
        'merge-conflicts:accept-ours': (function(_this) {
          return function() {
            return _this.acceptOurs();
          };
        })(this),
        'merge-conflicts:accept-theirs': (function(_this) {
          return function() {
            return _this.acceptTheirs();
          };
        })(this),
        'merge-conflicts:ours-then-theirs': (function(_this) {
          return function() {
            return _this.acceptOursThenTheirs();
          };
        })(this),
        'merge-conflicts:theirs-then-ours': (function(_this) {
          return function() {
            return _this.acceptTheirsThenOurs();
          };
        })(this),
        'merge-conflicts:next-unresolved': (function(_this) {
          return function() {
            return _this.nextUnresolved();
          };
        })(this),
        'merge-conflicts:previous-unresolved': (function(_this) {
          return function() {
            return _this.previousUnresolved();
          };
        })(this),
        'merge-conflicts:revert-current': (function(_this) {
          return function() {
            return _this.revertCurrent();
          };
        })(this)
      }));
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(_arg) {
          var file, resolved, total;
          total = _arg.total, resolved = _arg.resolved, file = _arg.file;
          if (file === _this.editor.getPath() && total === resolved) {
            return _this.conflictsResolved();
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidCompleteConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
      return this.subs.add(this.pkg.onDidQuitConflictResolution((function(_this) {
        return function() {
          return _this.cleanup();
        };
      })(this)));
    };

    ConflictedEditor.prototype.cleanup = function() {
      var c, m, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      if (this.editor != null) {
        atom.views.getView(this.editor).classList.remove('conflicted');
      }
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = c.markers();
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          m = _ref2[_j];
          m.destroy();
        }
      }
      _ref3 = this.coveringViews;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        v.remove();
      }
      return this.subs.dispose();
    };

    ConflictedEditor.prototype.conflictsResolved = function() {
      return atom.workspace.addTopPanel({
        item: new ResolverView(this.editor, this.state, this.pkg)
      });
    };

    ConflictedEditor.prototype.detectDirty = function() {
      var c, potentials, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      potentials = [];
      _ref1 = this.editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _ref2 = this.coveringViews;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          v = _ref2[_j];
          if (v.includesCursor(c)) {
            potentials.push(v);
          }
        }
      }
      _ref3 = _.uniq(potentials);
      _results = [];
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        v = _ref3[_k];
        _results.push(v.detectDirty());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptCurrent = function() {
      var duplicates, seen, side, sides, _i, _j, _len, _len1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      sides = this.active();
      duplicates = [];
      seen = {};
      for (_i = 0, _len = sides.length; _i < _len; _i++) {
        side = sides[_i];
        if (side.conflict in seen) {
          duplicates.push(side);
          duplicates.push(seen[side.conflict]);
        }
        seen[side.conflict] = side;
      }
      sides = _.difference(sides, duplicates);
      _results = [];
      for (_j = 0, _len1 = sides.length; _j < _len1; _j++) {
        side = sides[_j];
        _results.push(side.resolve());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptOurs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(side.conflict.ours.resolve());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptTheirs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(side.conflict.theirs.resolve());
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptOursThenTheirs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(this.combineSides(side.conflict.ours, side.conflict.theirs));
      }
      return _results;
    };

    ConflictedEditor.prototype.acceptTheirsThenOurs = function() {
      var side, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push(this.combineSides(side.conflict.theirs, side.conflict.ours));
      }
      return _results;
    };

    ConflictedEditor.prototype.nextUnresolved = function() {
      var c, final, firstAfter, lastCursor, n, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      final = _.last(this.active());
      if (final != null) {
        n = final.conflict.navigator.nextUnresolved();
        if (n != null) {
          return this.focusConflict(n);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        lastCursor = _.last(orderedCursors);
        if (lastCursor == null) {
          return;
        }
        pos = lastCursor.getBufferPosition();
        firstAfter = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isGreaterThanOrEqual(pos) && (firstAfter == null)) {
            firstAfter = c;
          }
        }
        if (firstAfter == null) {
          return;
        }
        if (firstAfter.isResolved()) {
          target = firstAfter.navigator.nextUnresolved();
        } else {
          target = firstAfter;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.previousUnresolved = function() {
      var c, firstCursor, initial, lastBefore, orderedCursors, p, pos, target, _i, _len, _ref1;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      initial = _.first(this.active());
      if (initial != null) {
        p = initial.conflict.navigator.previousUnresolved();
        if (p != null) {
          return this.focusConflict(p);
        }
      } else {
        orderedCursors = _.sortBy(this.editor.getCursors(), function(c) {
          return c.getBufferPosition().row;
        });
        firstCursor = _.first(orderedCursors);
        if (firstCursor == null) {
          return;
        }
        pos = firstCursor.getBufferPosition();
        lastBefore = null;
        _ref1 = this.conflicts;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          p = c.ours.marker.getBufferRange().start;
          if (p.isLessThanOrEqual(pos)) {
            lastBefore = c;
          }
        }
        if (lastBefore == null) {
          return;
        }
        if (lastBefore.isResolved()) {
          target = lastBefore.navigator.previousUnresolved();
        } else {
          target = lastBefore;
        }
        if (target == null) {
          return;
        }
        return this.focusConflict(target);
      }
    };

    ConflictedEditor.prototype.revertCurrent = function() {
      var side, view, _i, _len, _ref1, _results;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      _ref1 = this.active();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        side = _ref1[_i];
        _results.push((function() {
          var _j, _len1, _ref2, _results1;
          _ref2 = this.coveringViews;
          _results1 = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            view = _ref2[_j];
            if (view.conflict() === side.conflict) {
              if (view.isDirty()) {
                _results1.push(view.revert());
              } else {
                _results1.push(void 0);
              }
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ConflictedEditor.prototype.active = function() {
      var c, matching, p, positions, _i, _j, _len, _len1, _ref1;
      positions = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          _results.push(c.getBufferPosition());
        }
        return _results;
      }).call(this);
      matching = [];
      _ref1 = this.conflicts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        for (_j = 0, _len1 = positions.length; _j < _len1; _j++) {
          p = positions[_j];
          if (c.ours.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.ours);
          }
          if (c.theirs.marker.getBufferRange().containsPoint(p)) {
            matching.push(c.theirs);
          }
        }
      }
      return matching;
    };

    ConflictedEditor.prototype.combineSides = function(first, second) {
      var e, insertPoint, text;
      text = this.editor.getTextInBufferRange(second.marker.getBufferRange());
      e = first.marker.getBufferRange().end;
      insertPoint = this.editor.setTextInBufferRange([e, e], text).end;
      first.marker.setHeadBufferPosition(insertPoint);
      first.followingMarker.setTailBufferPosition(insertPoint);
      return first.resolve();
    };

    ConflictedEditor.prototype.focusConflict = function(conflict) {
      var st;
      st = conflict.ours.marker.getBufferRange().start;
      this.editor.scrollToBufferPosition(st, {
        center: true
      });
      return this.editor.setCursorBufferPosition(st, {
        autoscroll: false
      });
    };

    return ConflictedEditor;

  })();

  module.exports = {
    ConflictedEditor: ConflictedEditor
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9jb25mbGljdGVkLWVkaXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEdBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxXQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUZWLENBQUE7O0FBQUEsRUFJQyxXQUFZLE9BQUEsQ0FBUSxZQUFSLEVBQVosUUFKRCxDQUFBOztBQUFBLEVBTUMsV0FBWSxPQUFBLENBQVEsa0JBQVIsRUFBWixRQU5ELENBQUE7O0FBQUEsRUFPQyxpQkFBa0IsT0FBQSxDQUFRLHdCQUFSLEVBQWxCLGNBUEQsQ0FBQTs7QUFBQSxFQVFDLGVBQWdCLE9BQUEsQ0FBUSxzQkFBUixFQUFoQixZQVJELENBQUE7O0FBQUEsRUFZTTtBQVNTLElBQUEsMEJBQUUsS0FBRixFQUFVLEdBQVYsRUFBZ0IsTUFBaEIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFFBQUEsS0FDYixDQUFBO0FBQUEsTUFEb0IsSUFBQyxDQUFBLE1BQUEsR0FDckIsQ0FBQTtBQUFBLE1BRDBCLElBQUMsQ0FBQSxTQUFBLE1BQzNCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsR0FBQSxDQUFBLG1CQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEVBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFGYixDQURXO0lBQUEsQ0FBYjs7QUFBQSwrQkFZQSxJQUFBLEdBQU0sU0FB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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/conflicted-editor.coffee
