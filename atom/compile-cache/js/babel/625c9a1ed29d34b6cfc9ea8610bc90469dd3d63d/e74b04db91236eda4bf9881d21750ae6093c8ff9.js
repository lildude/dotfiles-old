'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewLine = /\r?\n/;

var Message = (function (_HTMLElement) {
  _inherits(Message, _HTMLElement);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Message, [{
    key: 'initialize',
    value: function initialize(message) {
      this.message = message;
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var status = true;
      if (scope === 'Line') status = this.message.currentLine;else if (scope === 'File') status = this.message.currentFile;

      if (this.children.length && this.message.filePath) if (scope === 'Project') this.children[this.children.length - 1].children[0].removeAttribute('hidden');else this.children[this.children.length - 1].children[0].setAttribute('hidden', true);

      if (status) this.removeAttribute('hidden');else this.setAttribute('hidden', true);
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.appendChild(Message.getRibbon(this.message));
      this.appendChild(Message.getMessage(this.message));

      if (this.message.filePath) {
        this.appendChild(Message.getLink(this.message));
      }
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');
      var displayFile = message.filePath;

      el.className = 'linter-message-item';

      for (var path of atom.project.getPaths()) {
        if (displayFile.indexOf(path) === 0) {
          displayFile = displayFile.substr(path.length + 1); // Path + Path Separator
          break;
        }
      }if (message.range) {
        el.textContent = 'at line ' + (message.range.start.row + 1) + ' col ' + (message.range.start.column + 1);
      }
      pathEl.textContent = ' in ' + displayFile;
      el.appendChild(pathEl);
      el.addEventListener('click', function () {
        atom.workspace.open(message.filePath).then(function () {
          if (message.range) {
            atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
          }
        });
      });
      return el;
    }
  }, {
    key: 'getMessage',
    value: function getMessage(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item';
      if (message.html && typeof message.html !== 'string') {
        el.appendChild(message.html.cloneNode(true));
      } else if (message.multiline || message.html && message.html.match(NewLine) || message.text && message.text.match(NewLine)) {
        return Message.getMultiLineMessage(message.html || message.text);
      } else {
        if (message.html) {
          el.innerHTML = message.html;
        } else if (message.text) {
          el.textContent = message.text;
        }
      }
      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message) {
      var container = document.createElement('linter-multiline-message');
      for (var line of message.split(NewLine)) {
        if (!line) continue;
        var el = document.createElement('linter-message-line');
        el.textContent = line;
        container.appendChild(el);
      }
      return container;
    }
  }, {
    key: 'getRibbon',
    value: function getRibbon(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight ' + message['class'];
      el.textContent = message.type;
      return el;
    }
  }, {
    key: 'fromMessage',
    value: function fromMessage(message) {
      return new MessageElement().initialize(message);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7QUFFWCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUE7O0lBRVYsT0FBTztZQUFQLE9BQU87O1dBQVAsT0FBTzswQkFBUCxPQUFPOzsrQkFBUCxPQUFPOzs7ZUFBUCxPQUFPOztXQUNSLG9CQUFDLE9BQU8sRUFBRTtBQUNsQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FDZSwwQkFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFVBQUksS0FBSyxLQUFLLE1BQU0sRUFDbEIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBLEtBQzlCLElBQUksS0FBSyxLQUFLLE1BQU0sRUFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBOztBQUVuQyxVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUMvQyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQSxLQUMxRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUV2RixVQUFJLE1BQU0sRUFDUixJQUFJLENBQUMsZUFB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QUE7S0FDaEQ7OztTQS9GVSxPQUFPO0dBQVMsV0FBVzs7O0FBa0dqQyxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFO0FBQ3ZFLFdBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztDQUM3QixDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9tZXNzYWdlLWVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBOZXdMaW5lID0gL1xccj9cXG4vXG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBpbml0aWFsaXplKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1cGRhdGVWaXNpYmlsaXR5KHNjb3BlKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRydWVcbiAgICBpZiAoc2NvcGUgPT09ICdMaW5lJylcbiAgICAgIHN0YXR1cyA9IHRoaXMubWVzc2FnZS5jdXJyZW50TGluZVxuICAgIGVsc2UgaWYgKHNjb3BlID09PSAnRmlsZScpXG4gICAgICBzdGF0dXMgPSB0aGlzLm1lc3NhZ2UuY3VycmVudEZpbGVcblxuICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAmJiB0aGlzLm1lc3NhZ2UuZmlsZVBhdGgpXG4gICAgICBpZiAoc2NvcGUgPT09ICdQcm9qZWN0JylcbiAgICAgICAgdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdLmNoaWxkcmVuWzBdLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgIGVsc2UgdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcblxuICAgIGlmIChzdGF0dXMpXG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICBlbHNlXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgfVxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRSaWJib24odGhpcy5tZXNzYWdlKSlcbiAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TWVzc2FnZSh0aGlzLm1lc3NhZ2UpKVxuXG4gICAgaWYgKHRoaXMubWVzc2FnZS5maWxlUGF0aCkge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldExpbmsodGhpcy5tZXNzYWdlKSlcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldExpbmsobWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgY29uc3QgcGF0aEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgbGV0IGRpc3BsYXlGaWxlID0gbWVzc2FnZS5maWxlUGF0aFxuXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWl0ZW0nXG5cbiAgICBmb3IgKGxldCBwYXRoIG9mIGF0b20ucHJvamVjdC5nZXRQYXRocygpKVxuICAgICAgaWYgKGRpc3BsYXlGaWxlLmluZGV4T2YocGF0aCkgPT09IDApIHtcbiAgICAgICAgZGlzcGxheUZpbGUgPSBkaXNwbGF5RmlsZS5zdWJzdHIocGF0aC5sZW5ndGggKyAxKSAvLyBQYXRoICsgUGF0aCBTZXBhcmF0b3JcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgIGlmIChtZXNzYWdlLnJhbmdlKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IGBhdCBsaW5lICR7bWVzc2FnZS5yYW5nZS5zdGFydC5yb3cgKyAxfSBjb2wgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LmNvbHVtbiArIDF9YFxuICAgIH1cbiAgICBwYXRoRWwudGV4dENvbnRlbnQgPSAnIGluICcgKyBkaXNwbGF5RmlsZVxuICAgIGVsLmFwcGVuZENoaWxkKHBhdGhFbClcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG1lc3NhZ2UuZmlsZVBhdGgpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKG1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24obWVzc2FnZS5yYW5nZS5zdGFydClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtJ1xuICAgIGlmIChtZXNzYWdlLmh0bWwgJiYgdHlwZW9mIG1lc3NhZ2UuaHRtbCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKG1lc3NhZ2UuaHRtbC5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG1lc3NhZ2UubXVsdGlsaW5lIHx8XG4gICAgICAobWVzc2FnZS5odG1sICYmIG1lc3NhZ2UuaHRtbC5tYXRjaChOZXdMaW5lKSkgfHxcbiAgICAgIChtZXNzYWdlLnRleHQgJiYgbWVzc2FnZS50ZXh0Lm1hdGNoKE5ld0xpbmUpKVxuICAgICkge1xuICAgICAgcmV0dXJuIE1lc3NhZ2UuZ2V0TXVsdGlMaW5lTWVzc2FnZShtZXNzYWdlLmh0bWwgfHwgbWVzc2FnZS50ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobWVzc2FnZS5odG1sKSB7XG4gICAgICAgIGVsLmlubmVySFRNTCA9IG1lc3NhZ2UuaHRtbFxuICAgICAgfSBlbHNlIGlmIChtZXNzYWdlLnRleHQpIHtcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnRleHRcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZSkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1tdWx0aWxpbmUtbWVzc2FnZScpXG4gICAgZm9yIChsZXQgbGluZSBvZiBtZXNzYWdlLnNwbGl0KE5ld0xpbmUpKSB7XG4gICAgICBpZiAoIWxpbmUpIGNvbnRpbnVlXG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1tZXNzYWdlLWxpbmUnKVxuICAgICAgZWwudGV4dENvbnRlbnQgPSBsaW5lXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpXG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXJcbiAgfVxuICBzdGF0aWMgZ2V0UmliYm9uKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGVsLmNsYXNzTmFtZSA9IGBsaW50ZXItbWVzc2FnZS1pdGVtIGJhZGdlIGJhZGdlLWZsZXhpYmxlIGxpbnRlci1oaWdobGlnaHQgJHttZXNzYWdlLmNsYXNzfWBcbiAgICBlbC50ZXh0Q29udGVudCA9IG1lc3NhZ2UudHlwZVxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBmcm9tTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlRWxlbWVudCgpLmluaXRpYWxpemUobWVzc2FnZSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1tZXNzYWdlJywge1xuICBwcm90b3R5cGU6IE1lc3NhZ2UucHJvdG90eXBlXG59KVxuIl19