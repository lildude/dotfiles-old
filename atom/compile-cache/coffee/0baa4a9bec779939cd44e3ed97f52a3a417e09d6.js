(function() {
  var GitBridge, ResolverView, util,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ResolverView = require('../../lib/view/resolver-view').ResolverView;

  GitBridge = require('../../lib/git-bridge').GitBridge;

  util = require('../util');

  describe('ResolverView', function() {
    var fakeEditor, pkg, state, view, _ref;
    _ref = [], view = _ref[0], fakeEditor = _ref[1], pkg = _ref[2];
    state = {
      repo: {
        getWorkingDirectory: function() {
          return "/fake/gitroot/";
        },
        relativize: function(filepath) {
          return filepath.slice("/fake/gitroot/".length);
        },
        repo: {
          add: function(filepath) {}
        }
      }
    };
    beforeEach(function() {
      var done;
      pkg = util.pkgEmitter();
      fakeEditor = {
        isModified: function() {
          return true;
        },
        getURI: function() {
          return '/fake/gitroot/lib/file1.txt';
        },
        save: function() {},
        onDidSave: function() {}
      };
      atom.config.set('merge-conflicts.gitPath', 'git');
      done = false;
      GitBridge.locateGitAnd(function(err) {
        if (err != null) {
          throw err;
        }
        return done = true;
      });
      waitsFor(function() {
        return done;
      });
      GitBridge.process = function(_arg) {
        var exit, stdout;
        stdout = _arg.stdout, exit = _arg.exit;
        stdout('UU lib/file1.txt');
        exit(0);
        return {
          process: {
            on: function(err) {}
          }
        };
      };
      return view = new ResolverView(fakeEditor, state, pkg);
    });
    it('begins needing both saving and staging', function() {
      view.refresh();
      return expect(view.actionText.text()).toBe('Save and stage');
    });
    it('shows if the file only needs staged', function() {
      fakeEditor.isModified = function() {
        return false;
      };
      view.refresh();
      return expect(view.actionText.text()).toBe('Stage');
    });
    return it('saves and stages the file', function() {
      var p;
      p = null;
      state.repo.repo.add = function(filepath) {
        return p = filepath;
      };
      GitBridge.process = function(_arg) {
        var args, command, exit, options, stdout;
        command = _arg.command, args = _arg.args, options = _arg.options, stdout = _arg.stdout, exit = _arg.exit;
        if (__indexOf.call(args, 'status') >= 0) {
          stdout('M  lib/file1.txt');
          exit(0);
        }
        return {
          process: {
            on: function(err) {}
          }
        };
      };
      spyOn(fakeEditor, 'save');
      view.resolve();
      expect(fakeEditor.save).toHaveBeenCalled();
      return expect(p).toBe('lib/file1.txt');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL3NwZWMvdmlldy9yZXNvbHZlci12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxlQUFnQixPQUFBLENBQVEsOEJBQVIsRUFBaEIsWUFBRCxDQUFBOztBQUFBLEVBRUMsWUFBYSxPQUFBLENBQVEsc0JBQVIsRUFBYixTQUZELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsa0NBQUE7QUFBQSxJQUFBLE9BQTBCLEVBQTFCLEVBQUMsY0FBRCxFQUFPLG9CQUFQLEVBQW1CLGFBQW5CLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FDRTtBQUFBLE1BQUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7aUJBQUcsaUJBQUg7UUFBQSxDQUFyQjtBQUFBLFFBQ0EsVUFBQSxFQUFZLFNBQUMsUUFBRCxHQUFBO2lCQUFjLFFBQVMsZ0NBQXZCO1FBQUEsQ0FEWjtBQUFBLFFBRUEsSUFBQSxFQUNFO0FBQUEsVUFBQSxHQUFBLEVBQUssU0FBQyxRQUFELEdBQUEsQ0FBTDtTQUhGO09BREY7S0FIRixDQUFBO0FBQUEsSUFTQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxJQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFOLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYTtBQUFBLFFBQ1gsVUFBQSxFQUFZLFNBQUEsR0FBQTtpQkFBRyxLQUFIO1FBQUEsQ0FERDtBQUFBLFFBRVgsTUFB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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/spec/view/resolver-view-spec.coffee
