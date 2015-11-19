(function() {
  var CmdModule, config,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  config = require("./config");

  CmdModule = {};

  module.exports = {
    configDefaults: {
      siteEngine: config.getDefault("siteEngine"),
      siteLocalDir: config.getDefault("siteLocalDir"),
      siteDraftsDir: config.getDefault("siteDraftsDir"),
      sitePostsDir: config.getDefault("sitePostsDir"),
      urlForTags: config.getDefault("urlForTags"),
      urlForPosts: config.getDefault("urlForPosts"),
      urlForCategories: config.getDefault("urlForCategories"),
      newPostFileName: config.getDefault("newPostFileName"),
      fileExtension: config.getDefault("fileExtension")
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
      var editor, _ref;
      editor = atom.workspace.getActiveEditor();
      if (editor == null) {
        return false;
      }
      return _ref = editor.getGrammar().scopeName, __indexOf.call(config.get("grammars"), _ref) >= 0;
    },
    deactivate: function() {
      return CmdModule = {};
    },
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLEVBRlosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFZLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBQVo7QUFBQSxNQUNBLFlBQUEsRUFBYyxNQUFNLENBQUMsVUFBUCxDQUFrQixjQUFsQixDQURkO0FBQUEsTUFFQSxhQUFBLEVBQWUsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsZUFBbEIsQ0FGZjtBQUFBLE1BR0EsWUFBQSxFQUFjLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGNBQWxCLENBSGQ7QUFBQSxNQUlBLFVBQUEsRUFBWSxNQUFNLENBQUMsVUFBUCxDQUFrQixZQUFsQixDQUpaO0FBQUEsTUFLQSxXQUFBLEVBQWEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsYUFBbEIsQ0FMYjtBQUFBLE1BTUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0Isa0JBQWxCLENBTmxCO0FBQUEsTUFPQSxlQUFBLEVBQWlCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGlCQUFsQixDQVBqQjtBQUFBLE1BUUEsYUFBQSxFQUFlLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGVBQWxCLENBUmY7S0FERjtBQUFBLElBV0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBRVIsTUFBQSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWlCLENBQUMsT0FBbEIsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUN4QixLQUFDLENBQUEsZUFBRCxD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
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/main.coffee