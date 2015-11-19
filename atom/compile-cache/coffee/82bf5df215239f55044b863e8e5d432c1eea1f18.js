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
    newPostFileName: {
      title: "New Post File Name",
      type: "string",
      "default": config.getCurrentDefault("newPostFileName")
    },
    fileExtension: {
      title: "File Extension",
      type: "string",
      "default": config.getCurrentDefault("fileExtension")
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
      workspaceCommands["markdown-writer:open-cheat-sheet"] = this.createHelper("./commands", "open-cheat-sheet", {
        optOutGrammars: true
      });
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
