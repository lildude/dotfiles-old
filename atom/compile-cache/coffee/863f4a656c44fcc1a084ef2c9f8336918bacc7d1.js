(function() {
  var CompositeDisposable, CoveringView, NavigationView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  CoveringView = require('./covering-view').CoveringView;

  NavigationView = (function(_super) {
    __extends(NavigationView, _super);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.content = function(navigator, editor) {
      return this.div({
        "class": 'controls navigation'
      }, (function(_this) {
        return function() {
          _this.text(' ');
          return _this.span({
            "class": 'pull-right'
          }, function() {
            _this.button({
              "class": 'btn btn-xs',
              click: 'up',
              outlet: 'prevBtn'
            }, 'prev');
            return _this.button({
              "class": 'btn btn-xs',
              click: 'down',
              outlet: 'nextBtn'
            }, 'next');
          });
        };
      })(this));
    };

    NavigationView.prototype.initialize = function(navigator, editor) {
      this.navigator = navigator;
      this.subs = new CompositeDisposable;
      NavigationView.__super__.initialize.call(this, editor);
      this.prependKeystroke('merge-conflicts:previous-unresolved', this.prevBtn);
      this.prependKeystroke('merge-conflicts:next-unresolved', this.nextBtn);
      return this.subs.add(this.navigator.conflict.onDidResolveConflict((function(_this) {
        return function() {
          _this.deleteMarker(_this.cover());
          _this.remove();
          return _this.cleanup();
        };
      })(this)));
    };

    NavigationView.prototype.cleanup = function() {
      NavigationView.__super__.cleanup.apply(this, arguments);
      return this.subs.dispose();
    };

    NavigationView.prototype.cover = function() {
      return this.navigator.separatorMarker;
    };

    NavigationView.prototype.up = function() {
      var _ref;
      return this.scrollTo((_ref = this.navigator.previousUnresolved()) != null ? _ref.scrollTarget() : void 0);
    };

    NavigationView.prototype.down = function() {
      var _ref;
      return this.scrollTo((_ref = this.navigator.nextUnresolved()) != null ? _ref.scrollTarget() : void 0);
    };

    NavigationView.prototype.conflict = function() {
      return this.navigator.conflict;
    };

    NavigationView.prototype.toString = function() {
      return "{NavView of: " + (this.conflict()) + "}";
    };

    return NavigationView;

  })(CoveringView);

  module.exports = {
    NavigationView: NavigationView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L25hdmlnYXRpb24tdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSLEVBQWhCLFlBREQsQ0FBQTs7QUFBQSxFQUdNO0FBRUoscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFNBQUQsRUFBWSxNQUFaLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8scUJBQVA7T0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxHQUFOLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtXQUFOLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixZQUFBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsY0FBcUIsS0FBQSxFQUFPLElBQTVCO0FBQUEsY0FBa0MsTUFBQSxFQUFRLFNBQTFDO2FBQVIsRUFBNkQsTUFBN0QsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsY0FBcUIsS0FBQSxFQUFPLE1BQTVCO0FBQUEsY0FBb0MsTUFBQSxFQUFRLFNBQTVDO2FBQVIsRUFBK0QsTUFBL0QsRUFGeUI7VUFBQSxDQUEzQixFQUZpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsNkJBT0EsVUFBQSxHQUFZLFNBQUUsU0FBRixFQUFhLE1BQWIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFlBQUEsU0FDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQUEsQ0FBQSxtQkFBUixDQUFBO0FBQUEsTUFFQSwrQ0FBTSxNQUFOLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGdCQUFELENBQWtCLHFDQUFsQixFQUF5RCxJQUFDLENBQUEsT0FBMUQsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsaUNBQWxCLEVBQXFELElBQUMsQ0FBQSxPQUF0RCxDQUxBLENBQUE7YUFPQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxvQkFBcEIsQ0FBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNqRCxVQUFBLEtBQUMsQ0FBQSxZQUFELENBQWMsS0FBQyxDQUFBLEtBQUQsQ0FBQSxDQUFkLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxDQURBLENBQUE7aUJBRUEsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUhpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDLENBQVYsRUFSVTtJQUFBLENBUFosQ0FBQTs7QUFBQSw2QkFvQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsNkNBQUEsU0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxFQUZPO0lBQUEsQ0FwQlQsQ0FBQTs7QUFBQSw2QkF3QkEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsZ0JBQWQ7SUFBQSxDQXhCUCxDQUFBOztBQUFBLDZCQTBCQSxFQUFBLEdBQUksU0FBQSxHQUFBO0FBQUcsVUFBQSxJQUFBO2FBQUEsSUFBQyxDQUFBLFFBQUQsNERBQXlDLENBQUUsWUFBakMsQ0FBQSxVQUFWLEVBQUg7SUFBQSxDQTFCSixDQUFBOztBQUFBLDZCQTRCQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQUcsVUFBQSxJQUFBO2FBQUEsSUFBQyxDQUFBLFFBQUQsd0RBQXFDLENBQUUsWUFBN0IsQ0FBQSxVQUFWLEVBQUg7SUFBQSxDQTVCTixDQUFBOztBQUFBLDZCQThCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFkO0lBQUEsQ0E5QlYsQ0FBQTs7QUFBQSw2QkFnQ0EsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFJLGVBQUEsR0FBYyxDQUFDLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBRCxDQUFkLEdBQTJCLElBQS9CO0lBQUEsQ0FoQ1YsQ0FBQTs7MEJBQUE7O0tBRjJCLGFBSDdCLENBQUE7O0FBQUEsRUF1Q0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUFnQixjQUFoQjtHQXhDRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/view/navigation-view.coffee
