(function() {
  var InsertImageView;

  InsertImageView = require("../lib/insert-image-view");

  describe("InsertImageView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    return it('can be initialized', function() {
      var insertImageView;
      return insertImageView = new InsertImageView({});
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvaW5zZXJ0LWltYWdlLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZUFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDBCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQixFQUFIO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO1dBR0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixVQUFBLGVBQUE7YUFBQSxlQUFBLEdBQXNCLElBQUEsZUFBQSxDQUFnQixFQUFoQixFQURDO0lBQUEsQ0FBekIsRUFKMEI7RUFBQSxDQUE1QixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/insert-image-view-spec.coffee
