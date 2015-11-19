(function() {
  var OpenCheatSheet, utils;

  utils = require("../utils");

  module.exports = OpenCheatSheet = (function() {
    function OpenCheatSheet() {}

    OpenCheatSheet.prototype.trigger = function(e) {
      if (!this.hasPreview()) {
        e.abortKeyBinding();
      }
      return atom.workspace.open(this.cheatsheetURL(), {
        split: 'right',
        searchAllPanes: true
      });
    };

    OpenCheatSheet.prototype.hasPreview = function() {
      return !!atom.packages.activePackages['markdown-preview'];
    };

    OpenCheatSheet.prototype.cheatsheetURL = function() {
      var cheatsheet;
      cheatsheet = utils.getPackagePath("CHEATSHEET.md");
      return "markdown-preview://" + (encodeURI(cheatsheet));
    };

    return OpenCheatSheet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9vcGVuLWNoZWF0LXNoZWV0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQUFSLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO2dDQUNKOztBQUFBLDZCQUFBLE9BQUEsR0FBUyxTQUFDLENBQUQsR0FBQTtBQUNQLE1BQUEsSUFBQSxDQUFBLElBQTRCLENBQUEsVUFBRCxDQUFBLENBQTNCO0FBQUEsUUFBQSxDQUFDLENBQUMsZUFBRixDQUFBLENBQUEsQ0FBQTtPQUFBO2FBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBcEIsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUFnQixjQUFBLEVBQWdCLElBQWhDO09BREYsRUFITztJQUFBLENBQVQsQ0FBQTs7QUFBQSw2QkFNQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsQ0FBQSxDQUFDLElBQUssQ0FBQyxRQUFRLENBQUMsY0FBZSxDQUFBLGtCQUFBLEVBRHJCO0lBQUEsQ0FOWixDQUFBOztBQUFBLDZCQVNBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxLQUFLLENBQUMsY0FBTixDQUFxQixlQUFyQixDQUFiLENBQUE7YUFDQyxxQkFBQSxHQUFvQixDQUFDLFNBQUEsQ0FBVSxVQUFWLENBQUQsRUFGUjtJQUFBLENBVGYsQ0FBQTs7MEJBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/commands/open-cheat-sheet.coffee
