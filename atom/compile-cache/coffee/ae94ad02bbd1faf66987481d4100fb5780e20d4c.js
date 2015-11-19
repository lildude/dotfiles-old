(function() {
  var FRONT_MATTER_REGEX, FrontMatter, os, yaml;

  os = require("os");

  yaml = require("js-yaml");

  FRONT_MATTER_REGEX = /^(?:---\s*$)?([^:]+:[\s\S]*?)^---\s*$/m;

  module.exports = FrontMatter = (function() {
    function FrontMatter(editor) {
      this.editor = editor;
      this.content = {};
      this.leadingFence = true;
      this.isEmpty = true;
      this.parseError = null;
      this._findFrontMatter((function(_this) {
        return function(match) {
          var error;
          try {
            _this.content = yaml.safeLoad(match.match[1].trim());
            _this.leadingFence = match.matchText.startsWith("---");
            return _this.isEmpty = false;
          } catch (_error) {
            error = _error;
            _this.parseError = error;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Invalid Front Matter:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    }

    FrontMatter.prototype._findFrontMatter = function(onMatch) {
      return this.editor.buffer.scan(FRONT_MATTER_REGEX, onMatch);
    };

    FrontMatter.prototype.normalizeField = function(field) {
      if (!this.content[field]) {
        return this.content[field] = [];
      } else if (typeof this.content[field] === "string") {
        return this.content[field] = [this.content[field]];
      } else {
        return this.content[field];
      }
    };

    FrontMatter.prototype.has = function(field) {
      return this.content[field] != null;
    };

    FrontMatter.prototype.get = function(field) {
      return this.content[field];
    };

    FrontMatter.prototype.set = function(field, content) {
      return this.content[field] = content;
    };

    FrontMatter.prototype.setIfExists = function(field, content) {
      if (this.has(field)) {
        return this.content[field] = content;
      }
    };

    FrontMatter.prototype.getContentText = function() {
      var text;
      text = yaml.safeDump(this.content);
      if (this.leadingFence) {
        return ["---", "" + text + "---", ""].join(os.EOL);
      } else {
        return ["" + text + "---", ""].join(os.EOL);
      }
    };

    FrontMatter.prototype.save = function() {
      return this._findFrontMatter((function(_this) {
        return function(match) {
          return match.replace(_this.getContentText());
        };
      })(this));
    };

    return FrontMatter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9oZWxwZXJzL2Zyb250LW1hdHRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLGtCQUFBLEdBQXFCLHdDQUhyQixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEscUJBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBRmhCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFIWCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBSmQsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUNoQixjQUFBLEtBQUE7QUFBQTtBQUNFLFlBQUEsS0FBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQUssQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBZixDQUFBLENBQWQsQ0FBWCxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsWUFBRCxHQUFnQixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQWhCLENBQTJCLEtBQTNCLENBRGhCLENBQUE7bUJBRUEsS0FBQyxDQUFBLE9BQUQsR0FBVyxNQUhiO1dBQUEsY0FBQTtBQUtFLFlBREksY0FDSixDQUFBO0FBQUEsWUFBQSxLQUFDLENBQUEsVUFBRCxHQUFjLEtBQWQsQ0FBQTttQkFDQSxJQUFJLENBQUMsT0FBTCxDQUNFO0FBQUEsY0FBQSxPQUFBLEVBQVMsMEJBQVQ7QUFBQSxjQUNBLGVBQUEsRUFBa0IseUJBQUEsR0FBeUIsS0FBSyxDQUFDLE9BRGpEO0FBQUEsY0FFQSxPQUFBLEVBQVMsQ0FBQyxJQUFELENBRlQ7YUFERixFQU5GO1dBRGdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEIsQ0FQQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSwwQkFvQkEsZ0JBQUEsR0FBa0IsU0FBQyxPQUFELEdBQUE7YUFDaEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBZixDQUFvQixrQkFBcEIsRUFBd0MsT0FBeEMsRUFEZ0I7SUFBQSxDQXBCbEIsQ0FBQTs7QUFBQSwwQkF3QkEsY0FBQSxHQUFnQixTQUFDLEtBQUQsR0FBQTtBQUNkLE1BQUEsSUFBRyxDQUFBLElBQUUsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFiO2VBQ0UsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0IsR0FEcEI7T0FBQSxNQUVLLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFoQixLQUEwQixRQUE3QjtlQUNILElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFULEdBQWtCLENBQUMsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVYsRUFEZjtPQUFBLE1BQUE7ZUFHSCxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsRUFITjtPQUhTO0lBQUEsQ0F4QmhCLENBQUE7O0FBQUEsMEJBZ0NBLEdBQUEsR0FBSyxTQUFDLEtBQUQsR0FBQTthQUFXLDRCQUFYO0lBQUEsQ0FoQ0wsQ0FBQTs7QUFBQSwwQkFrQ0EsR0FBQSxHQUFLLFNBQUMsS0FBRCxHQUFBO2FBQVcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLEVBQXBCO0lBQUEsQ0FsQ0wsQ0FBQTs7QUFBQSwwQkFvQ0EsR0FBQSxHQUFLLFNBQUMsS0FBRCxFQUFRLE9BQVIsR0FBQTthQUFvQixJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVCxHQUFrQixRQUF0QztJQUFBLENBcENMLENBQUE7O0FBQUEsMEJBc0NBLFdBQUEsR0FBYSxTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7QUFDWCxNQUFBLElBQTZCLElBQUMsQ0FBQSxHQUFELENBQUssS0FBTCxDQUE3QjtlQUFBLElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFULEdBQWtCLFFBQWxCO09BRFc7SUFBQSxDQXRDYixDQUFBOztBQUFBLDBCQXlDQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLE9BQWYsQ0FBUCxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxZQUFKO2VBQ0UsQ0FBQyxLQUFELEVBQVEsRUFBQSxHQUFHLElBQUgsR0FBUSxLQUFoQixFQUFzQixFQUF0QixDQUF5QixDQUFDLElBQTFCLENBQStCLEVBQUUsQ0FBQyxHQUFsQyxFQURGO09BQUEsTUFBQTtlQUdFLENBQUMsRUFBQSxHQUFHLElBQUgsR0FBUSxLQUFULEVBQWUsRUFBZixDQUFrQixDQUFDLElBQW5CLENBQXdCLEVBQUUsQ0FBQyxHQUEzQixFQUhGO09BRmM7SUFBQSxDQXpDaEIsQ0FBQTs7QUFBQSwwQkFnREEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQVcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFDLENBQUEsY0FBRCxDQUFBLENBQWQsRUFBWDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLEVBREk7SUFBQSxDQWhETixDQUFBOzt1QkFBQTs7TUFkRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/helpers/front-matter.coffee
