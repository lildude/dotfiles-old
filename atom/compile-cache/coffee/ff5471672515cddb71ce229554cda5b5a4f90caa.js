(function() {
  var $, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), View = _ref.View, $ = _ref.$;

  module.exports = TextEditorView = (function(_super) {
    __extends(TextEditorView, _super);

    function TextEditorView(params) {
      var attributes, mini, name, placeholderText, value;
      if (params == null) {
        params = {};
      }
      mini = params.mini, placeholderText = params.placeholderText, attributes = params.attributes;
      if (attributes == null) {
        attributes = {};
      }
      if (mini != null) {
        attributes['mini'] = mini;
      }
      if (placeholderText != null) {
        attributes['placeholder-text'] = placeholderText;
      }
      this.element = document.createElement('atom-text-editor');
      for (name in attributes) {
        value = attributes[name];
        this.element.setAttribute(name, value);
      }
      if (this.element.__spacePenView != null) {
        this.element.__spacePenView = this;
      }
      TextEditorView.__super__.constructor.apply(this, arguments);
      this.setModel(this.element.getModel());
    }

    TextEditorView.prototype.setModel = function(model) {
      this.model = model;
    };

    TextEditorView.prototype.getModel = function() {
      return this.model;
    };

    TextEditorView.prototype.getText = function() {
      return this.model.getText();
    };

    TextEditorView.prototype.setText = function(text) {
      return this.model.setText(text);
    };

    TextEditorView.prototype.hasFocus = function() {
      return this.element.hasFocus();
    };

    return TextEditorView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosRUFBQyxZQUFBLElBQUQsRUFBTyxTQUFBLENBQVAsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQ0FBQSxDQUFBOztBQUFhLElBQUEsd0JBQUMsTUFBRCxHQUFBO0FBQ1gsVUFBQSw4Q0FBQTs7UUFEWSxTQUFPO09BQ25CO0FBQUEsTUFBQyxjQUFBLElBQUQsRUFBTyx5QkFBQSxlQUFQLEVBQXdCLG9CQUFBLFVBQXhCLENBQUE7O1FBQ0EsYUFBYztPQURkO0FBRUEsTUFBQSxJQUE2QixZQUE3QjtBQUFBLFFBQUEsVUFBVyxDQUFBLE1BQUEsQ0FBWCxHQUFxQixJQUFyQixDQUFBO09BRkE7QUFHQSxNQUFBLElBQW9ELHVCQUFwRDtBQUFBLFFBQUEsVUFBVyxDQUFBLGtCQUFBLENBQVgsR0FBaUMsZUFBakMsQ0FBQTtPQUhBO0FBQUEsTUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLGtCQUF2QixDQUxYLENBQUE7QUFNQSxXQUFBLGtCQUFBO2lDQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsS0FBNUIsQ0FBQSxDQUFBO0FBQUEsT0FOQTtBQU9BLE1BQUEsSUFBa0MsbUNBQWxDO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsR0FBMEIsSUFBMUIsQ0FBQTtPQVBBO0FBQUEsTUFTQSxpREFBQSxTQUFBLENBVEEsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBQSxDQUFWLENBWEEsQ0FEVztJQUFBLENBQWI7O0FBQUEsNkJBY0EsUUFBQSxHQUFVLFNBQUUsS0FBRixHQUFBO0FBQVUsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQVY7SUFBQSxDQWRWLENBQUE7O0FBQUEsNkJBbUJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsTUFBSjtJQUFBLENBbkJWLENBQUE7O0FBQUEsNkJBd0JBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxFQURPO0lBQUEsQ0F4QlQsQ0FBQTs7QUFBQSw2QkE0QkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsSUFBZixFQURPO0lBQUEsQ0E1QlQsQ0FBQTs7QUFBQSw2QkFrQ0EsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUFBLEVBRFE7SUFBQSxDQWxDVixDQUFBOzswQkFBQTs7S0FGMkIsS0FIN0IsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lildude/.atom/packages/minimap/node_modules/atom-space-pen-views/lib/text-editor-view.coffee