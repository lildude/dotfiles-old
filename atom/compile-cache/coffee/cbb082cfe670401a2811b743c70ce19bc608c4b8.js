(function() {
  var $, ManagePostCategoriesView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

  module.exports = ManagePostCategoriesView = (function(_super) {
    __extends(ManagePostCategoriesView, _super);

    function ManagePostCategoriesView() {
      return ManagePostCategoriesView.__super__.constructor.apply(this, arguments);
    }

    ManagePostCategoriesView.prototype.editor = null;

    ManagePostCategoriesView.prototype.frontMatter = null;

    ManagePostCategoriesView.prototype.categories = null;

    ManagePostCategoriesView.prototype.previouslyFocusedElement = null;

    ManagePostCategoriesView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-selection"
      }, (function(_this) {
        return function() {
          _this.label("Manage Post Categories", {
            "class": "icon icon-book"
          });
          _this.p({
            "class": "error",
            outlet: "error"
          });
          _this.subview("categoriesEditor", new TextEditorView({
            mini: true
          }));
          return _this.ul({
            "class": "candidates",
            outlet: "candidates"
          }, function() {
            return _this.li("Loading...");
          });
        };
      })(this));
    };

    ManagePostCategoriesView.prototype.initialize = function() {
      this.fetchCategories();
      this.candidates.on("click", "li", (function(_this) {
        return function(e) {
          return _this.appendCategory(e);
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.updateFrontMatter();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    ManagePostCategoriesView.prototype.updateFrontMatter = function() {
      this.frontMatter.categories = this.getEditorCategories();
      utils.updateFrontMatter(this.editor, this.frontMatter);
      return this.detach();
    };

    ManagePostCategoriesView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      if (utils.hasFrontMatter(this.editor.getText())) {
        this.setFrontMatter();
        this.setEditorCategories(this.frontMatter.categories);
        this.panel.show();
        return this.categoriesEditor.focus();
      } else {
        return this.detach();
      }
    };

    ManagePostCategoriesView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return ManagePostCategoriesView.__super__.detach.apply(this, arguments);
    };

    ManagePostCategoriesView.prototype.setFrontMatter = function() {
      this.frontMatter = utils.getFrontMatter(this.editor.getText());
      if (!this.frontMatter.categories) {
        return this.frontMatter.categories = [];
      } else if (typeof this.frontMatter.categories === "string") {
        return this.frontMatter.categories = [this.frontMatter.categories];
      }
    };

    ManagePostCategoriesView.prototype.setEditorCategories = function(categories) {
      return this.categoriesEditor.setText(categories.join(","));
    };

    ManagePostCategoriesView.prototype.getEditorCategories = function() {
      return this.categoriesEditor.getText().split(/\s*,\s*/).filter(function(c) {
        return !!c.trim();
      });
    };

    ManagePostCategoriesView.prototype.fetchCategories = function() {
      var error, succeed, uri;
      uri = config.get("urlForCategories");
      succeed = (function(_this) {
        return function(body) {
          _this.categories = body.categories;
          return _this.displayCategories(_this.categories);
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || "Categories are not available");
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    ManagePostCategoriesView.prototype.displayCategories = function(categories) {
      var tagElems;
      tagElems = categories.map((function(_this) {
        return function(tag) {
          if (_this.frontMatter.categories.indexOf(tag) < 0) {
            return "<li>" + tag + "</li>";
          } else {
            return "<li class='selected'>" + tag + "</li>";
          }
        };
      })(this));
      return this.candidates.empty().append(tagElems.join(""));
    };

    ManagePostCategoriesView.prototype.appendCategory = function(e) {
      var categories, category, idx;
      category = e.target.textContent;
      categories = this.getEditorCategories();
      idx = categories.indexOf(category);
      if (idx < 0) {
        categories.push(category);
        e.target.classList.add("selected");
      } else {
        categories.splice(idx, 1);
        e.target.classList.remove("selected");
      }
      this.setEditorCategories(categories);
      return this.categoriesEditor.focus();
    };

    return ManagePostCategoriesView;

  })(View);

}).call(this);
