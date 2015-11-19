(function() {
  var ManageFrontMatterView, ManagePostTagsView, config, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostTagsView = (function(_super) {
    __extends(ManagePostTagsView, _super);

    function ManagePostTagsView() {
      return ManagePostTagsView.__super__.constructor.apply(this, arguments);
    }

    ManagePostTagsView.labelName = "Manage Post Tags";

    ManagePostTagsView.fieldName = "tags";

    ManagePostTagsView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForTags");
      succeed = (function(_this) {
        return function(body) {
          var tags;
          tags = body.tags.map(function(tag) {
            return {
              name: tag,
              count: 0
            };
          });
          _this.rankTags(tags, _this.editor.getText());
          return _this.displaySiteFieldItems(tags.map(function(tag) {
            return tag.name;
          }));
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
        var tagRegex, _ref;
        tagRegex = RegExp("" + (utils.regexpEscape(tag.name)), "ig");
        return tag.count = ((_ref = content.match(tagRegex)) != null ? _ref.length : void 0) || 0;
      });
      return tags.sort(function(t1, t2) {
        return t2.count - t1.count;
      });
    };

    return ManagePostTagsView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9tYW5hZ2UtcG9zdC10YWdzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUdBLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSw0QkFBUixDQUh4QixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGtCQUFDLENBQUEsU0FBRCxHQUFZLGtCQUFaLENBQUE7O0FBQUEsSUFDQSxrQkFBQyxDQUFBLFNBQUQsR0FBWSxNQURaLENBQUE7O0FBQUEsaUNBR0Esd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsbUJBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsR0FBUCxDQUFXLFlBQVgsQ0FBTixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ1IsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFWLENBQWMsU0FBQyxHQUFELEdBQUE7bUJBQVM7QUFBQSxjQUFBLElBQUEsRUFBTSxHQUFOO0FBQUEsY0FBVyxLQUFBLEVBQU8sQ0FBbEI7Y0FBVDtVQUFBLENBQWQsQ0FBUCxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBZ0IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsQ0FBaEIsQ0FEQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxxQkFBRCxDQUF1QixJQUFJLENBQUMsR0FBTCxDQUFTLFNBQUMsR0FBRCxHQUFBO21CQUFTLEdBQUcsQ0FBQyxLQUFiO1VBQUEsQ0FBVCxDQUF2QixFQUhRO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEVixDQUFBO0FBQUEsTUFLQSxLQUFBLEdBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxHQUFBO2lCQUNOLEtBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxnQkFBWSxHQUFHLENBQUUsaUJBQUwsSUFBZ0IsQ0FBQyw0QkFBQSxHQUE0QixHQUE1QixHQUFnQyxHQUFqQyxDQUE1QixFQURNO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMUixDQUFBO2FBT0EsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLEVBQW1CLE9BQW5CLEVBQTRCLEtBQTVCLEVBUndCO0lBQUEsQ0FIMUIsQ0FBQTs7QUFBQSxpQ0FjQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQUMsR0FBRCxHQUFBO0FBQ1gsWUFBQSxjQUFBO0FBQUEsUUFBQSxRQUFBLEdBQVcsTUFBQSxDQUFBLEVBQUEsR0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFOLENBQW1CLEdBQUcsQ0FBQyxJQUF2QixDQUFELENBQUwsRUFBdUMsSUFBdkMsQ0FBWCxDQUFBO2VBQ0EsR0FBRyxDQUFDLEtBQUosbURBQW1DLENBQUUsZ0JBQXpCLElBQW1DLEVBRnBDO01BQUEsQ0FBYixDQUFBLENBQUE7YUFHQSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQUMsRUFBRCxFQUFLLEVBQUwsR0FBQTtlQUFZLEVBQUUsQ0FBQyxLQUFILEdBQVcsRUFBRSxDQUFDLE1BQTFCO01BQUEsQ0FBVixFQUpRO0lBQUEsQ0FkVixDQUFBOzs4QkFBQTs7S0FEK0Isc0JBTmpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/views/manage-post-tags-view.coffee
