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


    /* Public */

    DOMStylesReader.prototype.retrieveStyleFromDom = function(scopes, property, shadowRoot, cache) {
      var key, node, parent, scope, value, _base, _i, _len, _ref;
      if (shadowRoot == null) {
        shadowRoot = true;
      }
      if (cache == null) {
        cache = true;
      }
      this.ensureCache();
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


    /* Internal */

    DOMStylesReader.prototype.ensureDummyNodeExistence = function(shadowRoot) {
      if (this.dummyNode == null) {
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
      }
      return this.getDummyDOMRoot(shadowRoot).appendChild(this.dummyNode);
    };

    DOMStylesReader.prototype.ensureCache = function() {
      var _base;
      return (_base = this.constructor).domStylesCache != null ? _base.domStylesCache : _base.domStylesCache = {};
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
