(function() {
  var CmdModule,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CmdModule = {};

  module.exports = {
    configDefaults: {
      siteLocalDir: "/GitHub/example.github.io/",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
      urlForTags: "http://example.github.io/assets/tags.json",
      urlForPosts: "http://example.github.io/assets/posts.json",
      urlForCategories: "http://example.github.io/assets/categories.json",
      newPostFileName: "{year}-{month}-{day}-{title}{extension}",
      fileExtension: ".markdown"
    },
    activate: function(state) {
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return _this.registerCommand("new-" + file, "./new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      this.registerCommand("publish-draft", "./publish-draft");
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return _this.registerCommand("manage-post-" + attr, "./manage-post-" + attr + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "keystroke", "strikethrough"].forEach((function(_this) {
        return function(style) {
          return _this.registerCommand("toggle-" + style + "-text", "./style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return _this.registerCommand("toggle-" + style, "./style-line", {
            args: style
          });
        };
      })(this));
      ["link", "image", "table"].forEach((function(_this) {
        return function(media) {
          return _this.registerCommand("insert-" + media, "./insert-" + media + "-view");
        };
      })(this));
      return ["open-cheat-sheet", "insert-new-line", "jump-between-reference-definition", "jump-to-previous-heading", "jump-to-next-heading", "jump-to-next-table-cell", "format-table"].forEach((function(_this) {
        return function(command) {
          return _this.registerHelper(command, "./commands");
        };
      })(this));
    },
    registerCommand: function(cmd, path, options) {
      if (options == null) {
        options = {};
      }
      return atom.workspaceView.command("markdown-writer:" + cmd, (function(_this) {
        return function(e) {
          var cmdInstance;
          if (!(options.optOutGrammars || _this.isMarkdown())) {
            return e.abortKeyBinding();
          }
          if (CmdModule[path] == null) {
            CmdModule[path] = require(path);
          }
          cmdInstance = new CmdModule[path](options.args);
          return cmdInstance.display();
        };
      })(this));
    },
    registerHelper: function(cmd, path) {
      return atom.workspaceView.command("markdown-writer:" + cmd, (function(_this) {
        return function(e) {
          if (!_this.isMarkdown()) {
            return e.abortKeyBinding();
          }
          if (CmdModule[path] == null) {
            CmdModule[path] = require(path);
          }
          return CmdModule[path].trigger(cmd);
        };
      })(this));
    },
    isMarkdown: function() {
      var editor, grammars, _ref;
      editor = atom.workspace.getActiveEditor();
      if (editor == null) {
        return false;
      }
      grammars = atom.config.get('markdown-writer.grammars') || ['source.gfm', 'text.plain', 'text.plain.null-grammar'];
      if (_ref = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref) >= 0) {
        return true;
      }
    },
    deactivate: function() {
      return CmdModule = {};
    },
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFNBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxFQUFaLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFBYyw0QkFBZDtBQUFBLE1BQ0EsYUFBQSxFQUFlLFVBRGY7QUFBQSxNQUVBLFlBQUEsRUFBYyxnQkFGZDtBQUFBLE1BR0EsVUFBQSxFQUFZLDJDQUhaO0FBQUEsTUFJQSxXQUFBLEVBQWEsNENBSmI7QUFBQSxNQUtBLGdCQUFBLEVBQWtCLGlEQUxsQjtBQUFBLE1BTUEsZUFBQSxFQUFpQix5Q0FOakI7QUFBQSxNQU9BLGFBQUEsRUFBZSxXQVBmO0tBREY7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUVSLE1BQUEsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFpQixDQUFDLE9BQWxCLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDeEIsS0FBQyxDQUFBLGVBQUQsQ0FBa0IsTUFBQSxHQUFLLElBQXZCLEVBQWlDLFFBQUEsR0FBTyxJQUFQLEdBQWEsT0FBOUMsRUFBc0Q7QUFBQSxZQUFBLGNBQUEsRUFBZ0IsSUFBaEI7V0FBdEQsRUFEd0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxlQUFELENBQWlCLGVBQWpCLEVBQWtDLGlCQUFsQyxDQUZBLENBQUE7QUFBQSxNQUtBLENBQUMsTUFBRCxFQUFTLFlBQVQsQ0FBc0IsQ0FBQyxPQUF2QixDQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQzdCLEtB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
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/main.coffee