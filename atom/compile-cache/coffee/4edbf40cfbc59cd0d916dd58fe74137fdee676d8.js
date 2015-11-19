(function() {
  var $, NewFileView, TextEditorView, View, config, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

  path = require("path");

  fs = require("fs-plus");

  module.exports = NewFileView = (function(_super) {
    __extends(NewFileView, _super);

    function NewFileView() {
      return NewFileView.__super__.constructor.apply(this, arguments);
    }

    NewFileView.fileType = "File";

    NewFileView.pathConfig = "siteFilesDir";

    NewFileView.fileNameConfig = "newFileFileName";

    NewFileView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New " + _this.fileType, {
            "class": "icon icon-file-add"
          });
          _this.div(function() {
            _this.label("Directory", {
              "class": "message"
            });
            _this.subview("pathEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Date", {
              "class": "message"
            });
            _this.subview("dateEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.p({
            "class": "message",
            outlet: "message"
          });
          return _this.p({
            "class": "error",
            outlet: "error"
          });
        };
      })(this));
    };

    NewFileView.prototype.initialize = function() {
      this.pathEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.dateEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.titleEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.createPost();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    NewFileView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.dateEditor.setText(utils.getDateStr());
      this.pathEditor.setText(utils.dirTemplate(config.get(this.constructor.pathConfig)));
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewFileView.prototype.detach = function() {
      var _ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((_ref1 = this.previouslyFocusedElement) != null) {
          _ref1.focus();
        }
      }
      return NewFileView.__super__.detach.apply(this, arguments);
    };

    NewFileView.prototype.createPost = function() {
      var error, post;
      try {
        post = this.getFullPath();
        if (fs.existsSync(post)) {
          return this.error.text("File " + (this.getFullPath()) + " already exists!");
        } else {
          fs.writeFileSync(post, this.generateFrontMatter(this.getFrontMatter()));
          atom.workspace.open(post);
          return this.detach();
        }
      } catch (_error) {
        error = _error;
        return this.error.text("" + error.message);
      }
    };

    NewFileView.prototype.updatePath = function() {
      return this.message.html("<b>Site Directory:</b> " + (config.get('siteLocalDir')) + "/<br/>\n<b>Create " + this.constructor.fileType + " At:</b> " + (this.getPostPath()));
    };

    NewFileView.prototype.getFullPath = function() {
      return path.join(config.get("siteLocalDir"), this.getPostPath());
    };

    NewFileView.prototype.getPostPath = function() {
      return path.join(this.pathEditor.getText(), this.getFileName());
    };

    NewFileView.prototype.getFileName = function() {
      var info, template;
      template = config.get(this.constructor.fileNameConfig);
      info = {
        title: utils.dasherize(this.getTitle()),
        extension: config.get("fileExtension")
      };
      return utils.template(template, $.extend(info, this.getDate()));
    };

    NewFileView.prototype.getTitle = function() {
      return this.titleEditor.getText() || ("New " + this.constructor.fileType);
    };

    NewFileView.prototype.getDate = function() {
      return utils.parseDateStr(this.dateEditor.getText());
    };

    NewFileView.prototype.getPublished = function() {
      return this.constructor.fileType === 'Post';
    };

    NewFileView.prototype.generateFrontMatter = function(data) {
      return utils.template(config.get("frontMatter"), data);
    };

    NewFileView.prototype.getFrontMatter = function() {
      return {
        layout: "post",
        published: this.getPublished(),
        title: this.getTitle(),
        slug: utils.dasherize(this.getTitle()),
        date: "" + (this.dateEditor.getText()) + " " + (utils.getTimeStr()),
        dateTime: this.getDate()
      };
    };

    return NewFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9uZXctZmlsZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUZSLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSkwsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsUUFBRCxHQUFZLE1BQVosQ0FBQTs7QUFBQSxJQUNBLFdBQUMsQ0FBQSxVQUFELEdBQWMsY0FEZCxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLGNBQUQsR0FBa0IsaUJBRmxCLENBQUE7O0FBQUEsSUFJQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxpQkFBUDtPQUFMLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDN0IsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFRLFVBQUEsR0FBVSxLQUFDLENBQUEsUUFBbkIsRUFBK0I7QUFBQSxZQUFBLE9BQUEsRUFBTyxvQkFBUDtXQUEvQixD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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/new-file-view.coffee
