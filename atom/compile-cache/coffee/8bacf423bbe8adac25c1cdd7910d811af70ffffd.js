(function() {
  var CreateDefaultKeymaps, fs, path, utils;

  fs = require("fs-plus");

  path = require("path");

  utils = require("../utils");

  module.exports = CreateDefaultKeymaps = (function() {
    function CreateDefaultKeymaps() {}

    CreateDefaultKeymaps.prototype.trigger = function() {
      var keymaps, userKeymapFile;
      keymaps = fs.readFileSync(this.sampleKeymapFile());
      userKeymapFile = this.userKeymapFile();
      return fs.appendFile(userKeymapFile, keymaps, function(err) {
        if (!err) {
          return atom.workspace.open(userKeymapFile);
        }
      });
    };

    CreateDefaultKeymaps.prototype.userKeymapFile = function() {
      return path.join(atom.getConfigDirPath(), "keymap.cson");
    };

    CreateDefaultKeymaps.prototype.sampleKeymapFile = function() {
      return utils.getPackagePath("keymaps", this._sampleFilename());
    };

    CreateDefaultKeymaps.prototype._sampleFilename = function() {
      return {
        "darwin": "sample-osx.cson",
        "linux": "sample-linux.cson",
        "win32": "sample-win32.cson"
      }[process.platform] || "sample-osx.cson";
    };

    return CreateDefaultKeymaps;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb21tYW5kcy9jcmVhdGUtZGVmYXVsdC1rZXltYXBzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQ0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007c0NBQ0o7O0FBQUEsbUNBQUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsdUJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxFQUFFLENBQUMsWUFBSCxDQUFnQixJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFoQixDQUFWLENBQUE7QUFBQSxNQUVBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUZqQixDQUFBO2FBR0EsRUFBRSxDQUFDLFVBQUgsQ0FBYyxjQUFkLEVBQThCLE9BQTlCLEVBQXVDLFNBQUMsR0FBRCxHQUFBO0FBQ3JDLFFBQUEsSUFBQSxDQUFBLEdBQUE7aUJBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQXBCLEVBQUE7U0FEcUM7TUFBQSxDQUF2QyxFQUpPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLG1DQU9BLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO2FBQ2QsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUFWLEVBQW1DLGFBQW5DLEVBRGM7SUFBQSxDQVBoQixDQUFBOztBQUFBLG1DQVVBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTthQUNoQixLQUFLLENBQUMsY0FBTixDQUFxQixTQUFyQixFQUFnQyxJQUFDLENBQUEsZUFBRCxDQUFBLENBQWhDLEVBRGdCO0lBQUEsQ0FWbEIsQ0FBQTs7QUFBQSxtQ0FhQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTthQUNmO0FBQUEsUUFDRSxRQUFBLEVBQVUsaUJBRFo7QUFBQSxRQUVFLE9BQUEsRUFBVSxtQkFGWjtBQUFBLFFBR0UsT0FBQSxFQUFVLG1CQUhaO09BSUUsQ0FBQSxPQUFPLENBQUMsUUFBUixDQUpGLElBSXVCLGtCQUxSO0lBQUEsQ0FiakIsQ0FBQTs7Z0NBQUE7O01BUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/commands/create-default-keymaps.coffee
