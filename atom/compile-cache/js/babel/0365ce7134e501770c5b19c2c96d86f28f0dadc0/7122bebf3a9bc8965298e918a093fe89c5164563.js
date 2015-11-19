'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Message = require('./message');

var BottomPanel = (function (_HTMLElement) {
  function BottomPanel() {
    _classCallCheck(this, BottomPanel);

    _get(Object.getPrototypeOf(BottomPanel.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(BottomPanel, _HTMLElement);

  _createClass(BottomPanel, [{
    key: 'prepare',
    value: function prepare() {
      // priority because of https://github.com/atom-community/linter/issues/668
      this.panel = atom.workspace.addBottomPanel({ item: this, visible: false, priority: 500 });
      this.panelVisibility = true;
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.panel.destroy();
    }
  }, {
    key: 'updateMessages',
    value: function updateMessages(messages, isProject) {
      this.clear();
      if (!messages.length) {
        this.visibility = false;
        return;
      }
      this.visibility = true;
      messages.forEach((function (message) {
        this.appendChild(Message.fromMessage(message, { addPath: isProject, cloneNode: true }));
      }).bind(this));
    }
  }, {
    key: 'clear',
    value: function clear() {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    }
  }, {
    key: 'panelVisibility',
    get: function get() {
      return this._panelVisibility;
    },
    set: function set(value) {
      this._panelVisibility = value;
      if (value) this.panel.show();else this.panel.hide();
    }
  }, {
    key: 'visibility',
    get: function get() {
      return this._visibility;
    },
    set: function set(value) {
      this._visibility = value;
      if (value) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }]);

  return BottomPanel;
})(HTMLElement);

module.exports = document.registerElement('linter-panel', { prototype: BottomPanel.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7OztBQUVaLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7SUFFNUIsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7O1lBQVgsV0FBVzs7ZUFBWCxXQUFXOztXQUVSLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUE7QUFDdkYsVUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUE7QUFDM0IsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3JCOzs7V0F5QmEsd0JBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRTtBQUNsQyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDWixVQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNwQixZQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2QixlQUFNO09BQ1A7QUFDRCxVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtBQUN0QixjQUFRLENBQUMsT0FBTyxDQUFDLENBQUEsVUFBUyxPQUFPLEVBQUU7QUFDakMsWUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtPQUN0RixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7S0FDZDs7O1dBRUksaUJBQUc7QUFDTixhQUFPLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDdEIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7T0FDbEM7S0FDRjs7O1NBdkNrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFBO0tBQzdCO1NBRWtCLGFBQUMsS0FBSyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7QUFDN0IsVUFBSSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQSxLQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0tBQ3ZCOzs7U0FFYSxlQUFHO0FBQ2YsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0tBQ3hCO1NBRWEsYUFBQyxLQUFLLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDeEIsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQy9CLE1BQU07QUFDTCxZQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNsQztLQUNGOzs7U0FsQ0csV0FBVztHQUFTLFdBQVc7O0FBd0RyQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxFQUFFLEVBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmxldCBNZXNzYWdlID0gcmVxdWlyZSgnLi9tZXNzYWdlJylcblxuY2xhc3MgQm90dG9tUGFuZWwgZXh0ZW5kcyBIVE1MRWxlbWVudHtcblxuICBwcmVwYXJlKCkge1xuICAgIC8vIHByaW9yaXR5IGJlY2F1c2Ugb2YgaHR0cHM6Ly9naXRodWIuY29tL2F0b20tY29tbXVuaXR5L2xpbnRlci9pc3N1ZXMvNjY4XG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtpdGVtOiB0aGlzLCB2aXNpYmxlOiBmYWxzZSwgcHJpb3JpdHk6IDUwMH0pXG4gICAgdGhpcy5wYW5lbFZpc2liaWxpdHkgPSB0cnVlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgfVxuXG4gIGdldCBwYW5lbFZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsVmlzaWJpbGl0eVxuICB9XG5cbiAgc2V0IHBhbmVsVmlzaWJpbGl0eSh2YWx1ZSkge1xuICAgIHRoaXMuX3BhbmVsVmlzaWJpbGl0eSA9IHZhbHVlXG4gICAgaWYgKHZhbHVlKSB0aGlzLnBhbmVsLnNob3coKVxuICAgIGVsc2UgdGhpcy5wYW5lbC5oaWRlKClcbiAgfVxuXG4gIGdldCB2aXNpYmlsaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmlsaXR5XG4gIH1cblxuICBzZXQgdmlzaWJpbGl0eSh2YWx1ZSkge1xuICAgIHRoaXMuX3Zpc2liaWxpdHkgPSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBpc1Byb2plY3QpIHtcbiAgICB0aGlzLmNsZWFyKClcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgdGhpcy52aXNpYmlsaXR5ID0gZmFsc2VcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnZpc2liaWxpdHkgPSB0cnVlXG4gICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZnJvbU1lc3NhZ2UobWVzc2FnZSwge2FkZFBhdGg6IGlzUHJvamVjdCwgY2xvbmVOb2RlOiB0cnVlfSkpXG4gICAgfS5iaW5kKHRoaXMpKVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgd2hpbGUgKHRoaXMuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmZpcnN0Q2hpbGQpXG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1wYW5lbCcsIHtwcm90b3R5cGU6IEJvdHRvbVBhbmVsLnByb3RvdHlwZX0pXG4iXX0=