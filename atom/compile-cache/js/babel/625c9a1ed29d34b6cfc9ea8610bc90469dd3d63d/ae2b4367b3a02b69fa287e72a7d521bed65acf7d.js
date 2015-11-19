'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BottomTab = (function (_HTMLElement) {
  _inherits(BottomTab, _HTMLElement);

  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

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
      this.count = 0;
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
    get: function get() {
      return this._count;
    },
    set: function set(value) {
      this._count = value;
      this.countSpan.textContent = value;
    }
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', { prototype: BottomTab.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXRhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7SUFFUCxTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztlQUFULFNBQVM7O1dBRU4saUJBQUMsSUFBSSxFQUFFO0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNyQyxVQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUE7QUFDaEMsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQTtBQUNoQyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQTtBQUNkLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUVlLDRCQUFHO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQ3JCOzs7V0FFZSw0QkFBRztBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtLQUN0Qjs7O1NBRVMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjtTQUVTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDN0IsTUFBTTtBQUNMLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7OztTQUVRLGVBQUU7QUFDVCxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7S0FDbkI7U0FFUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtLQUNuQzs7O1NBNUNHLFNBQVM7R0FBUyxXQUFXOztBQWdEbkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsUUFBUSxDQUNsQyxlQUFlLENBQ2QsbUJBQW1CLEVBQ25CLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLEVBQUMsQ0FDakMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvbGlsZHVkZS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS10YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEJvdHRvbVRhYiBleHRlbmRzIEhUTUxFbGVtZW50e1xuXG4gIHByZXBhcmUobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLmF0dGFjaGVkID0gZmFsc2VcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdsaW50ZXItdGFiJylcbiAgICB0aGlzLmNvdW50U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuY291bnRTcGFuLmNsYXNzTGlzdC5hZGQoJ2NvdW50JylcbiAgICB0aGlzLmNvdW50U3Bhbi50ZXh0Q29udGVudCA9ICcwJ1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdGhpcy5uYW1lICsgJyAnXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvdW50U3BhbilcbiAgICB0aGlzLmNvdW50ID0gMFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuYXR0YWNoZWQgPSB0cnVlXG4gIH1cblxuICBkZXRhY2hlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuYXR0YWNoZWQgPSBmYWxzZVxuICB9XG5cbiAgZ2V0IGFjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlXG4gIH1cblxuICBzZXQgYWN0aXZlKHZhbHVlKSB7XG4gICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cbiAgfVxuXG4gIGdldCBjb3VudCgpe1xuICAgIHJldHVybiB0aGlzLl9jb3VudFxuICB9XG5cbiAgc2V0IGNvdW50KHZhbHVlKSB7XG4gICAgdGhpcy5fY291bnQgPSB2YWx1ZVxuICAgIHRoaXMuY291bnRTcGFuLnRleHRDb250ZW50ID0gdmFsdWVcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm90dG9tVGFiID0gZG9jdW1lbnRcbiAgLnJlZ2lzdGVyRWxlbWVudChcbiAgICAnbGludGVyLWJvdHRvbS10YWInLFxuICAgIHtwcm90b3R5cGU6IEJvdHRvbVRhYi5wcm90b3R5cGV9XG4gIClcbiJdfQ==