(function() {
  var DOMStylesReader, Mixin, rotate,
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
      var filter, key, node, parent, scope, style, value, _base, _i, _len, _ref;
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
      style = getComputedStyle(parent);
      filter = style.getPropertyValue('-webkit-filter');
      value = style.getPropertyValue(property);
      if (filter.indexOf('hue-rotate') !== -1) {
        value = this.rotateHue(value, filter);
      }
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

    DOMStylesReader.prototype.rotateHue = function(value, filter) {
      var a, b, g, hue, r, _, _ref, _ref1, _ref2, _ref3;
      _ref = value.match(/rgb(a?)\((\d+), (\d+), (\d+)(, (\d+(\.\d+)?))?\)/), _ = _ref[0], _ = _ref[1], r = _ref[2], g = _ref[3], b = _ref[4], _ = _ref[5], a = _ref[6];
      _ref1 = filter.match(/hue-rotate\((\d+)deg\)/), _ = _ref1[0], hue = _ref1[1];
      _ref2 = [r, g, b, a, hue].map(Number), r = _ref2[0], g = _ref2[1], b = _ref2[2], a = _ref2[3], hue = _ref2[4];
      _ref3 = rotate(r, g, b, hue), r = _ref3[0], g = _ref3[1], b = _ref3[2];
      if (isNaN(a)) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      } else {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      }
    };

    return DOMStylesReader;

  })(Mixin);

  rotate = function(r, g, b, angle) {
    var B, G, R, clamp, cos, hueRotateB, hueRotateG, hueRotateR, lumB, lumG, lumR, matrix, sin;
    clamp = function(num) {
      return Math.ceil(Math.max(0, Math.min(255, num)));
    };
    matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    lumR = 0.2126;
    lumG = 0.7152;
    lumB = 0.0722;
    hueRotateR = 0.143;
    hueRotateG = 0.140;
    hueRotateB = 0.283;
    cos = Math.cos(angle * Math.PI / 180);
    sin = Math.sin(angle * Math.PI / 180);
    matrix[0] = lumR + (1 - lumR) * cos - (lumR * sin);
    matrix[1] = lumG - (lumG * cos) - (lumG * sin);
    matrix[2] = lumB - (lumB * cos) + (1 - lumB) * sin;
    matrix[3] = lumR - (lumR * cos) + hueRotateR * sin;
    matrix[4] = lumG + (1 - lumG) * cos + hueRotateG * sin;
    matrix[5] = lumB - (lumB * cos) - (hueRotateB * sin);
    matrix[6] = lumR - (lumR * cos) - ((1 - lumR) * sin);
    matrix[7] = lumG - (lumG * cos) + lumG * sin;
    matrix[8] = lumB + (1 - lumB) * cos + lumB * sin;
    R = clamp(matrix[0] * r + matrix[1] * g + matrix[2] * b);
    G = clamp(matrix[3] * r + matrix[4] * g + matrix[5] * b);
    B = clamp(matrix[6] * r + matrix[7] * g + matrix[8] * b);
    return [R, G, B];
  };

}).call(this);
