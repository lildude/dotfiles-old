(function() {
  var $, NewFileView, TextEditorView, View, config, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  config = require("../config");

  utils = require("../utils");

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
      utils.setTabIndex([this.titleEditor, this.pathEditor, this.dateEditor]);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9uZXctZmlsZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FKVCxDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsUUFBRCxHQUFZLE1BQVosQ0FBQTs7QUFBQSxJQUNBLFdBQUMsQ0FBQSxVQUFELEdBQWMsY0FEZCxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLGNBQUQsR0FBa0IsaUJBRmxCLENBQUE7O0FBQUEsSUFJQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxpQkFBUDtPQUFMLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDN0IsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFRLFVBQUEsR0FBVSxLQUFDLENBQUEsUUFBbkIsRUFBK0I7QUFBQSxZQUFBLE9BQUEsRUFBTyxvQkFBUDtX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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/views/new-file-view.coffee
