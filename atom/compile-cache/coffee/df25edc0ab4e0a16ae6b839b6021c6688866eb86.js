(function() {
  var EditorLinter, LinterRegistry;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  module.exports = {
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath
      };
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: "Error",
              text: "Something"
            }
          ];
        }
      };
      linterRegistry.addLinter(linter);
      return {
        linterRegistry: linterRegistry,
        editorLinter: editorLinter,
        linter: linter
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29tbW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0QkFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFBLEdBQUE7QUFDVCxhQUFPO0FBQUEsUUFBQyxhQUFBLEVBQWUsQ0FBQyxHQUFELENBQWhCO0FBQUEsUUFBdUIsU0FBQSxFQUFXLEtBQWxDO0FBQUEsUUFBeUMsY0FBQSxFQUFnQixLQUF6RDtBQUFBLFFBQWdFLEtBQUEsRUFBTyxTQUF2RTtBQUFBLFFBQWtGLElBQUEsRUFBTSxTQUFBLEdBQUEsQ0FBeEY7T0FBUCxDQURTO0lBQUEsQ0FBWDtBQUFBLElBRUEsVUFBQSxFQUFZLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNWLGFBQU87QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sSUFBQSxFQUFNLGNBQWI7QUFBQSxRQUE2QixVQUFBLFFBQTdCO09BQVAsQ0FEVTtJQUFBLENBRlo7QUFBQSxJQUlBLGlCQUFBLEVBQW1CLFNBQUEsR0FBQTtBQUNqQixVQUFBLG9DQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLEdBQUEsQ0FBQSxjQUFqQixDQUFBO0FBQUEsTUFDQSxZQUFBLEdBQW1CLElBQUEsWUFBQSxDQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFiLENBRG5CLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUztBQUFBLFFBQ1AsYUFBQSxFQUFlLENBQUMsR0FBRCxDQURSO0FBQUEsUUFFUCxTQUFBLEVBQVcsS0FGSjtBQUFBLFFBR1AsY0FBQSxFQUFnQixLQUhUO0FBQUEsUUFJUCxLQUFBLEVBQU8sU0FKQTtBQUFBLFFBS1AsSUFBQSxFQUFNLFNBQUEsR0FBQTtBQUFHLGlCQUFPO1lBQUM7QUFBQSxjQUFDLElBQUEsRUFBTSxPQUFQO0FBQUEsY0FBZ0IsSUFBQSxFQUFNLFdBQXRCO2FBQUQ7V0FBUCxDQUFIO1FBQUEsQ0FMQztPQUZULENBQUE7QUFBQSxNQVNBLGNBQWMsQ0FBQyxTQUFmLENBQXlCLE1BQXpCLENBVEEsQ0FBQTtBQVVBLGFBQU87QUFBQSxRQUFDLGdCQUFBLGNBQUQ7QUFBQSxRQUFpQixjQUFBLFlBQWpCO0FBQUEsUUFBK0IsUUFBQSxNQUEvQjtPQUFQLENBWGlCO0lBQUEsQ0FKbkI7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/lildude/.atom/packages/linter/spec/common.coffee
