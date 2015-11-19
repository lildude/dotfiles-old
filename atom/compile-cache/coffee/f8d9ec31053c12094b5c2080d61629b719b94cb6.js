(function() {
  var CmdModule, config,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  config = require("./config");

  CmdModule = {};

  module.exports = {
    config: {
      siteEngine: {
        type: "string",
        "default": config.getDefault("siteEngine"),
        "enum": [config.getDefault("siteEngine")].concat(__slice.call(config.engineNames()))
      },
      siteUrl: {
        type: "string",
        "default": config.getDefault("siteUrl")
      },
      siteLocalDir: {
        type: "string",
        "default": config.getDefault("siteLocalDir")
      },
      siteDraftsDir: {
        type: "string",
        "default": config.getDefault("siteDraftsDir")
      },
      sitePostsDir: {
        type: "string",
        "default": config.getDefault("sitePostsDir")
      },
      urlForTags: {
        title: "URL to Tags JSON definitions",
        type: "string",
        "default": config.getDefault("urlForTags")
      },
      urlForPosts: {
        title: "URL to Posts JSON definitions",
        type: "string",
        "default": config.getDefault("urlForPosts")
      },
      urlForCategories: {
        title: "URL to Categories JSON definitions",
        type: "string",
        "default": config.getDefault("urlForCategories")
      },
      newPostFileName: {
        type: "string",
        "default": config.getDefault("newPostFileName")
      },
      fileExtension: {
        type: "string",
        "default": config.getDefault("fileExtension")
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLEVBRlosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBRFQ7QUFBQSxRQUVBLE1BQUEsRUFBTyxDQUFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBQWlDLFNBQUEsYUFBQSxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUEsQ0FBQSxDQUZ4QztPQURGO0FBQUEsTUFJQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBbEIsQ0FEVDtPQUxGO0FBQUEsTUFPQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsY0FBbEIsQ0FEVDtPQVJGO0FBQUEsTUFVQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsZUFBbEIsQ0FEVDtPQVhGO0FBQUEsTUFhQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsY0FBbEIsQ0FEVDtPQWRGO0FBQUEsTUFnQkEsVUFBQSxF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
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/main.coffee