(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter) {
      linter.modifiesBuffer = Boolean(linter.modifiesBuffer);
      if (!(linter.grammarScopes instanceof Array)) {
        throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
      }
      if (linter.lint) {
        if (typeof linter.lint !== 'function') {
          throw new Error("linter.lint isn't a function on provider");
        }
      } else {
        throw new Error('Missing linter.lint on provider');
      }
      return true;
    },
    messages: function(messages) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      messages.forEach(function(result) {
        if (result.type) {
          if (typeof result.type !== 'string') {
            throw new Error('Invalid type field on Linter Response');
          }
        } else {
          throw new Error('Missing type field on Linter Response');
        }
        if (result.html) {
          if (typeof result.html !== 'string') {
            throw new Error('Invalid html field on Linter Response');
          }
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
        } else {
          throw new Error('Missing html/text field on Linter Response');
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result["class"] = result.type.toLowerCase().replace(' ', '-');
        if (result.trace) {
          return Validate.messages(result.trace);
        }
      });
      return void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92YWxpZGF0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FFZjtBQUFBLElBQUEsTUFBQSxFQUFRLFNBQUMsTUFBRCxHQUFBO0FBRU4sTUFBQSxNQUFNLENBQUMsY0FBUCxHQUF3QixPQUFBLENBQVEsTUFBTSxDQUFDLGNBQWYsQ0FBeEIsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsWUFBZ0MsS0FBdkMsQ0FBQTtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU8sc0NBQUEsR0FBc0MsTUFBTSxDQUFDLGFBQXBELENBQVYsQ0FERjtPQURBO0FBR0EsTUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsUUFBQSxJQUErRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsVUFBdkY7QUFBQSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSwwQ0FBTixDQUFWLENBQUE7U0FERjtPQUFBLE1BQUE7QUFHRSxjQUFVLElBQUEsS0FBQSxDQUFNLGlDQUFOLENBQVYsQ0FIRjtPQUhBO0FBT0EsYUFBTyxJQUFQLENBVE07SUFBQSxDQUFSO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQyxRQUFELEdBQUE7QUFDUixNQUFBLElBQUEsQ0FBQSxDQUFPLFFBQUEsWUFBb0IsS0FBM0IsQ0FBQTtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU8sMkNBQUEsR0FBMEMsQ0FBQyxNQUFBLENBQUEsUUFBRCxDQUFqRCxDQUFWLENBREY7T0FBQTtBQUFBLE1BRUEsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsU0FBQyxNQUFELEdBQUE7QUFDZixRQUFBLElBQUcsTUFBTSxDQUFDLElBQVY7QUFDRSxVQUFBLElBQTJELE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixRQUFuRjtBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLHVDQUFOLENBQVYsQ0FBQTtXQURGO1NBQUEsTUFBQTtBQUdFLGdCQUFVLElBQUEsS0FBQSxDQUFNLHVDQUFOLENBQVYsQ0FIRjtTQUFBO0FBSUEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsVUFBQSxJQUEyRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsUUFBbkY7QUFBQSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSx1Q0FBTixDQUFWLENBQUE7V0FERjtTQUFBLE1BRUssSUFBRyxNQUFNLENBQUMsSUFBVjtBQUNILFVBQUEsSUFBMkQsTUFBQSxDQUFBLE1BQWEsQ0FBQyxJQUFkLEtBQXdCLFFBQW5GO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sdUNBQU4sQ0FBVixDQUFBO1dBREc7U0FBQSxNQUFBO0FBR0gsZ0JBQVUsSUFBQSxLQUFBLENBQU0sNENBQU4sQ0FBVixDQUhHO1NBTkw7QUFVQSxRQUFBLElBQWdELG9CQUFoRDtBQUFBLFVBQUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxLQUFLLENBQUMsVUFBTixDQUFpQixNQUFNLENBQUMsS0FBeEIsQ0FBZixDQUFBO1NBVkE7QUFBQSxRQVdBLE1BQU0sQ0FBQyxHQUFQLEdBQWEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxNQUFmLENBWGIsQ0FBQTtBQUFBLFFBWUEsTUFBTSxDQUFDLE9BQUQsQ0FBTixHQUFlLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBWixDQUFBLENBQXlCLENBQUMsT0FBMUIsQ0FBa0MsR0FBbEMsRUFBdUMsR0FBdkMsQ0FaZixDQUFBO0FBYUEsUUFBQSxJQUFtQyxNQUFNLENBQUMsS0FBMUM7aUJBQUEsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsTUFBTSxDQUFDLEtBQXpCLEVBQUE7U0FkZTtNQUFBLENBQWpCLENBRkEsQ0FBQTtBQWlCQSxhQUFPLE1BQVAsQ0FsQlE7SUFBQSxDQVhWO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/lildude/.atom/packages/linter/lib/validate.coffee
