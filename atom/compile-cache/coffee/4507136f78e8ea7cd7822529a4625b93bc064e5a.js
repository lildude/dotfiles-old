(function() {
  var OpenCheatSheet;

  OpenCheatSheet = require("../../lib/commands/open-cheat-sheet");

  describe("OpenCheatSheet", function() {
    return it("returns correct cheatsheetURL", function() {
      var cmd;
      cmd = new OpenCheatSheet();
      expect(cmd.cheatsheetURL()).toMatch("markdown-preview://");
      return expect(cmd.cheatsheetURL()).toMatch("CHEATSHEET.md");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvb3Blbi1jaGVhdC1zaGVldC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEscUNBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7V0FDekIsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBVSxJQUFBLGNBQUEsQ0FBQSxDQUFWLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsYUFBSixDQUFBLENBQVAsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxxQkFBcEMsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxhQUFKLENBQUEsQ0FBUCxDQUEyQixDQUFDLE9BQTVCLENBQW9DLGVBQXBDLEVBSGtDO0lBQUEsQ0FBcEMsRUFEeUI7RUFBQSxDQUEzQixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/commands/open-cheat-sheet-spec.coffee
