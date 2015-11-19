(function() {
  var NewFileView, NewPostView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NewFileView = require("./new-file-view");

  module.exports = NewPostView = (function(_super) {
    __extends(NewPostView, _super);

    function NewPostView() {
      return NewPostView.__super__.constructor.apply(this, arguments);
    }

    NewPostView.fileType = "Post";

    NewPostView.pathConfig = "sitePostsDir";

    NewPostView.fileNameConfig = "newPostFileName";

    return NewPostView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9uZXctcG9zdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUFkLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLFFBQUQsR0FBWSxNQUFaLENBQUE7O0FBQUEsSUFDQSxXQUFDLENBQUEsVUFBRCxHQUFjLGNBRGQsQ0FBQTs7QUFBQSxJQUVBLFdBQUMsQ0FBQSxjQUFELEdBQWtCLGlCQUZsQixDQUFBOzt1QkFBQTs7S0FEd0IsWUFIMUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/new-post-view.coffee
