(function() {
  var mouseEvent, objectCenterCoordinates, touchEvent;

  mouseEvent = function(type, properties) {
    var defaults, k, v;
    defaults = {
      bubbles: true,
      cancelable: type !== "mousemove",
      view: window,
      detail: 0,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: void 0
    };
    for (k in defaults) {
      v = defaults[k];
      if (properties[k] == null) {
        properties[k] = v;
      }
    }
    return new MouseEvent(type, properties);
  };

  touchEvent = function(type, touches) {
    var e, firstTouch, properties;
    firstTouch = touches[0];
    properties = {
      bubbles: true,
      cancelable: true,
      view: window,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      relatedTarget: void 0
    };
    e = new Event(type, properties);
    e.pageX = firstTouch.pageX;
    e.pageY = firstTouch.pageY;
    e.clientX = firstTouch.clientX;
    e.clientY = firstTouch.clientY;
    e.touches = e.targetTouches = e.changedTouches = touches;
    return e;
  };

  objectCenterCoordinates = function(obj) {
    var height, left, top, width, _ref;
    _ref = obj.getBoundingClientRect(), top = _ref.top, left = _ref.left, width = _ref.width, height = _ref.height;
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  };

  module.exports = {
    objectCenterCoordinates: objectCenterCoordinates,
    mouseEvent: mouseEvent
  };

  ['mousedown', 'mousemove', 'mouseup', 'click'].forEach(function(key) {
    return module.exports[key] = function(obj, _arg) {
      var btn, cx, cy, x, y, _ref, _ref1;
      _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, cx = _ref.cx, cy = _ref.cy, btn = _ref.btn;
      if (!((x != null) && (y != null))) {
        _ref1 = objectCenterCoordinates(obj), x = _ref1.x, y = _ref1.y;
      }
      if (!((cx != null) && (cy != null))) {
        cx = x;
        cy = y;
      }
      return obj.dispatchEvent(mouseEvent(key, {
        pageX: x,
        pageY: y,
        clientX: cx,
        clientY: cy,
        button: btn
      }));
    };
  });

  module.exports.mousewheel = function(obj, deltaX, deltaY) {
    if (deltaX == null) {
      deltaX = 0;
    }
    if (deltaY == null) {
      deltaY = 0;
    }
    return obj.dispatchEvent(mouseEvent('mousewheel', {
      deltaX: deltaX,
      deltaY: deltaY
    }));
  };

  ['touchstart', 'touchmove', 'touchend'].forEach(function(key) {
    return module.exports[key] = function(obj, _arg) {
      var cx, cy, x, y, _ref, _ref1;
      _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, cx = _ref.cx, cy = _ref.cy;
      if (!((x != null) && (y != null))) {
        _ref1 = objectCenterCoordinates(obj), x = _ref1.x, y = _ref1.y;
      }
      if (!((cx != null) && (cy != null))) {
        cx = x;
        cy = y;
      }
      return obj.dispatchEvent(touchEvent(key, [
        {
          pageX: x,
          pageY: y,
          clientX: cx,
          clientY: cy
        }
      ]));
    };
  });

}).call(this);
