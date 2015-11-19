(function() {
  var pkg;

  pkg = require("../package");

  describe("MarkdownWriter", function() {
    var activationPromise, ditor, editorView, workspaceView, _ref;
    _ref = [], workspaceView = _ref[0], ditor = _ref[1], editorView = _ref[2], activationPromise = _ref[3];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("test");
      });
      return runs(function() {
        var editor;
        workspaceView = atom.views.getView(atom.workspace);
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage("markdown-writer");
      });
    });
    pkg.activationCommands["atom-workspace"].forEach(function(cmd) {
      return xit("registered workspace commands " + cmd, function() {
        atom.config.set("markdown-writer.testMode", true);
        atom.commands.dispatch(workspaceView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
    return pkg.activationCommands["atom-text-editor"].forEach(function(cmd) {
      return xit("registered editor commands " + cmd, function() {
        atom.config.set("markdown-writer.testMode", true);
        atom.commands.dispatch(editorView, cmd);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(true).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvbWFya2Rvd24td3JpdGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEdBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFlBQVIsQ0FBTixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLHlEQUFBO0FBQUEsSUFBQSxPQUF3RCxFQUF4RCxFQUFDLHVCQUFELEVBQWdCLGVBQWhCLEVBQXVCLG9CQUF2QixFQUFtQywyQkFBbkMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsTUFBcEIsRUFBSDtNQUFBLENBQWhCLENBQUEsQ0FBQTthQUNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLE1BQUE7QUFBQSxRQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFoQixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFQsQ0FBQTtBQUFBLFFBRUEsVUFBQSxHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUZiLENBQUE7ZUFHQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsaUJBQTlCLEVBSmpCO01BQUEsQ0FBTCxFQUZTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQWNBLEdBQUcsQ0FBQyxrQkFBbUIsQ0FBQSxnQkFBQSxDQUFpQixDQUFDLE9BQXpDLENBQWlELFNBQUMsR0FBRCxHQUFBO2FBQy9DLEdBQUEsQ0FBSyxnQ0FBQSxHQUFnQyxHQUFyQyxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLElBQTVDLENBQUEsQ0FBQTtBQUFBLFFBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCLEVBQXNDLEdBQXRDLENBRkEsQ0FBQTtBQUFBLFFBSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsa0JBQUg7UUFBQSxDQUFoQixDQUpBLENBQUE7ZUFLQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUFHLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCLEVBQUg7UUFBQSxDQUFMLEVBTjBDO01BQUEsQ0FBNUMsRUFEK0M7SUFBQSxDQUFqRCxDQWRBLENBQUE7V0F1QkEsR0FBRyxDQUFDLGtCQUFtQixDQUFBLGtCQUFBLENBQW1CLENBQUMsT0FBM0MsQ0FBbUQsU0FBQyxHQUFELEdBQUE7YUFDakQsR0FBQSxDQUFLLDZCQUFBLEdBQTZCLEdBQWxDLEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsSUFBNUMsQ0FBQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsR0FBbkMsQ0FGQSxDQUFBO0FBQUEsUUFJQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxrQkFBSDtRQUFBLENBQWhCLENBSkEsQ0FBQTtlQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQUcsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEIsRUFBSDtRQUFBLENBQUwsRUFOdUM7TUFBQSxDQUF6QyxFQURpRDtJQUFBLENBQW5ELEVBeEJ5QjtFQUFBLENBQTNCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/markdown-writer-spec.coffee
