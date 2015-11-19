(function() {
  var $, ManagePostTagsView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

  module.exports = ManagePostTagsView = (function(_super) {
    __extends(ManagePostTagsView, _super);

    function ManagePostTagsView() {
      return ManagePostTagsView.__super__.constructor.apply(this, arguments);
    }

    ManagePostTagsView.prototype.editor = null;

    ManagePostTagsView.prototype.frontMatter = null;

    ManagePostTagsView.prototype.tags = null;

    ManagePostTagsView.prototype.previouslyFocusedElement = null;

    ManagePostTagsView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-selection"
      }, (function(_this) {
        return function() {
          _this.label("Manage Post Tags", {
            "class": "icon icon-tag"
          });
          _this.p({
            "class": "error",
            outlet: "error"
          });
          _this.subview("tagsEditor", new TextEditorView({
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

    ManagePostTagsView.prototype.initialize = function() {
      this.fetchTags();
      this.candidates.on("click", "li", (function(_this) {
        return function(e) {
          return _this.appendTag(e);
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

    ManagePostTagsView.prototype.updateFrontMatter = function() {
      this.frontMatter.tags = this.getEditorTags();
      utils.updateFrontMatter(this.editor, this.frontMatter);
      return this.detach();
    };

    ManagePostTagsView.prototype.display = function() {
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
        this.setEditorTags(this.frontMatter.tags);
        this.panel.show();
        return this.tagsEditor.focus();
      } else {
        return this.detach();
      }
    };

    ManagePostTagsView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return ManagePostTagsView.__super__.detach.apply(this, arguments);
    };

    ManagePostTagsView.prototype.setFrontMatter = function() {
      this.frontMatter = utils.getFrontMatter(this.editor.getText());
      if (!this.frontMatter.tags) {
        return this.frontMatter.tags = [];
      } else if (typeof this.frontMatter.tags === "string") {
        return this.frontMatter.tags = [this.frontMatter.tags];
      }
    };

    ManagePostTagsView.prototype.setEditorTags = function(tags) {
      return this.tagsEditor.setText(tags.join(","));
    };

    ManagePostTagsView.prototype.getEditorTags = function() {
      return this.tagsEditor.getText().split(/\s*,\s*/).filter(function(t) {
        return !!t.trim();
      });
    };

    ManagePostTagsView.prototype.fetchTags = function() {
      var error, succeed, uri;
      uri = config.get("urlForTags");
      succeed = (function(_this) {
        return function(body) {
          _this.tags = body.tags.map(function(tag) {
            return {
              name: tag
            };
          });
          _this.rankTags(_this.tags, _this.editor.getText());
          return _this.displayTags(_this.tags);
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching tags from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    ManagePostTagsView.prototype.rankTags = function(tags, content) {
      tags.forEach(function(tag) {
        var tagRegex, _ref1;
        tagRegex = RegExp("" + (utils.regexpEscape(tag.name)), "ig");
        return tag.count = ((_ref1 = content.match(tagRegex)) != null ? _ref1.length : void 0) || 0;
      });
      return tags.sort(function(t1, t2) {
        return t2.count - t1.count;
      });
    };

    ManagePostTagsView.prototype.displayTags = function(tags) {
      var tagElems;
      tagElems = tags.map((function(_this) {
        return function(_arg) {
          var name;
          name = _arg.name;
          if (_this.frontMatter.tags.indexOf(name) < 0) {
            return "<li>" + name + "</li>";
          } else {
            return "<li class='selected'>" + name + "</li>";
          }
        };
      })(this));
      return this.candidates.empty().append(tagElems.join(""));
    };

    ManagePostTagsView.prototype.appendTag = function(e) {
      var idx, tag, tags;
      tag = e.target.textContent;
      tags = this.getEditorTags();
      idx = tags.indexOf(tag);
      if (idx < 0) {
        tags.push(tag);
        e.target.classList.add("selected");
      } else {
        tags.splice(idx, 1);
        e.target.classList.remove("selected");
      }
      this.setEditorTags(tags);
      return this.tagsEditor.focus();
    };

    return ManagePostTagsView;

  })(View);

}).call(this);
