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
        "default": config.getCurrentConfig("newPostFileName")
      },
      fileExtension: {
        type: "string",
        "default": config.getCurrentConfig("fileExtension")
      }
    },
    activate: function(state) {
      var commands, helpers;
      commands = {};
      helpers = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return commands["markdown-writer:new-" + file] = _this.createCommand("./new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      commands["markdown-writer:publish-draft"] = this.createCommand("./publish-draft");
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return commands["markdown-writer:manage-post-" + attr] = _this.createCommand("./manage-post-" + attr + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "keystroke", "strikethrough"].forEach((function(_this) {
        return function(style) {
          return commands["markdown-writer:toggle-" + style + "-text"] = _this.createCommand("./style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return commands["markdown-writer:toggle-" + style] = _this.createCommand("./style-line", {
            args: style
          });
        };
      })(this));
      ["link", "image", "table"].forEach((function(_this) {
        return function(media) {
          return commands["markdown-writer:insert-" + media] = _this.createCommand("./insert-" + media + "-view");
        };
      })(this));
      ["open-cheat-sheet", "insert-new-line", "jump-between-reference-definition", "jump-to-previous-heading", "jump-to-next-heading", "jump-to-next-table-cell", "format-table"].forEach((function(_this) {
        return function(command) {
          return helpers["markdown-writer:" + command] = _this.createHelper("./commands", command);
        };
      })(this));
      atom.commands.add("atom-workspace", commands);
      return atom.commands.add("atom-text-editor", helpers);
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
    createHelper: function(path, cmd) {
      return (function(_this) {
        return function(e) {
          if (!_this.isMarkdown()) {
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
      return CmdModule = {};
    },
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLEVBRlosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBRFQ7QUFBQSxRQUVBLE1BQUEsRUFBTyxDQUFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCLENBQWlDLFNBQUEsYUFBQSxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUEsQ0FBQSxDQUZ4QztPQURGO0FBQUEsTUFJQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBbEIsQ0FEVDtPQUxGO0FBQUEsTUFPQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsY0FBbEIsQ0FEVDtPQVJGO0FBQUEsTUFVQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsZUFBbEIsQ0FEVDtPQVhGO0FBQUEsTUFhQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsY0FBbEIsQ0FEVDtPQWRGO0FBQUEsTUFnQkEsVUFBQSxF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
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/main.coffee