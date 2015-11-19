'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var BottomTab = (function (_HTMLElement) {
  function BottomTab() {
    _classCallCheck(this, BottomTab);

    if (_HTMLElement != null) {
      _HTMLElement.apply(this, arguments);
    }
  }

  _inherits(BottomTab, _HTMLElement);

  _createClass(BottomTab, [{
    key: 'initialize',
    value: function initialize(Content, onClick) {
      this._active = false;
      this.innerHTML = Content;
      this.classList.add('linter-tab');

      this.countSpan = document.createElement('span');
      this.countSpan.classList.add('count');
      this.countSpan.textContent = '0';

      this.appendChild(document.createTextNode(' '));
      this.appendChild(this.countSpan);

      this.addEventListener('click', onClick);
    }
  }, {
    key: 'active',
    get: function () {
      return this._active;
    },
    set: function (value) {
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
      this._active = value;
    }
  }, {
    key: 'count',
    set: function (value) {
      this._count = value;
      this.countSpan.textContent = value;
    }
  }, {
    key: 'visibility',
    set: function (value) {
      if (value) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXRhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7O0lBRVAsU0FBUztXQUFULFNBQVM7MEJBQVQsU0FBUzs7Ozs7OztZQUFULFNBQVM7O2VBQVQsU0FBUzs7V0FFSCxvQkFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQzNCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUVoQyxVQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3JDLFVBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQTs7QUFFaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDOUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRWhDLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDeEM7OztTQUNTLFlBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7U0FDUyxVQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztBQUNELFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0tBQ3JCOzs7U0FDUSxVQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtLQUNuQzs7O1NBQ2EsVUFBQyxLQUFLLEVBQUM7QUFDbkIsVUFBRyxLQUFLLEVBQUM7QUFDUCxZQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQy9CLE1BQU07QUFDTCxZQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNsQztLQUNGOzs7U0FyQ0csU0FBUztHQUFTLFdBQVc7O0FBd0NuQyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFO0FBQ3pFLFdBQVMsRUFBRSxTQUFTLENBQUMsU0FBUztDQUMvQixDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBCb3R0b21UYWIgZXh0ZW5kcyBIVE1MRWxlbWVudHtcblxuICBpbml0aWFsaXplKENvbnRlbnQsIG9uQ2xpY2spIHtcbiAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuaW5uZXJIVE1MID0gQ29udGVudFxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbGludGVyLXRhYicpXG5cbiAgICB0aGlzLmNvdW50U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuY291bnRTcGFuLmNsYXNzTGlzdC5hZGQoJ2NvdW50JylcbiAgICB0aGlzLmNvdW50U3Bhbi50ZXh0Q29udGVudCA9ICcwJ1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnICcpKVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb3VudFNwYW4pXG5cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaylcbiAgfVxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVcbiAgfVxuICBzZXQgYWN0aXZlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG4gICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgfVxuICBzZXQgY291bnQodmFsdWUpIHtcbiAgICB0aGlzLl9jb3VudCA9IHZhbHVlXG4gICAgdGhpcy5jb3VudFNwYW4udGV4dENvbnRlbnQgPSB2YWx1ZVxuICB9XG4gIHNldCB2aXNpYmlsaXR5KHZhbHVlKXtcbiAgICBpZih2YWx1ZSl7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm90dG9tVGFiID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItYm90dG9tLXRhYicsIHtcbiAgcHJvdG90eXBlOiBCb3R0b21UYWIucHJvdG90eXBlXG59KVxuIl19