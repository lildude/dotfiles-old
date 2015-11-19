(function() {
  var $, NewDraftView, TextEditorView, View, config, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

  path = require("path");

  fs = require("fs-plus");

  module.exports = NewDraftView = (function(_super) {
    __extends(NewDraftView, _super);

    function NewDraftView() {
      return NewDraftView.__super__.constructor.apply(this, arguments);
    }

    NewDraftView.prototype.previouslyFocusedElement = null;

    NewDraftView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New Draft", {
            "class": "icon icon-file-add"
          });
          _this.div(function() {
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

    NewDraftView.prototype.initialize = function() {
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

    NewDraftView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewDraftView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return NewDraftView.__super__.detach.apply(this, arguments);
    };

    NewDraftView.prototype.updatePath = function() {
      return this.message.text("Create Draft At: " + (this.getPostPath()));
    };

    NewDraftView.prototype.createPost = function() {
      var error, post;
      try {
        post = this.getFullPath();
        if (fs.existsSync(post)) {
          return this.error.text("Draft " + (this.getFullPath()) + " already exists!");
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

    NewDraftView.prototype.getFullPath = function() {
      var localDir;
      localDir = config.get("siteLocalDir");
      return path.join(localDir, this.getPostPath());
    };

    NewDraftView.prototype.getPostPath = function() {
      var draftsDir;
      draftsDir = config.get("siteDraftsDir");
      return path.join(draftsDir, this.getFileName());
    };

    NewDraftView.prototype.getFileName = function() {
      var extension, title;
      title = utils.dasherize(this.titleEditor.getText() || "new draft");
      extension = config.get("fileExtension");
      return "" + title + extension;
    };

    NewDraftView.prototype.getFrontMatter = function() {
      return {
        layout: "post",
        published: false,
        slug: utils.dasherize(this.titleEditor.getText() || "new draft"),
        title: this.titleEditor.getText(),
        date: "" + (utils.getDateStr()) + " " + (utils.getTimeStr())
      };
    };

    NewDraftView.prototype.generateFrontMatter = function(data) {
      return utils.template(config.get("frontMatter"), data);
    };

    return NewDraftView;

  })(View);

}).call(this);
