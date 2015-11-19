(function() {
  var MinimapOpenQuickSettingsView, MinimapQuickSettingsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  MinimapQuickSettingsView = require('./minimap-quick-settings-view');

  module.exports = MinimapOpenQuickSettingsView = (function(_super) {
    __extends(MinimapOpenQuickSettingsView, _super);

    function MinimapOpenQuickSettingsView() {
      return MinimapOpenQuickSettingsView.__super__.constructor.apply(this, arguments);
    }

    MinimapOpenQuickSettingsView.content = function() {
      return this.div({
        "class": 'open-minimap-quick-settings'
      });
    };

    MinimapOpenQuickSettingsView.prototype.dropdown = null;

    MinimapOpenQuickSettingsView.prototype.initialize = function(minimap) {
      return this.on('mousedown', (function(_this) {
        return function(e) {
          var css, offset;
          e.preventDefault();
          e.stopPropagation();
          if (_this.dropdown != null) {
            return _this.dropdown.destroy();
          } else {
            offset = minimap.offset();
            _this.dropdown = new MinimapQuickSettingsView(minimap);
            css = {
              top: offset.top
            };
            if (atom.config.get('minimap.displayMinimapOnLeft')) {
              css.left = offset.left + minimap.width();
            } else {
              css.right = window.innerWidth - offset.left;
            }
            _this.dropdown.css(css).attach();
            return _this.dropdown.on('minimap:quick-settings-destroyed', function() {
              _this.dropdown.off();
              return _this.dropdown = null;
            });
          }
        };
      })(this));
    };

    return MinimapOpenQuickSettingsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0Esd0JBQUEsR0FBMkIsT0FBQSxDQUFRLCtCQUFSLENBRDNCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbURBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsNEJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDZCQUFQO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwyQ0FHQSxRQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLDJDQUtBLFVBQUEsR0FBWSxTQUFDLE9BQUQsR0FBQTthQUNWLElBQUMsQ0FBQSxFQUFELENBQUksV0FBSixFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDZixjQUFBLFdBQUE7QUFBQSxVQUFBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxDQUFDLENBQUMsZUFBRixDQUFBLENBREEsQ0FBQTtBQUdBLFVBQUEsSUFBRyxzQkFBSDttQkFDRSxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxFQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQUEsQ0FBVCxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLHdCQUFBLENBQXlCLE9BQXpCLENBRGhCLENBQUE7QUFBQSxZQUdBLEdBQUEsR0FBTTtBQUFBLGNBQUEsR0FBQSxFQUFLLE1BQU0sQ0FBQyxHQUFaO2FBSE4sQ0FBQTtBQUlBLFlBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQUg7QUFDRSxjQUFBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsTUFBTSxDQUFDLElBQVAsR0FBYyxPQUFPLENBQUMsS0FBUixDQUFBLENBQXpCLENBREY7YUFBQSxNQUFBO0FBR0UsY0FBQSxHQUFHLENBQUMsS0FBSixHQUFhLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLE1BQU0sQ0FBQyxJQUF4QyxDQUhGO2FBSkE7QUFBQSxZQVNBLEtBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLEdBQWQsQ0FBa0IsQ0FBQyxNQUFuQixDQUFBLENBVEEsQ0FBQTttQkFXQSxLQUFDLENBQUEsUUFBUSxDQUFDLEVBQVYsQ0FBYSxrQ0FBYixFQUFpRCxTQUFBLEdBQUE7QUFDL0MsY0FBQSxLQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBQSxDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLFFBQUQsR0FBWSxLQUZtQztZQUFBLENBQWpELEVBZEY7V0FKZTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLEVBRFU7SUFBQSxDQUxaLENBQUE7O3dDQUFBOztLQUR5QyxLQUozQyxDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-open-quick-settings-view.coffee