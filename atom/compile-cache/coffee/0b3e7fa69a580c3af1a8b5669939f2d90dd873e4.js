(function() {
  var $, FrontMatter, ManageFrontMatterView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  FrontMatter = require("./front-matter");

  config = require("./config");

  utils = require("./utils");

  module.exports = ManageFrontMatterView = (function(_super) {
    __extends(ManageFrontMatterView, _super);

    function ManageFrontMatterView() {
      return ManageFrontMatterView.__super__.constructor.apply(this, arguments);
    }

    ManageFrontMatterView.labelName = "Manage Field";

    ManageFrontMatterView.fieldName = "fieldName";

    ManageFrontMatterView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-selection"
      }, (function(_this) {
        return function() {
          _this.label(_this.labelName, {
            "class": "icon icon-book"
          });
          _this.p({
            "class": "error",
            outlet: "error"
          });
          _this.subview("fieldEditor", new TextEditorView({
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

    ManageFrontMatterView.prototype.initialize = function() {
      this.candidates.on("click", "li", (function(_this) {
        return function(e) {
          return _this.appendFieldItem(e);
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.saveFrontMatter();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    ManageFrontMatterView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.frontMatter = new FrontMatter(this.editor);
      if (this.frontMatter.isEmpty) {
        return this.detach();
      }
      this.fetchSiteFieldCandidates();
      this.frontMatter.normalizeField(this.constructor.fieldName);
      this.setEditorFieldItems(this.frontMatter.get(this.constructor.fieldName));
      this.panel.show();
      return this.fieldEditor.focus();
    };

    ManageFrontMatterView.prototype.detach = function() {
      var _ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((_ref1 = this.previouslyFocusedElement) != null) {
          _ref1.focus();
        }
      }
      return ManageFrontMatterView.__super__.detach.apply(this, arguments);
    };

    ManageFrontMatterView.prototype.saveFrontMatter = function() {
      this.frontMatter.set(this.constructor.fieldName, this.getEditorFieldItems());
      this.frontMatter.save();
      return this.detach();
    };

    ManageFrontMatterView.prototype.setEditorFieldItems = function(fieldItems) {
      return this.fieldEditor.setText(fieldItems.join(","));
    };

    ManageFrontMatterView.prototype.getEditorFieldItems = function() {
      return this.fieldEditor.getText().split(/\s*,\s*/).filter(function(c) {
        return !!c.trim();
      });
    };

    ManageFrontMatterView.prototype.fetchSiteFieldCandidates = function() {};

    ManageFrontMatterView.prototype.displaySiteFieldItems = function(siteFieldItems) {
      var fieldItems, tagElems;
      fieldItems = this.frontMatter.get(this.constructor.fieldName) || [];
      tagElems = siteFieldItems.map(function(tag) {
        if (fieldItems.indexOf(tag) < 0) {
          return "<li>" + tag + "</li>";
        } else {
          return "<li class='selected'>" + tag + "</li>";
        }
      });
      return this.candidates.empty().append(tagElems.join(""));
    };

    ManageFrontMatterView.prototype.appendFieldItem = function(e) {
      var fieldItem, fieldItems, idx;
      fieldItem = e.target.textContent;
      fieldItems = this.getEditorFieldItems();
      idx = fieldItems.indexOf(fieldItem);
      if (idx < 0) {
        fieldItems.push(fieldItem);
        e.target.classList.add("selected");
      } else {
        fieldItems.splice(idx, 1);
        e.target.classList.remove("selected");
      }
      this.setEditorFieldItems(fieldItems);
      return this.fieldEditor.focus();
    };

    return ManageFrontMatterView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9tYW5hZ2UtZnJvbnQtbWF0dGVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxzQkFBQSxjQUFWLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUZULENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FIUixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLHFCQUFDLENBQUEsU0FBRCxHQUFZLGNBQVosQ0FBQTs7QUFBQSxJQUNBLHFCQUFDLENBQUEsU0FBRCxHQUFZLFdBRFosQ0FBQTs7QUFBQSxJQUdBLHFCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywyQ0FBUDtPQUFMLEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkQsVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLEtBQUMsQ0FBQSxTQUFSLEVBQW1CO0FBQUEsWUFBQSxPQUFBLEVBQU8sZ0JBQVA7V0FBbkIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtBQUFBLFlBQWdCLE1BQUEsRUFBUSxP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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/manage-front-matter-view.coffee
