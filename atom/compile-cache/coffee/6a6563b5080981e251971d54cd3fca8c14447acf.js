(function() {
  var $, ConflictedEditor, GitBridge, util, _;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  ConflictedEditor = require('../lib/conflicted-editor').ConflictedEditor;

  GitBridge = require('../lib/git-bridge').GitBridge;

  util = require('./util');

  describe('ConflictedEditor', function() {
    var cursors, detectDirty, editor, editorView, linesForMarker, m, pkg, state, _ref;
    _ref = [], editorView = _ref[0], editor = _ref[1], state = _ref[2], m = _ref[3], pkg = _ref[4];
    cursors = function() {
      var c, _i, _len, _ref1, _results;
      _ref1 = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _results.push(c.getBufferPosition().toArray());
      }
      return _results;
    };
    detectDirty = function() {
      var sv, _i, _len, _ref1, _results;
      _ref1 = m.coveringViews;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        sv = _ref1[_i];
        if ('detectDirty' in sv) {
          _results.push(sv.detectDirty());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    linesForMarker = function(marker) {
      var fromBuffer, fromScreen, result, row, toBuffer, toScreen, _i, _len, _ref1;
      fromBuffer = marker.getTailBufferPosition();
      fromScreen = editor.screenPositionForBufferPosition(fromBuffer);
      toBuffer = marker.getHeadBufferPosition();
      toScreen = editor.screenPositionForBufferPosition(toBuffer);
      result = $();
      _ref1 = _.range(fromScreen.row, toScreen.row);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        row = _ref1[_i];
        result = result.add(editorView.component.lineNodeForScreenRow(row));
      }
      return result;
    };
    beforeEach(function() {
      var done;
      pkg = util.pkgEmitter();
      done = false;
      GitBridge.locateGitAnd(function(err) {
        if (err != null) {
          throw err;
        }
        return done = true;
      });
      return waitsFor(function() {
        return done;
      });
    });
    afterEach(function() {
      pkg.dispose();
      return m != null ? m.cleanup() : void 0;
    });
    describe('with a merge conflict', function() {
      beforeEach(function() {
        return util.openPath("triple-2way-diff.txt", function(v) {
          editorView = v;
          editorView.getFirstVisibleScreenRow = function() {
            return 0;
          };
          editorView.getLastVisibleScreenRow = function() {
            return 999;
          };
          editor = editorView.getModel();
          state = {
            isRebase: false,
            repo: {
              getWorkingDirectory: function() {
                return "";
              },
              relativize: function(filepath) {
                return filepath;
              }
            }
          };
          m = new ConflictedEditor(state, pkg, editor);
          return m.mark();
        });
      });
      it('attaches two SideViews and a NavigationView for each conflict', function() {
        expect($(editorView).find('.side').length).toBe(6);
        return expect($(editorView).find('.navigation').length).toBe(3);
      });
      it('locates the correct lines', function() {
        var lines;
        lines = linesForMarker(m.conflicts[1].ours.marker);
        return expect(lines.text()).toBe("My middle changes");
      });
      it('applies the "ours" class to our sides of conflicts', function() {
        var lines;
        lines = linesForMarker(m.conflicts[0].ours.marker);
        return expect(lines.hasClass('conflict-ours')).toBe(true);
      });
      it('applies the "theirs" class to their sides of conflicts', function() {
        var lines;
        lines = linesForMarker(m.conflicts[0].theirs.marker);
        return expect(lines.hasClass('conflict-theirs')).toBe(true);
      });
      it('applies the "dirty" class to modified sides', function() {
        var lines;
        editor.setCursorBufferPosition([14, 0]);
        editor.insertText("Make conflict 1 dirty");
        detectDirty();
        lines = linesForMarker(m.conflicts[1].ours.marker);
        expect(lines.hasClass('conflict-dirty')).toBe(true);
        return expect(lines.hasClass('conflict-ours')).toBe(false);
      });
      it('broadcasts the onDidResolveConflict event', function() {
        var event;
        event = null;
        pkg.onDidResolveConflict(function(e) {
          return event = e;
        });
        m.conflicts[2].theirs.resolve();
        expect(event.file).toBe(editor.getPath());
        expect(event.total).toBe(3);
        expect(event.resolved).toBe(1);
        return expect(event.source).toBe(m);
      });
      it('tracks the active conflict side', function() {
        editor.setCursorBufferPosition([11, 0]);
        expect(m.active()).toEqual([]);
        editor.setCursorBufferPosition([14, 5]);
        return expect(m.active()).toEqual([m.conflicts[1].ours]);
      });
      describe('with an active merge conflict', function() {
        var active;
        active = [][0];
        beforeEach(function() {
          editor.setCursorBufferPosition([14, 5]);
          return active = m.conflicts[1];
        });
        it('accepts the current side with merge-conflicts:accept-current', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBe(active.ours);
        });
        it("does nothing if you have cursors in both sides", function() {
          editor.addCursorAtBufferPosition([16, 2]);
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBeNull();
        });
        it('accepts "ours" on merge-conflicts:accept-ours', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBe(active.ours);
        });
        it('accepts "theirs" on merge-conflicts:accept-theirs', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-theirs');
          return expect(active.resolution).toBe(active.theirs);
        });
        it('jumps to the next unresolved on merge-conflicts:next-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:next-unresolved');
          return expect(cursors()).toEqual([[22, 0]]);
        });
        it('jumps to the previous unresolved on merge-conflicts:previous-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:previous-unresolved');
          return expect(cursors()).toEqual([[5, 0]]);
        });
        it('reverts a dirty hunk on merge-conflicts:revert-current', function() {
          editor.insertText('this is a change');
          detectDirty();
          expect(active.ours.isDirty).toBe(true);
          atom.commands.dispatch(editorView, 'merge-conflicts:revert-current');
          detectDirty();
          return expect(active.ours.isDirty).toBe(false);
        });
        it('accepts ours-then-theirs on merge-conflicts:ours-then-theirs', function() {
          var t;
          atom.commands.dispatch(editorView, 'merge-conflicts:ours-then-theirs');
          expect(active.resolution).toBe(active.ours);
          t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
          return expect(t).toBe("My middle changes\nYour middle changes\n");
        });
        return it('accepts theirs-then-ours on merge-conflicts:theirs-then-ours', function() {
          var t;
          atom.commands.dispatch(editorView, 'merge-conflicts:theirs-then-ours');
          expect(active.resolution).toBe(active.theirs);
          t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
          return expect(t).toBe("Your middle changes\nMy middle changes\n");
        });
      });
      describe('without an active conflict', function() {
        beforeEach(function() {
          return editor.setCursorBufferPosition([11, 6]);
        });
        it('no-ops the resolution commands', function() {
          var c, e, _i, _len, _ref1, _results;
          _ref1 = ['accept-current', 'accept-ours', 'accept-theirs', 'revert-current'];
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            e = _ref1[_i];
            atom.commands.dispatch(editorView, "merge-conflicts:" + e);
            expect(m.active()).toEqual([]);
            _results.push((function() {
              var _j, _len1, _ref2, _results1;
              _ref2 = m.conflicts;
              _results1 = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                c = _ref2[_j];
                _results1.push(expect(c.isResolved()).toBe(false));
              }
              return _results1;
            })());
          }
          return _results;
        });
        it('jumps to the next unresolved on merge-conflicts:next-unresolved', function() {
          expect(m.active()).toEqual([]);
          atom.commands.dispatch(editorView, 'merge-conflicts:next-unresolved');
          return expect(cursors()).toEqual([[14, 0]]);
        });
        return it('jumps to the previous unresolved on merge-conflicts:next-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:previous-unresolved');
          return expect(cursors()).toEqual([[5, 0]]);
        });
      });
      describe('when the resolution is complete', function() {
        beforeEach(function() {
          var c, _i, _len, _ref1, _results;
          _ref1 = m.conflicts;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            _results.push(c.ours.resolve());
          }
          return _results;
        });
        it('removes all of the CoveringViews', function() {
          expect($(editorView).find('.overlayer .side').length).toBe(0);
          return expect($(editorView).find('.overlayer .navigation').length).toBe(0);
        });
        return it('appends a ResolverView to the workspace', function() {
          var workspaceView;
          workspaceView = atom.views.getView(atom.workspace);
          return expect($(workspaceView).find('.resolver').length).toBe(1);
        });
      });
      return describe('when all resolutions are complete', function() {
        beforeEach(function() {
          var c, _i, _len, _ref1;
          _ref1 = m.conflicts;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            c.theirs.resolve();
          }
          return pkg.didCompleteConflictResolution();
        });
        it('destroys all Conflict markers', function() {
          var c, marker, _i, _len, _ref1, _results;
          _ref1 = m.conflicts;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            _results.push((function() {
              var _j, _len1, _ref2, _results1;
              _ref2 = c.markers();
              _results1 = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                marker = _ref2[_j];
                _results1.push(expect(marker.isDestroyed()).toBe(true));
              }
              return _results1;
            })());
          }
          return _results;
        });
        return it('removes the .conflicted class', function() {
          return expect($(editorView).hasClass('conflicted')).toBe(false);
        });
      });
    });
    return describe('with a rebase conflict', function() {
      var active;
      active = [][0];
      beforeEach(function() {
        return util.openPath("rebase-2way-diff.txt", function(v) {
          editorView = v;
          editorView.getFirstVisibleScreenRow = function() {
            return 0;
          };
          editorView.getLastVisibleScreenRow = function() {
            return 999;
          };
          editor = editorView.getModel();
          state = {
            isRebase: true,
            repo: {
              getWorkingDirectory: function() {
                return "";
              },
              relativize: function(filepath) {
                return filepath;
              }
            }
          };
          m = new ConflictedEditor(state, pkg, editor);
          m.mark();
          editor.setCursorBufferPosition([3, 14]);
          return active = m.conflicts[0];
        });
      });
      it('accepts theirs-then-ours on merge-conflicts:theirs-then-ours', function() {
        var t;
        atom.commands.dispatch(editorView, 'merge-conflicts:theirs-then-ours');
        expect(active.resolution).toBe(active.theirs);
        t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
        return expect(t).toBe("These are your changes\nThese are my changes\n");
      });
      return it('accepts ours-then-theirs on merge-conflicts:ours-then-theirs', function() {
        var t;
        atom.commands.dispatch(editorView, 'merge-conflicts:ours-then-theirs');
        expect(active.resolution).toBe(active.ours);
        t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
        return expect(t).toBe("These are my changes\nThese are your changes\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL3NwZWMvY29uZmxpY3RlZC1lZGl0b3Itc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxXQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFHQyxtQkFBb0IsT0FBQSxDQUFRLDBCQUFSLEVBQXBCLGdCQUhELENBQUE7O0FBQUEsRUFJQyxZQUFhLE9BQUEsQ0FBUSxtQkFBUixFQUFiLFNBSkQsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUxQLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsNkVBQUE7QUFBQSxJQUFBLE9BQXNDLEVBQXRDLEVBQUMsb0JBQUQsRUFBYSxnQkFBYixFQUFxQixlQUFyQixFQUE0QixXQUE1QixFQUErQixhQUEvQixDQUFBO0FBQUEsSUFFQSxPQUFBLEdBQVUsU0FBQSxHQUFBO0FBQUcsVUFBQSw0QkFBQTtBQUFBO0FBQUE7V0FBQSw0Q0FBQTtzQkFBQTtBQUFBLHNCQUFBLENBQUMsQ0FBQyxpQkFBRixDQUFBLENBQXFCLENBQUMsT0FBdEIsQ0FBQSxFQUFBLENBQUE7QUFBQTtzQkFBSDtJQUFBLENBRlYsQ0FBQTtBQUFBLElBSUEsV0FBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsNkJBQUE7QUFBQTtBQUFBO1dBQUEsNENBQUE7dUJBQUE7QUFDRSxRQUFBLElBQW9CLGFBQUEsSUFBaUIsRUFBckM7d0JBQUEsRUFBRSxDQUFDLFdBQUgsQ0FBQSxHQUFBO1NBQUEsTUFB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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/spec/conflicted-editor-spec.coffee
