(function() {
  module.exports = {
    config: {
      enabled: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      return atom.onDidBeep((function(_this) {
        return function() {
          if (!atom.config.get('visual-bell.enabled')) {
            return;
          }
          _this.addOverlay();
          return setTimeout((function() {
            return _this.removeOverlay();
          }), 300);
        };
      })(this));
    },
    deactivate: function() {
      return this.removeOverlay();
    },
    addOverlay: function() {
      if (this.overlay) {
        this.removeOverlay();
      }
      this.overlay = document.createElement('div');
      this.overlay.className = 'visual-bell';
      return atom.workspace.addBottomPanel({
        item: this.overlay
      });
    },
    removeOverlay: function() {
      var _ref;
      if ((_ref = this.overlay) != null) {
        _ref.remove();
      }
      return this.overlay = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FERjtLQURGO0FBQUEsSUFLQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2IsVUFBQSxJQUFBLENBQUEsSUFBa0IsQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsQ0FBZDtBQUFBLGtCQUFBLENBQUE7V0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQURBLENBQUE7aUJBRUEsVUFBQSxDQUFXLENBQUMsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBSDtVQUFBLENBQUQsQ0FBWCxFQUFrQyxHQUFsQyxFQUhhO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixFQURRO0lBQUEsQ0FMVjtBQUFBLElBV0EsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFELENBQUEsRUFEVTtJQUFBLENBWFo7QUFBQSxJQWNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQW9CLElBQUMsQ0FBQSxPQUFyQjtBQUFBLFFBQUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQixhQUZyQixDQUFBO2FBR0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsUUFBQyxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQVI7T0FBOUIsRUFKVTtJQUFBLENBZFo7QUFBQSxJQW9CQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxJQUFBOztZQUFRLENBQUUsTUFBVixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBRkU7SUFBQSxDQXBCZjtHQURGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/visual-bell/lib/visual-bell.coffee