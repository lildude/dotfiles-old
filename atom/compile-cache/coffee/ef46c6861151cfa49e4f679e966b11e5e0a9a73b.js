(function() {
  var MinimapOpenQuickSettingsView, MinimapQuickSettingsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

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
            return _this.dropdown.onDidDestroy(function() {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLHdCQUFBLEdBQTJCLE9BQUEsQ0FBUSwrQkFBUixDQUQzQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1EQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLDRCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyw2QkFBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMkNBR0EsUUFBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSwyQ0FLQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7YUFDVixJQUFDLENBQUEsRUFBRCxDQUFJLFdBQUosRUFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsY0FBQSxXQUFBO0FBQUEsVUFBQSxDQUFDLENBQUMsY0FBRixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxDQURBLENBQUE7QUFHQSxVQUFBLElBQUcsc0JBQUg7bUJBQ0UsS0FBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFERjtXQUFBLE1BQUE7QUFHRSxZQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBUixDQUFBLENBQVQsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSx3QkFBQSxDQUF5QixPQUF6QixDQURoQixDQUFBO0FBQUEsWUFHQSxHQUFBLEdBQU07QUFBQSxjQUFBLEdBQUEsRUFBSyxNQUFNLENBQUMsR0FBWjthQUhOLENBQUE7QUFJQSxZQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixDQUFIO0FBQ0UsY0FBQSxHQUFHLENBQUMsSUFBSixHQUFXLE1BQU0sQ0FBQyxJQUFQLEdBQWMsT0FBTyxDQUFDLEtBQVIsQ0FBQSxDQUF6QixDQURGO2FBQUEsTUFBQTtBQUdFLGNBQUEsR0FBRyxDQUFDLEtBQUosR0FBYSxNQUFNLENBQUMsVUFBUCxHQUFvQixNQUFNLENBQUMsSUFBeEMsQ0FIRjthQUpBO0FBQUEsWUFTQSxLQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBYyxHQUFkLENBQWtCLENBQUMsTUFBbkIsQ0FBQSxDQVRBLENBQUE7bUJBV0EsS0FBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLENBQXVCLFNBQUEsR0FBQTtBQUNyQixjQUFBLEtBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFBLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsUUFBRCxHQUFZLEtBRlM7WUFBQSxDQUF2QixFQWRGO1dBSmU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixFQURVO0lBQUEsQ0FMWixDQUFBOzt3Q0FBQTs7S0FEeUMsS0FKM0MsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-open-quick-settings-view.coffee