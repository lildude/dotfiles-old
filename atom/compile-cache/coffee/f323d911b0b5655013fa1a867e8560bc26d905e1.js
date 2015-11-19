(function() {
  describe('Commands', function() {
    var linter;
    linter = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    return describe('linter:togglePanel', function() {
      return it('toggles the panel visibility', function() {
        var visibility;
        visibility = linter.views.panel.getVisibility();
        linter.commands.togglePanel();
        expect(linter.views.panel.getVisibility()).toBe(!visibility);
        linter.commands.togglePanel();
        return expect(linter.views.panel.getVisibility()).toBe(visibility);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29tbWFuZHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsU0FBQSxHQUFBO2lCQUMzQyxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxTQURsQjtRQUFBLENBQTdDLEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FPQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO2FBQzdCLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBbkIsQ0FBQSxDQUFiLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBaEIsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxDQUFBLFVBQWhELENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFoQixDQUFBLENBSEEsQ0FBQTtlQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxVQUFoRCxFQUxpQztNQUFBLENBQW5DLEVBRDZCO0lBQUEsQ0FBL0IsRUFSbUI7RUFBQSxDQUFyQixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/linter/spec/commands-spec.coffee
