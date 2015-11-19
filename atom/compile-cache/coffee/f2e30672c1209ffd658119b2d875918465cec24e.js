(function() {
  var NewDraftView, NewFileView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NewFileView = require("./new-file-view");

  module.exports = NewDraftView = (function(_super) {
    __extends(NewDraftView, _super);

    function NewDraftView() {
      return NewDraftView.__super__.constructor.apply(this, arguments);
    }

    NewDraftView.fileType = "Draft";

    NewDraftView.pathConfig = "siteDraftsDir";

    NewDraftView.fileNameConfig = "newDraftFileName";

    return NewDraftView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9uZXctZHJhZnQtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FBZCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxRQUFELEdBQVksT0FBWixDQUFBOztBQUFBLElBQ0EsWUFBQyxDQUFBLFVBQUQsR0FBYyxlQURkLENBQUE7O0FBQUEsSUFFQSxZQUFDLENBQUEsY0FBRCxHQUFrQixrQkFGbEIsQ0FBQTs7d0JBQUE7O0tBRHlCLFlBSDNCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/new-draft-view.coffee
