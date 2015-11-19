(function() {
  var Multiline, MultilineElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Multiline = (function(_super) {
    __extends(Multiline, _super);

    function Multiline() {
      return Multiline.__super__.constructor.apply(this, arguments);
    }

    Multiline.prototype.attachedCallback = function() {
      var el, line, _i, _len, _ref, _results;
      this.tabIndex = 0;
      _ref = this.text.split(/\n/);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line) {
          el = document.createElement('linter-message-line');
          el.textContent = line;
          _results.push(this.appendChild(el));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Multiline.prototype.setText = function(text) {
      this.text = text;
      return this;
    };

    Multiline.fromText = function(text) {
      return new MultilineElement().setText(text);
    };

    return Multiline;

  })(HTMLElement);

  module.exports = MultilineElement = document.registerElement('linter-multiline-message', {
    prototype: Multiline.prototype
  });

  module.exports.fromText = Multiline.fromText;

}).call(this);
