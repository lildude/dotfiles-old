(function() {
  var ManageFrontMatterView, ManagePostCategoriesView, config, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ManageFrontMatterView = require("./manage-front-matter-view");

  config = require("./config");

  utils = require("./utils");

  module.exports = ManagePostCategoriesView = (function(_super) {
    __extends(ManagePostCategoriesView, _super);

    function ManagePostCategoriesView() {
      return ManagePostCategoriesView.__super__.constructor.apply(this, arguments);
    }

    ManagePostCategoriesView.labelName = "Manage Post Categories";

    ManagePostCategoriesView.fieldName = "categories";

    ManagePostCategoriesView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForCategories");
      succeed = (function(_this) {
        return function(body) {
          return _this.displaySiteFieldItems(body.categories || []);
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching categories from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    return ManagePostCategoriesView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9tYW5hZ2UtcG9zdC1jYXRlZ29yaWVzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxxQkFBQSxHQUF3QixPQUFBLENBQVEsNEJBQVIsQ0FBeEIsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQURULENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLHdCQUFDLENBQUEsU0FBRCxHQUFZLHdCQUFaLENBQUE7O0FBQUEsSUFDQSx3QkFBQyxDQUFBLFNBQUQsR0FBWSxZQURaLENBQUE7O0FBQUEsdUNBR0Esd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsbUJBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsR0FBUCxDQUFXLGtCQUFYLENBQU4sQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDUixLQUFDLENBQUEscUJBQUQsQ0FBdUIsSUFBSSxDQUFDLFVBQUwsSUFBbUIsRUFBMUMsRUFEUTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFYsQ0FBQTtBQUFBLE1BR0EsS0FBQSxHQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtpQkFDTixLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsZ0JBQVksR0FBRyxDQUFFLGlCQUFMLElBQWdCLENBQUMsa0NBQUEsR0FBa0MsR0FBbEMsR0FBc0MsR0FBdkMsQ0FBNUIsRUFETTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSFIsQ0FBQTthQUtBLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxFQUFtQixPQUFuQixFQUE0QixLQUE1QixFQU53QjtJQUFBLENBSDFCLENBQUE7O29DQUFBOztLQURxQyxzQkFMdkMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/manage-post-categories-view.coffee
