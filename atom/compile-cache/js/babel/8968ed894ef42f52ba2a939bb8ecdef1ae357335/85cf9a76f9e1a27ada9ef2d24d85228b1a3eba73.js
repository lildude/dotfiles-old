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
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXRhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7O0lBRVAsU0FBUztXQUFULFNBQVM7MEJBQVQsU0FBUzs7Ozs7OztZQUFULFNBQVM7O2VBQVQsU0FBUzs7V0FFSCxvQkFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQzNCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUVoQyxVQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3JDLFVBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQTs7QUFFaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDOUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRWhDLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDeEM7OztTQUNTLFlBQUU7QUFDVixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7U0FDUyxVQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztBQUNELFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0tBQ3JCOzs7U0FFUSxVQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtLQUNuQzs7O1NBL0JHLFNBQVM7R0FBUyxXQUFXOztBQWtDbkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRTtBQUN6RSxXQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVM7Q0FDL0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXRhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQm90dG9tVGFiIGV4dGVuZHMgSFRNTEVsZW1lbnR7XG5cbiAgaW5pdGlhbGl6ZShDb250ZW50LCBvbkNsaWNrKSB7XG4gICAgdGhpcy5fYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLmlubmVySFRNTCA9IENvbnRlbnRcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci10YWInKVxuXG4gICAgdGhpcy5jb3VudFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLmNvdW50U3Bhbi5jbGFzc0xpc3QuYWRkKCdjb3VudCcpXG4gICAgdGhpcy5jb3VudFNwYW4udGV4dENvbnRlbnQgPSAnMCdcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKSlcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY291bnRTcGFuKVxuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spXG4gIH1cbiAgZ2V0IGFjdGl2ZSgpe1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVcbiAgfVxuICBzZXQgYWN0aXZlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG4gICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgfVxuXG4gIHNldCBjb3VudCh2YWx1ZSkge1xuICAgIHRoaXMuX2NvdW50ID0gdmFsdWVcbiAgICB0aGlzLmNvdW50U3Bhbi50ZXh0Q29udGVudCA9IHZhbHVlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb3R0b21UYWIgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1ib3R0b20tdGFiJywge1xuICBwcm90b3R5cGU6IEJvdHRvbVRhYi5wcm90b3R5cGVcbn0pXG4iXX0=