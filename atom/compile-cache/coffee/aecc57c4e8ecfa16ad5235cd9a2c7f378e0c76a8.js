(function() {
  var DOMStylesReader, Mixin,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  module.exports = DOMStylesReader = (function(_super) {
    __extends(DOMStylesReader, _super);

    function DOMStylesReader() {
      return DOMStylesReader.__super__.constructor.apply(this, arguments);
    }

    DOMStylesReader.domStylesCache = {};

    DOMStylesReader.prototype.retrieveStyleFromDom = function(scopes, property, shadowRoot, cache) {
      var key, node, parent, scope, value, _base, _i, _len, _ref;
      if (shadowRoot == null) {
        shadowRoot = true;
      }
      if (cache == null) {
        cache = true;
      }
      key = scopes.join(' ');
      if (cache && (((_ref = this.constructor.domStylesCache[key]) != null ? _ref[property] : void 0) != null)) {
        return this.constructor.domStylesCache[key][property];
      }
      this.ensureDummyNodeExistence(shadowRoot);
      if ((_base = this.constructor.domStylesCache)[key] == null) {
        _base[key] = {};
      }
      parent = this.dummyNode;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');
        if (parent != null) {
          parent.appendChild(node);
        }
        parent = node;
      }
      value = getComputedStyle(parent).getPropertyValue(property);
      this.dummyNode.innerHTML = '';
      if (value !== "") {
        this.constructor.domStylesCache[key][property] = value;
      }
      return value;
    };

    DOMStylesReader.prototype.ensureDummyNodeExistence = function(shadowRoot) {
      if (this.dummyNode == null) {
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
      }
      if (shadowRoot) {
        return this.minimapView.getEditorViewRoot().appendChild(this.dummyNode);
      } else {
        return this.editorView.appendChild(this.dummyNode);
      }
    };

    DOMStylesReader.prototype.invalidateCache = function() {
      return this.constructor.domStylesCache = {};
    };

    DOMStylesReader.prototype.invalidateIfFirstTokenization = function() {
      if (this.constructor.hasTokenizedOnce) {
        return;
      }
      this.invalidateCache();
      return this.constructor.hasTokenizedOnce = true;
    };

    return DOMStylesReader;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxjQUFELEdBQWlCLEVBQWpCLENBQUE7O0FBQUEsOEJBYUEsb0JBQUEsR0FBc0IsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixVQUFuQixFQUFvQyxLQUFwQyxHQUFBO0FBQ3BCLFVBQUEsc0RBQUE7O1FBRHVDLGFBQVc7T0FDbEQ7O1FBRHdELFFBQU07T0FDOUQ7QUFBQSxNQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVosQ0FBTixDQUFBO0FBRUEsTUFBQSxJQUFHLEtBQUEsSUFBVSwyRkFBYjtBQUNFLGVBQU8sSUFBQyxDQUFBLFdBQVcsQ0FBQyxjQUFlLENBQUEsR0FBQSxDQUFLLENBQUEsUUFBQSxDQUF4QyxDQURGO09BRkE7QUFBQSxNQUtBLElBQUMsQ0FBQSx3QkFBRCxDQUEwQixVQUExQixDQUxBLENBQUE7O2FBTTRCLENBQUEsR0FBQSxJQUFRO09BTnBDO0FBQUEsTUFRQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBUlYsQ0FBQTtBQVNBLFdBQUEsNkNBQUE7MkJBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFQLENBQUE7QUFBQSxRQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBZCxFQUFzQixHQUF0QixDQUhqQixDQUFBO0FBSUEsUUFBQSxJQUE0QixjQUE1QjtBQUFBLFVBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsSUFBbkIsQ0FBQSxDQUFBO1NBSkE7QUFBQSxRQUtBLE1BQUEsR0FBUyxJQUxULENBREY7QUFBQSxPQVRBO0FBQUEsTUFpQkEsS0FBQSxHQUFRLGdCQUFBLENBQWlCLE1BQWpCLENBQXdCLENBQUMsZ0JBQXpCLENBQTBDLFFBQTFDLENBakJSLENBQUE7QUFBQSxNQWtCQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUIsRUFsQnZCLENBQUE7QUFvQkEsTUFBQSxJQUEwRCxLQUFBLEtBQVMsRUFBbkU7QUFBQSxRQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsY0FBZSxDQUFBLEdBQUEsQ0FBSyxDQUFBLFFBQUEsQ0FBakMsR0FBNkMsS0FBN0MsQ0FBQTtPQXBCQTthQXFCQSxNQXRCb0I7SUFBQSxDQWJ0QixDQUFBOztBQUFBLDhCQXVDQSx3QkFBQSxHQUEwQixTQUFDLFVBQUQsR0FBQTtBQUN4QixNQUFBLElBQU8sc0JBQVA7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBYixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFqQixHQUE4QixRQUQ5QixDQURGO09BQUE7QUFHQSxNQUFBLElBQUcsVUFBSDtlQUNFLElBQUMsQ0FBQSxXQUFXLENBQUMsaUJBQWIsQ0FBQSxDQUFnQyxDQUFDLFdBQWpDLENBQTZDLElBQUMsQ0FBQSxTQUE5QyxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsU0FBekIsRUFIRjtPQUp3QjtJQUFBLENBdkMxQixDQUFBOztBQUFBLDhCQWdEQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTthQUNmLElBQUMsQ0FBQSxXQUFXLENBQUMsY0FBYixHQUE4QixHQURmO0lBQUEsQ0FoRGpCLENBQUE7O0FBQUEsOEJBbURBLDZCQUFBLEdBQStCLFNBQUEsR0FBQTtBQUM3QixNQUFBLElBQVUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxnQkFBdkI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLGdCQUFiLEdBQWdDLEtBSkg7SUFBQSxDQW5EL0IsQ0FBQTs7MkJBQUE7O0tBRDRCLE1BSDlCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/dom-styles-reader.coffee