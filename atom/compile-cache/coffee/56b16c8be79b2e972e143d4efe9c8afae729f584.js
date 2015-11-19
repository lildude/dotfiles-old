(function() {
  var $, CompositeDisposable, ConflictedEditor, GitBridge, MergeConflictsView, MergeState, ResolverView, View, handleErr, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  path = require('path');

  GitBridge = require('../git-bridge').GitBridge;

  MergeState = require('../merge-state').MergeState;

  ConflictedEditor = require('../conflicted-editor').ConflictedEditor;

  ResolverView = require('./resolver-view').ResolverView;

  handleErr = require('./error-view').handleErr;

  MergeConflictsView = (function(_super) {
    __extends(MergeConflictsView, _super);

    function MergeConflictsView() {
      return MergeConflictsView.__super__.constructor.apply(this, arguments);
    }

    MergeConflictsView.prototype.instance = null;

    MergeConflictsView.content = function(state, pkg) {
      return this.div({
        "class": 'merge-conflicts tool-panel panel-bottom padded clearfix'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.text('Conflicts');
            _this.span({
              "class": 'pull-right icon icon-fold',
              click: 'minimize'
            }, 'Hide');
            return _this.span({
              "class": 'pull-right icon icon-unfold',
              click: 'restore'
            }, 'Show');
          });
          return _this.div({
            outlet: 'body'
          }, function() {
            _this.div({
              "class": 'conflict-list'
            }, function() {
              return _this.ul({
                "class": 'block list-group',
                outlet: 'pathList'
              }, function() {
                var message, p, _i, _len, _ref1, _ref2, _results;
                _ref1 = state.conflicts;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  _ref2 = _ref1[_i], p = _ref2.path, message = _ref2.message;
                  _results.push(_this.li({
                    click: 'navigate',
                    "data-path": p,
                    "class": 'list-item navigate'
                  }, function() {
                    _this.span({
                      "class": 'inline-block icon icon-diff-modified status-modified path'
                    }, p);
                    return _this.div({
                      "class": 'pull-right'
                    }, function() {
                      _this.button({
                        click: 'stageFile',
                        "class": 'btn btn-xs btn-success inline-block-tight stage-ready',
                        style: 'display: none'
                      }, 'Stage');
                      _this.span({
                        "class": 'inline-block text-subtle'
                      }, message);
                      _this.progress({
                        "class": 'inline-block',
                        max: 100,
                        value: 0
                      });
                      return _this.span({
                        "class": 'inline-block icon icon-dash staged'
                      });
                    });
                  }));
                }
                return _results;
              });
            });
            return _this.div({
              "class": 'footer block pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-sm',
                click: 'quit'
              }, 'Quit');
            });
          });
        };
      })(this));
    };

    MergeConflictsView.prototype.initialize = function(state, pkg) {
      this.state = state;
      this.pkg = pkg;
      this.subs = new CompositeDisposable;
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(event) {
          var found, li, listElement, p, progress, _i, _len, _ref1;
          p = _this.state.repo.relativize(event.file);
          found = false;
          _ref1 = _this.pathList.children();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            listElement = _ref1[_i];
            li = $(listElement);
            if (li.data('path') === p) {
              found = true;
              progress = li.find('progress')[0];
              progress.max = event.total;
              progress.value = event.resolved;
              if (event.total === event.resolved) {
                li.find('.stage-ready').show();
              }
            }
          }
          if (!found) {
            return console.error("Unrecognized conflict path: " + p);
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidStageFile((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, {
        'merge-conflicts:entire-file-ours': this.sideResolver('ours'),
        'merge-conflicts:entire-file-theirs': this.sideResolver('theirs')
      }));
    };

    MergeConflictsView.prototype.navigate = function(event, element) {
      var fullPath, repoPath;
      repoPath = element.find(".path").text();
      fullPath = path.join(this.state.repo.getWorkingDirectory(), repoPath);
      return atom.workspace.open(fullPath);
    };

    MergeConflictsView.prototype.minimize = function() {
      this.addClass('minimized');
      return this.body.hide('fast');
    };

    MergeConflictsView.prototype.restore = function() {
      this.removeClass('minimized');
      return this.body.show('fast');
    };

    MergeConflictsView.prototype.quit = function() {
      var detail;
      this.pkg.didQuitConflictResolution();
      detail = "Careful, you've still got conflict markers left!\n";
      if (this.state.isRebase) {
        detail += '"git rebase --abort"';
      } else {
        detail += '"git merge --abort"';
      }
      detail += " if you just want to give up on this one.";
      return this.finish(function() {
        return atom.notifications.addWarning("Maybe Later", {
          detail: detail,
          dismissable: true
        });
      });
    };

    MergeConflictsView.prototype.refresh = function() {
      return this.state.reread((function(_this) {
        return function(err, state) {
          var detail, icon, item, p, _i, _len, _ref1;
          if (handleErr(err)) {
            return;
          }
          _ref1 = _this.pathList.find('li');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            p = $(item).data('path');
            icon = $(item).find('.staged');
            icon.removeClass('icon-dash icon-check text-success');
            if (_.contains(_this.state.conflictPaths(), p)) {
              icon.addClass('icon-dash');
            } else {
              icon.addClass('icon-check text-success');
              _this.pathList.find("li[data-path='" + p + "'] .stage-ready").hide();
            }
          }
          if (_this.state.isEmpty()) {
            _this.pkg.didCompleteConflictResolution();
            detail = "That's everything. ";
            if (_this.state.isRebase) {
              detail += '"git rebase --continue" at will to resume rebasing.';
            } else {
              detail += '"git commit" at will to finish the merge.';
            }
            return _this.finish(function() {
              return atom.notifications.addSuccess("Merge Complete", {
                detail: detail,
                dismissable: true
              });
            });
          }
        };
      })(this));
    };

    MergeConflictsView.prototype.finish = function(andThen) {
      this.subs.dispose();
      this.hide('fast', (function(_this) {
        return function() {
          MergeConflictsView.instance = null;
          return _this.remove();
        };
      })(this));
      return andThen();
    };

    MergeConflictsView.prototype.sideResolver = function(side) {
      return (function(_this) {
        return function(event) {
          var p;
          p = $(event.target).closest('li').data('path');
          return GitBridge.checkoutSide(_this.state.repo, side, p, function(err) {
            var full;
            if (handleErr(err)) {
              return;
            }
            full = path.join(_this.state.repo.getWorkingDirectory(), p);
            _this.pkg.didResolveConflict({
              file: full,
              total: 1,
              resolved: 1
            });
            return atom.workspace.open(p);
          });
        };
      })(this);
    };

    MergeConflictsView.prototype.stageFile = function(event, element) {
      var e, filePath, repoPath, _i, _len, _ref1;
      repoPath = element.closest('li').data('path');
      filePath = path.join(GitBridge.getActiveRepo().getWorkingDirectory(), repoPath);
      _ref1 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        if (e.getPath() === filePath) {
          e.save();
        }
      }
      return GitBridge.add(this.state.repo, repoPath, (function(_this) {
        return function(err) {
          if (handleErr(err)) {
            return;
          }
          return _this.pkg.didStageFile({
            file: filePath
          });
        };
      })(this));
    };

    MergeConflictsView.detect = function(pkg) {
      var repo;
      if (this.instance != null) {
        return;
      }
      repo = GitBridge.getActiveRepo();
      if (repo == null) {
        atom.notifications.addWarning("No git repository found", {
          detail: "Tip: if you have multiple projects open, open an editor in the one containing conflicts."
        });
        return;
      }
      return MergeState.read(repo, (function(_this) {
        return function(err, state) {
          var view;
          if (handleErr(err)) {
            return;
          }
          if (!state.isEmpty()) {
            view = new MergeConflictsView(state, pkg);
            _this.instance = view;
            atom.workspace.addBottomPanel({
              item: view
            });
            return _this.instance.subs.add(atom.workspace.observeTextEditors(function(editor) {
              return _this.markConflictsIn(state, editor, pkg);
            }));
          } else {
            return atom.notifications.addInfo("Nothing to Merge", {
              detail: "No conflicts here!",
              dismissable: true
            });
          }
        };
      })(this));
    };

    MergeConflictsView.markConflictsIn = function(state, editor, pkg) {
      var e, fullPath, repoPath;
      if (state.isEmpty()) {
        return;
      }
      fullPath = editor.getPath();
      repoPath = state.repo.relativize(fullPath);
      if (repoPath == null) {
        return;
      }
      if (!_.contains(state.conflictPaths(), repoPath)) {
        return;
      }
      e = new ConflictedEditor(state, pkg, editor);
      return e.mark();
    };

    return MergeConflictsView;

  })(View);

  module.exports = {
    MergeConflictsView: MergeConflictsView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L21lcmdlLWNvbmZsaWN0cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpSUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtDLFlBQWEsT0FBQSxDQUFRLGVBQVIsRUFBYixTQUxELENBQUE7O0FBQUEsRUFNQyxhQUFjLE9BQUEsQ0FBUSxnQkFBUixFQUFkLFVBTkQsQ0FBQTs7QUFBQSxFQU9DLG1CQUFvQixPQUFBLENBQVEsc0JBQVIsRUFBcEIsZ0JBUEQsQ0FBQTs7QUFBQSxFQVNDLGVBQWdCLE9BQUEsQ0FBUSxpQkFBUixFQUFoQixZQVRELENBQUE7O0FBQUEsRUFVQyxZQUFhLE9BQUEsQ0FBUSxjQUFSLEVBQWIsU0FWRCxDQUFBOztBQUFBLEVBWU07QUFFSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSxJQUVBLGtCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsS0FBRCxFQUFRLEdBQVIsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx5REFBUDtPQUFMLEVBQXVFLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDckUsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sZUFBUDtXQUFMLEVBQTZCLFNBQUEsR0FBQTtBQUMzQixZQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sV0FBTixDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBTywyQkFBUDtBQUFBLGNBQW9DLEtBQUEsRUFBTyxVQUEzQzthQUFOLEVBQTZELE1BQTdELENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxPQUFBLEVBQU8sNkJBQVA7QUFBQSxjQUFzQyxLQUFBLEVBQU8sU0FBN0M7YUFBTixFQUE4RCxNQUE5RCxFQUgyQjtVQUFBLENBQTdCLENBQUEsQ0FBQTtpQkFJQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQVEsTUFBUjtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxlQUFQO2FBQUwsRUFBNkIsU0FBQSxHQUFBO3FCQUMzQixLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsZ0JBQTJCLE1BQUEsRUFBUSxVQUFuQztlQUFKLEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxvQkFBQSw0Q0FBQTtBQUFBO0FBQUE7cUJBQUEsNENBQUEsR0FBQTtBQUNFLHFDQURTLFVBQU4sTUFBUyxnQkFBQSxPQUNaLENBQUE7QUFBQSxnQ0FBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsb0JBQUEsS0FBQSxFQUFPLFVBQVA7QUFBQSxvQkFBbUIsV0FBQSxFQUFhLENBQWhDO0FBQUEsb0JBQW1DLE9BQUEsRUFBTyxvQkFBMUM7bUJBQUosRUFBb0UsU0FBQSxHQUFBO0FBQ2xFLG9CQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxzQkFBQSxPQUFBLEVBQU8sMkRBQVA7cUJBQU4sRUFBMEUsQ0FBMUUsQ0FBQSxDQUFBOzJCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxzQkFBQSxPQUFBLEVBQU8sWUFBUDtxQkFBTCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsc0JBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLHdCQUFBLEtBQUEsRUFBTyxXQUFQO0FBQUEsd0JBQW9CLE9BQUEsRUFBTyx1REFBM0I7QUFBQSx3QkFBb0YsS0FBQSxFQUFPLGVBQTNGO3VCQUFSLEVBQW9ILE9BQXBILENBQUEsQ0FBQTtBQUFBLHNCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSx3QkFBQSxPQUFBLEVBQU8sMEJBQVA7dUJBQU4sRUFBeUMsT0FBekMsQ0FEQSxDQUFBO0FBQUEsc0JBRUEsS0FBQyxDQUFBLFFBQUQsQ0FBVTtBQUFBLHdCQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsd0JBQXVCLEdBQUEsRUFBSyxHQUE1QjtBQUFBLHdCQUFpQyxLQUFBLEVBQU8sQ0FBeEM7dUJBQVYsQ0FGQSxDQUFBOzZCQUdBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSx3QkFBQSxPQUFBLEVBQU8sb0NBQVA7dUJBQU4sRUFKd0I7b0JBQUEsQ0FBMUIsRUFGa0U7a0JBQUEsQ0FBcEUsRUFBQSxDQURGO0FBQUE7Z0NBRGlEO2NBQUEsQ0FBbkQsRUFEMkI7WUFBQSxDQUE3QixDQUFBLENBQUE7bUJBVUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLHlCQUFQO2FBQUwsRUFBdUMsU0FBQSxHQUFBO3FCQUNyQyxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFlBQVA7QUFBQSxnQkFBcUIsS0FBQSxFQUFPLE1BQTVCO2VBQVIsRUFBNEMsTUFBNUMsRUFEcUM7WUFBQSxDQUF2QyxFQVhtQjtVQUFBLENBQXJCLEVBTHFFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkUsRUFEUTtJQUFBLENBRlYsQ0FBQTs7QUFBQSxpQ0FzQkEsVUFBQSxHQUFZLFNBQUUsS0FBRixFQUFVLEdBQVYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFFBQUEsS0FDWixDQUFBO0FBQUEsTUFEbUIsSUFBQyxDQUFBLE1BQUEsR0FDcEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxHQUFBLENBQUEsbUJBQVIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLEdBQUcsQ0FBQyxvQkFBTCxDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDbEMsY0FBQSxvREFBQTtBQUFBLFVBQUEsQ0FBQSxHQUFJLEtBQUMsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVosQ0FBdUIsS0FBSyxDQUFDLElBQTdCLENBQUosQ0FBQTtBQUFBLFVBQ0EsS0FBQSxHQUFRLEtBRFIsQ0FBQTtBQUVBO0FBQUEsZUFBQSw0Q0FBQTtvQ0FBQTtBQUNFLFlBQUEsRUFBQSxHQUFLLENBQUEsQ0FBRSxXQUFGLENBQUwsQ0FBQTtBQUNBLFlBQUEsSUFBRyxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQVIsQ0FBQSxLQUFtQixDQUF0QjtBQUNFLGNBQUEsS0FBQSxHQUFRLElBQVIsQ0FBQTtBQUFBLGNBRUEsUUFBQSxHQUFXLEVBQUUsQ0FBQyxJQUFILENBQVEsVUFBUixDQUFvQixDQUFBLENBQUEsQ0FGL0IsQ0FBQTtBQUFBLGNBR0EsUUFBUSxDQUFDLEdBQVQsR0FBZSxLQUFLLENBQUMsS0FIckIsQ0FBQTtBQUFBLGNBSUEsUUFBUSxDQUFDLEtBQVQsR0FBaUIsS0FBSyxDQUFDLFFBSnZCLENBQUE7QUFNQSxjQUFBLElBQWtDLEtBQUssQ0FBQyxLQUFOLEtBQWUsS0FBSyxDQUFDLFFBQXZEO0FBQUEsZ0JBQUEsRUFBRSxDQUFDLElBQUgsQ0FBUSxjQUFSLENBQXVCLENBQUMsSUFBeEIsQ0FBQSxDQUFBLENBQUE7ZUFQRjthQUZGO0FBQUEsV0FGQTtBQWFBLFVBQUEsSUFBQSxDQUFBLEtBQUE7bUJBQ0UsT0FBTyxDQUFDLEtBQVIsQ0FBZSw4QkFBQSxHQUE4QixDQUE3QyxFQURGO1dBZGtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBVixDQUZBLENBQUE7QUFBQSxNQW1CQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsR0FBRyxDQUFDLGNBQUwsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixDQUFWLENBbkJBLENBQUE7YUFxQkEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNSO0FBQUEsUUFBQSxrQ0FBQSxFQUFvQyxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsQ0FBcEM7QUFBQSxRQUNBLG9DQUFBLEVBQXNDLElBQUMsQ0FBQSxZQUFELENBQWMsUUFBZCxDQUR0QztPQURRLENBQVYsRUF0QlU7SUFBQSxDQXRCWixDQUFBOztBQUFBLGlDQWdEQSxRQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO0FBQ1IsVUFBQSxrQkFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixDQUFxQixDQUFDLElBQXRCLENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBWixDQUFBLENBQVYsRUFBNkMsUUFBN0MsQ0FEWCxDQUFBO2FBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBSFE7SUFBQSxDQWhEVixDQUFBOztBQUFBLGlDQXFEQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsUUFBRCxDQUFVLFdBQVYsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsTUFBWCxFQUZRO0lBQUEsQ0FyRFYsQ0FBQTs7QUFBQSxpQ0F5REEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxXQUFiLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLE1BQVgsRUFGTztJQUFBLENBekRULENBQUE7O0FBQUEsaUNBNkRBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLE1BQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMseUJBQUwsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxvREFGVCxDQUFBO0FBR0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBVjtBQUNFLFFBQUEsTUFBQSxJQUFVLHNCQUFWLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxNQUFBLElBQVUscUJBQVYsQ0FIRjtPQUhBO0FBQUEsTUFPQSxNQUFBLElBQVUsMkNBUFYsQ0FBQTthQVNBLElBQUMsQ0FBQSxNQUFELENBQVEsU0FBQSxHQUFBO2VBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QixhQUE5QixFQUNFO0FBQUEsVUFBQSxNQUFBLEVBQVEsTUFBUjtBQUFBLFVBQ0EsV0FBQSxFQUFhLElBRGI7U0FERixFQURNO01BQUEsQ0FBUixFQVZJO0lBQUEsQ0E3RE4sQ0FBQTs7QUFBQSxpQ0E0RUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTSxLQUFOLEdBQUE7QUFDWixjQUFBLHNDQUFBO0FBQUEsVUFBQSxJQUFVLFNBQUEsQ0FBVSxHQUFWLENBQVY7QUFBQSxrQkFBQSxDQUFBO1dBQUE7QUFJQTtBQUFBLGVBQUEsNENBQUE7NkJBQUE7QUFDRSxZQUFBLENBQUEsR0FBSSxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLE1BQWIsQ0FBSixDQUFBO0FBQUEsWUFDQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFiLENBRFAsQ0FBQTtBQUFBLFlBRUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsbUNBQWpCLENBRkEsQ0FBQTtBQUdBLFlBQUEsSUFBRyxDQUFDLENBQUMsUUFBRixDQUFXLEtBQUMsQ0FBQSxLQUFLLENBQUMsYUFBUCxDQUFBLENBQVgsRUFBbUMsQ0FBbkMsQ0FBSDtBQUNFLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxXQUFkLENBQUEsQ0FERjthQUFBLE1BQUE7QUFHRSxjQUFBLElBQUksQ0FBQyxRQUFMLENBQWMseUJBQWQsQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZ0IsZ0JBQUEsR0FBZ0IsQ0FBaEIsR0FBa0IsaUJBQWxDLENBQW1ELENBQUMsSUFBcEQsQ0FBQSxDQURBLENBSEY7YUFKRjtBQUFBLFdBSkE7QUFjQSxVQUFBLElBQUcsS0FBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUEsQ0FBSDtBQUNFLFlBQUEsS0FBQyxDQUFBLEdBQUcsQ0FBQyw2QkFBTCxDQUFBLENBQUEsQ0FBQTtBQUFBLFlBRUEsTUFBQSxHQUFTLHFCQUZULENBQUE7QUFHQSxZQUFBLElBQUcsS0FBQyxDQUFBLEtBQUssQ0FBQyxRQUFWO0FBQ0UsY0FBQSxNQUFBLElBQVUscURBQVYsQ0FERjthQUFBLE1BQUE7QUFHRSxjQUFBLE1BQUEsSUFBVSwyQ0FBVixDQUhGO2FBSEE7bUJBUUEsS0FBQyxDQUFBLE1BQUQsQ0FBUSxTQUFBLEdBQUE7cUJBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QixnQkFBOUIsRUFDRTtBQUFBLGdCQUFBLE1BQUEsRUFBUSxNQUFSO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLElBRGI7ZUFERixFQURNO1lBQUEsQ0FBUixFQVRGO1dBZlk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLEVBRE87SUFBQSxDQTVFVCxDQUFBOztBQUFBLGlDQTBHQSxNQUFBLEdBQVEsU0FBQyxPQUFELEdBQUE7QUFDTixNQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLEVBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNaLFVBQUEsa0JBQWtCLENBQUMsUUFBbkIsR0FBOEIsSUFBOUIsQ0FBQTtpQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBRlk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBRkEsQ0FBQTthQU1BLE9BQUEsQ0FBQSxFQVBNO0lBQUEsQ0ExR1IsQ0FBQTs7QUFBQSxpQ0FtSEEsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO2FBQ1osQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ0UsY0FBQSxDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUksQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFSLENBQWUsQ0FBQyxPQUFoQixDQUF3QixJQUF4QixDQUE2QixDQUFDLElBQTlCLENBQW1DLE1BQW5DLENBQUosQ0FBQTtpQkFDQSxTQUFTLENBQUMsWUFBVixDQUF1QixLQUFDLENBQUEsS0FBSyxDQUFDLElBQTlCLEVBQW9DLElBQXBDLEVBQTBDLENBQTFDLEVBQTZDLFNBQUMsR0FBRCxHQUFBO0FBQzNDLGdCQUFBLElBQUE7QUFBQSxZQUFBLElBQVUsU0FBQSxDQUFVLEdBQVYsQ0FBVjtBQUFBLG9CQUFBLENBQUE7YUFBQTtBQUFBLFlBRUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBQyxDQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQVosQ0FBQSxDQUFWLEVBQTZDLENBQTdDLENBRlAsQ0FBQTtBQUFBLFlBR0EsS0FBQyxDQUFBLEdBQUcsQ0FBQyxrQkFBTCxDQUF3QjtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxjQUFZLEtBQUEsRUFBTyxDQUFuQjtBQUFBLGNBQXNCLFFBQUEsRUFBVSxDQUFoQzthQUF4QixDQUhBLENBQUE7bUJBSUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLENBQXBCLEVBTDJDO1VBQUEsQ0FBN0MsRUFGRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEVBRFk7SUFBQSxDQW5IZCxDQUFBOztBQUFBLGlDQTZIQSxTQUFBLEdBQVcsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO0FBQ1QsVUFBQSxzQ0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsTUFBM0IsQ0FBWCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFTLENBQUMsYUFBVixDQUFBLENBQXlCLENBQUMsbUJBQTFCLENBQUEsQ0FBVixFQUEyRCxRQUEzRCxDQURYLENBQUE7QUFHQTtBQUFBLFdBQUEsNENBQUE7c0JBQUE7QUFDRSxRQUFBLElBQVksQ0FBQyxDQUFDLE9BQUYsQ0FBQSxDQUFBLEtBQWUsUUFBM0I7QUFBQSxVQUFBLENBQUMsQ0FBQyxJQUFGLENBQUEsQ0FBQSxDQUFBO1NBREY7QUFBQSxPQUhBO2FBTUEsU0FBUyxDQUFDLEdBQVYsQ0FBYyxJQUFDLENBQUEsS0FBSyxDQUFDLElBQXJCLEVBQTJCLFFBQTNCLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtBQUNuQyxVQUFBLElBQVUsU0FBQSxDQUFVLEdBQVYsQ0FBVjtBQUFBLGtCQUFBLENBQUE7V0FBQTtpQkFFQSxLQUFDLENBQUEsR0FBRyxDQUFDLFlBQUwsQ0FBa0I7QUFBQSxZQUFBLElBQUEsRUFBTSxRQUFOO1dBQWxCLEVBSG1DO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckMsRUFQUztJQUFBLENBN0hYLENBQUE7O0FBQUEsSUF5SUEsa0JBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQyxHQUFELEdBQUE7QUFDUCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQVUscUJBQVY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsSUFBQSxHQUFPLFNBQVMsQ0FBQyxhQUFWLENBQUEsQ0FGUCxDQUFBO0FBR0EsTUFBQSxJQUFPLFlBQVA7QUFDRSxRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIseUJBQTlCLEVBQ0U7QUFBQSxVQUFBLE1BQUEsRUFBUSwwRkFBUjtTQURGLENBQUEsQ0FBQTtBQUdBLGNBQUEsQ0FKRjtPQUhBO2FBU0EsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFNLEtBQU4sR0FBQTtBQUNwQixjQUFBLElBQUE7QUFBQSxVQUFBLElBQVUsU0FBQSxDQUFVLEdBQVYsQ0FBVjtBQUFBLGtCQUFBLENBQUE7V0FBQTtBQUVBLFVBQUEsSUFBRyxDQUFBLEtBQVMsQ0FBQyxPQUFOLENBQUEsQ0FBUDtBQUNFLFlBQUEsSUFBQSxHQUFXLElBQUEsa0JBQUEsQ0FBbUIsS0FBbkIsRUFBMEIsR0FBMUIsQ0FBWCxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsUUFBRCxHQUFZLElBRFosQ0FBQTtBQUFBLFlBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjthQUE5QixDQUZBLENBQUE7bUJBSUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO3FCQUNuRCxLQUFDLENBQUEsZUFBRCxDQUFpQixLQUFqQixFQUF3QixNQUF4QixFQUFnQyxHQUFoQyxFQURtRDtZQUFBLENBQWxDLENBQW5CLEVBTEY7V0FBQSxNQUFBO21CQVFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsa0JBQTNCLEVBQ0U7QUFBQSxjQUFBLE1BQUEsRUFBUSxvQkFBUjtBQUFBLGNBQ0EsV0FBQSxFQUFhLElBRGI7YUFERixFQVJGO1dBSG9CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsRUFWTztJQUFBLENBeklULENBQUE7O0FBQUEsSUFrS0Esa0JBQUMsQ0FBQSxlQUFELEdBQWtCLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsR0FBaEIsR0FBQTtBQUNoQixVQUFBLHFCQUFBO0FBQUEsTUFBQSxJQUFVLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxRQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUZYLENBQUE7QUFBQSxNQUdBLFFBQUEsR0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVgsQ0FBc0IsUUFBdEIsQ0FIWCxDQUFBO0FBSUEsTUFBQSxJQUFjLGdCQUFkO0FBQUEsY0FBQSxDQUFBO09BSkE7QUFNQSxNQUFBLElBQUEsQ0FBQSxDQUFlLENBQUMsUUFBRixDQUFXLEtBQUssQ0FBQyxhQUFOLENBQUEsQ0FBWCxFQUFrQyxRQUFsQyxDQUFkO0FBQUEsY0FBQSxDQUFBO09BTkE7QUFBQSxNQVFBLENBQUEsR0FBUSxJQUFBLGdCQUFBLENBQWlCLEtBQWpCLEVBQXdCLEdBQXhCLEVBQTZCLE1BQTdCLENBUlIsQ0FBQTthQVNBLENBQUMsQ0FBQyxJQUFGLENBQUEsRUFWZ0I7SUFBQSxDQWxLbEIsQ0FBQTs7OEJBQUE7O0tBRitCLEtBWmpDLENBQUE7O0FBQUEsRUE2TEEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsa0JBQUEsRUFBb0Isa0JBQXBCO0dBOUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/view/merge-conflicts-view.coffee
