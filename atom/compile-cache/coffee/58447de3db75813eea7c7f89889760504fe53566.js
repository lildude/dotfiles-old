(function() {
  var $, NewPostView, TextEditorView, View, config, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

  path = require("path");

  fs = require("fs-plus");

  module.exports = NewPostView = (function(_super) {
    __extends(NewPostView, _super);

    function NewPostView() {
      return NewPostView.__super__.constructor.apply(this, arguments);
    }

    NewPostView.prototype.previouslyFocusedElement = null;

    NewPostView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New Post", {
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

    NewPostView.prototype.initialize = function() {
      this.titleEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
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

    NewPostView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.dateEditor.setText(utils.getDateStr());
      this.pathEditor.setText(utils.dirTemplate(config.get("sitePostsDir")));
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewPostView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return NewPostView.__super__.detach.apply(this, arguments);
    };

    NewPostView.prototype.updatePath = function() {
      return this.message.text("Create Post At: " + (this.getPostPath()));
    };

    NewPostView.prototype.createPost = function() {
      var error, post;
      try {
        post = this.getFullPath();
        if (fs.existsSync(post)) {
          return this.error.text("Post " + (this.getFullPath()) + " already exists!");
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

    NewPostView.prototype.getFullPath = function() {
      return path.join(config.get("siteLocalDir"), this.getPostPath());
    };

    NewPostView.prototype.getPostPath = function() {
      return path.join(this.pathEditor.getText(), this.getFileName());
    };

    NewPostView.prototype.getFileName = function() {
      var date, info, template;
      template = config.get("newPostFileName");
      date = utils.parseDateStr(this.dateEditor.getText());
      info = {
        title: utils.dasherize(this.titleEditor.getText() || "new post"),
        extension: config.get("fileExtension")
      };
      return utils.template(template, $.extend(info, date));
    };

    NewPostView.prototype.getFrontMatter = function() {
      return {
        layout: "post",
        published: true,
        slug: utils.dasherize(this.titleEditor.getText() || "new post"),
        title: this.titleEditor.getText(),
        date: "" + (this.dateEditor.getText()) + " " + (utils.getTimeStr())
      };
    };

    NewPostView.prototype.generateFrontMatter = function(data) {
      return utils.template(config.get("frontMatter"), data);
    };

    return NewPostView;

  })(View);

}).call(this);
