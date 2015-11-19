'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var BottomTab = (function (_HTMLElement) {
  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(BottomTab, _HTMLElement);

  _createClass(BottomTab, [{
    key: 'prepare',
    value: function prepare(name) {
      this.name = name;
      this.attached = false;
      this.active = false;
      this.classList.add('linter-tab');
      this.countSpan = document.createElement('span');
      this.countSpan.classList.add('count');
      this.countSpan.textContent = '0';
      this.innerHTML = this.name + ' ';
      this.appendChild(this.countSpan);
      return this;
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.attached = true;
    }
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      this.attached = false;
    }
  }, {
    key: 'active',
    get: function get() {
      return this._active;
    },
    set: function set(value) {
      this._active = value;
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
    }
  }, {
    key: 'count',
    set: function set(value) {
      this.countSpan.textContent = value;
    }
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXRhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7SUFFUCxTQUFTO1dBQVQsU0FBUzswQkFBVCxTQUFTOzsrQkFBVCxTQUFTOzs7WUFBVCxTQUFTOztlQUFULFNBQVM7O1dBQ04saUJBQUMsSUFBSSxFQUFDO0FBQ1gsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNyQyxVQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUE7QUFDaEMsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQTtBQUNoQyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNoQyxhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FDZSw0QkFBRztBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtLQUNyQjs7O1dBQ2UsNEJBQUU7QUFDaEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7S0FDdEI7OztTQUNTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7U0FDUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztLQUNGOzs7U0FDUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtLQUNuQzs7O1NBaENHLFNBQVM7R0FBUyxXQUFXOztBQW1DbkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRTtBQUN6RSxXQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVM7Q0FDL0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXRhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQm90dG9tVGFiIGV4dGVuZHMgSFRNTEVsZW1lbnR7XG4gIHByZXBhcmUobmFtZSl7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMuYXR0YWNoZWQgPSBmYWxzZVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci10YWInKVxuICAgIHRoaXMuY291bnRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy5jb3VudFNwYW4uY2xhc3NMaXN0LmFkZCgnY291bnQnKVxuICAgIHRoaXMuY291bnRTcGFuLnRleHRDb250ZW50ID0gJzAnXG4gICAgdGhpcy5pbm5lckhUTUwgPSB0aGlzLm5hbWUgKyAnICdcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY291bnRTcGFuKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLmF0dGFjaGVkID0gdHJ1ZVxuICB9XG4gIGRldGFjaGVkQ2FsbGJhY2soKXtcbiAgICB0aGlzLmF0dGFjaGVkID0gZmFsc2VcbiAgfVxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVcbiAgfVxuICBzZXQgYWN0aXZlKHZhbHVlKSB7XG4gICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cbiAgfVxuICBzZXQgY291bnQodmFsdWUpIHtcbiAgICB0aGlzLmNvdW50U3Bhbi50ZXh0Q29udGVudCA9IHZhbHVlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb3R0b21UYWIgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1ib3R0b20tdGFiJywge1xuICBwcm90b3R5cGU6IEJvdHRvbVRhYi5wcm90b3R5cGVcbn0pXG4iXX0=