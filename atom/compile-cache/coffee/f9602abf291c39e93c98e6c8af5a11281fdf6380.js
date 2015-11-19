(function() {
  var PublishDraft;

  PublishDraft = require("../lib/publish-draft");

  describe("PublishDraft", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    return it('performs publish draft', function() {
      var publishDraft;
      publishDraft = new PublishDraft({});
      publishDraft.editor.save = function() {
        return {};
      };
      publishDraft.moveDraft = function() {
        return {};
      };
      publishDraft.display();
      expect(publishDraft.draftPath).toMatch("fixtures/empty.markdown");
      return expect(publishDraft.postPath).toMatch(/\/\d{4}\/\d{4}-\d\d-\d\d-empty\.markdown/);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvcHVibGlzaC1kcmFmdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCLEVBQUg7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7V0FHQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFVBQUEsWUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBYSxFQUFiLENBQW5CLENBQUE7QUFBQSxNQUVBLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBcEIsR0FBMkIsU0FBQSxHQUFBO2VBQUcsR0FBSDtNQUFBLENBRjNCLENBQUE7QUFBQSxNQUdBLFlBQVksQ0FBQyxTQUFiLEdBQXlCLFNBQUEsR0FBQTtlQUFHLEdBQUg7TUFBQSxDQUh6QixDQUFBO0FBQUEsTUFLQSxZQUFZLENBQUMsT0FBYixDQUFBLENBTEEsQ0FBQTtBQUFBLE1BT0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxTQUFwQixDQUE4QixDQUFDLE9BQS9CLENBQXVDLHlCQUF2QyxDQVBBLENBQUE7YUFRQSxNQUFBLENBQU8sWUFBWSxDQUFDLFFBQXBCLENBQTZCLENBQUMsT0FBOUIsQ0FBc0MsMENBQXRDLEVBVDJCO0lBQUEsQ0FBN0IsRUFKdUI7RUFBQSxDQUF6QixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/publish-draft-spec.coffee
