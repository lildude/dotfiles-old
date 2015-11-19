(function() {
  var CmdModule, basicConfig, config,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CmdModule = {};

  config = require("./config");

  basicConfig = {
    siteEngine: {
      title: "Site Engine",
      type: "string",
      "default": config.getDefault("siteEngine"),
      "enum": [config.getDefault("siteEngine")].concat(__slice.call(config.engineNames()))
    },
    siteUrl: {
      title: "Site URL",
      type: "string",
      "default": config.getDefault("siteUrl")
    },
    siteLocalDir: {
      title: "Site Local Directory",
      description: "The absolute path to your site's local directory",
      type: "string",
      "default": config.getDefault("siteLocalDir")
    },
    siteDraftsDir: {
      title: "Site Drafts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteDraftsDir")
    },
    sitePostsDir: {
      title: "Site Posts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("sitePostsDir")
    },
    siteImagesDir: {
      title: "Site Images Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteImagesDir")
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
    newDraftFileName: {
      title: "New Draft File Name",
      type: "string",
      "default": config.getCurrentDefault("newDraftFileName")
    },
    newPostFileName: {
      title: "New Post File Name",
      type: "string",
      "default": config.getCurrentDefault("newPostFileName")
    },
    fileExtension: {
      title: "File Extension",
      type: "string",
      "default": config.getCurrentDefault("fileExtension")
    },
    tableAlignment: {
      title: "Table Cell Alignment",
      type: "string",
      "default": config.getDefault("tableAlignment"),
      "enum": ["empty", "left", "right", "center"]
    },
    tableExtraPipes: {
      title: "Table Extra Pipes",
      description: "Insert extra pipes at the start and the end of the table rows",
      type: "boolean",
      "default": config.getDefault("tableExtraPipes")
    }
  };

  module.exports = {
    config: basicConfig,
    activate: function(state) {
      var editorCommands, workspaceCommands;
      workspaceCommands = {};
      editorCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.createCommand("./new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      workspaceCommands["markdown-writer:publish-draft"] = this.createCommand("./publish-draft");
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.createCommand("./manage-post-" + attr + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "keystroke", "strikethrough"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.createCommand("./style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.createCommand("./style-line", {
            args: style
          });
        };
      })(this));
      ["link", "image", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.createCommand("./insert-" + media + "-view");
        };
      })(this));
      ["insert-new-line", "indent-list-line", "correct-order-list-numbers", "jump-to-previous-heading", "jump-to-next-heading", "jump-between-reference-definition", "jump-to-next-table-cell", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.createHelper("./commands", command);
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.createHelper("./commands", command, {
            optOutGrammars: true
          });
        };
      })(this));
      this.wsCommands = atom.commands.add("atom-workspace", workspaceCommands);
      return this.edCommands = atom.commands.add("atom-text-editor", editorCommands);
    },
    createCommand: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
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
      })(this);
    },
    createHelper: function(path, cmd, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          if (!(options.optOutGrammars || _this.isMarkdown())) {
            return e.abortKeyBinding();
          }
          if (CmdModule[path] == null) {
            CmdModule[path] = require(path);
          }
          return CmdModule[path].trigger(cmd);
        };
      })(this);
    },
    isMarkdown: function() {
      var editor, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return false;
      }
      return _ref = editor.getGrammar().scopeName, __indexOf.call(config.get("grammars"), _ref) >= 0;
    },
    deactivate: function() {
      this.wsCommands.dispose();
      this.edCommands.dispose();
      return CmdModule = {};
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTtJQUFBO3lKQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLEVBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUZULENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsWUFBbEIsQ0FGVDtBQUFBLE1BR0EsTUFBQSxFQUFPLENBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsWUFBbEIsQ0FBaUMsU0FBQSxhQUFBLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBQSxDQUFBLENBSHhDO0tBREY7QUFBQSxJQUtBLE9BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLFVBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBbEIsQ0FGVDtLQU5GO0FBQUEsSUFTQSxZQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLGtEQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGNBQWxCLENBSFQ7S0FWRjtBQUFBLElBY0EsYUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sdUJBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxvREFEYjtBQUFBLE1BRUEsSUFBQSxF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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/main.coffee
