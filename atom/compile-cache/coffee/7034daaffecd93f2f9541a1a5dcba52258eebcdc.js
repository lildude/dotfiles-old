(function() {
  var CmdModule, CompositeDisposable, basicConfig, config,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require("atom").CompositeDisposable;

  config = require("./config");

  basicConfig = require("./config-basic");

  CmdModule = {};

  module.exports = {
    config: basicConfig,
    activate: function() {
      this.disposables = new CompositeDisposable();
      this.registerWorkspaceCommands();
      return this.registerEditorCommands();
    },
    registerWorkspaceCommands: function() {
      var workspaceCommands;
      workspaceCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.registerView("./views/new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command, {
            optOutGrammars: true
          });
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-workspace", workspaceCommands));
    },
    registerEditorCommands: function() {
      var editorCommands;
      editorCommands = {};
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.registerView("./views/manage-post-" + attr + "-view");
        };
      })(this));
      ["link", "image", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.registerView("./views/insert-" + media + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "keystroke", "strikethrough"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.registerCommand("./commands/style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.registerCommand("./commands/style-line", {
            args: style
          });
        };
      })(this));
      ["previous-heading", "next-heading", "next-table-cell", "reference-definition"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:jump-to-" + command] = _this.registerCommand("./commands/jump-to", {
            args: command
          });
        };
      })(this));
      ["insert-new-line", "indent-list-line"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-line", {
            args: command
          });
        };
      })(this));
      ["correct-order-list-numbers", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/format-text", {
            args: command
          });
        };
      })(this));
      ["publish-draft"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command);
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-text-editor", editorCommands));
    },
    registerView: function(path, options) {
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
    registerCommand: function(path, options) {
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
          return cmdInstance.trigger(e);
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
      this.disposables.dispose();
      return CmdModule = {};
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9tYXJrZG93bi13cml0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUZULENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBSGQsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxFQUxaLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsV0FBUjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxtQkFBQSxDQUFBLENBQW5CLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxzQkFBRCxDQUFBLEVBSlE7SUFBQSxDQUZWO0FBQUEsSUFRQSx5QkFBQSxFQUEyQixTQUFBLEdBQUE7QUFDekIsVUFBQSxpQkFBQTtBQUFBLE1BQUEsaUJBQUEsR0FBb0IsRUFBcEIsQ0FBQTtBQUFBLE1BRUEsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFpQixDQUFDLE9BQWxCLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDeEIsaUJBQWtCLENBQUMsc0JBQUEsR0FBc0IsSUFBdkIsQ0FBbEIsR0FDRSxLQUFDLENBQUEsWUFBRCxDQUFlLGNBQUEsR0FBYyxJQUFkLEdBQW1CLE9BQWxDLEVBQTBDO0FBQUEsWUFBQSxj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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/markdown-writer.coffee
