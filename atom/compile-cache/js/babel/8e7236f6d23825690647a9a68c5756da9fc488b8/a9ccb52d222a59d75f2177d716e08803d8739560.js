'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
      var includeLink = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.message = message;
      this.includeLink = includeLink;
      this.status = false;
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var status = true;
      if (scope === 'Line') status = this.message.currentLine;else if (scope === 'File') status = this.message.currentFile;

      if (this.children.length && this.message.filePath) {
        var link = this.querySelector('.linter-message-link');
        if (link) {
          if (scope === 'Project') {
            link.querySelector('span').removeAttribute('hidden');
          } else {
            link.querySelector('span').setAttribute('hidden', true);
          }
        }
      }

      this.status = status;

      if (status) {
        this.removeAttribute('hidden');
      } else this.setAttribute('hidden', true);

      return this;
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      if (atom.config.get('linter.showProviderName') && this.message.linter) {
        this.appendChild(Message.getName(this.message));
      }
      this.appendChild(Message.getRibbon(this.message));
      this.appendChild(Message.getMessage(this.message, this.includeLink));
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');
      var displayFile = message.filePath;

      el.className = 'linter-message-link';

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
    value: function getMessage(message, includeLink) {
      if (message.multiline || NewLine.test(message.text)) {
        return Message.getMultiLineMessage(message, includeLink);
      }

      var el = document.createElement('span');
      var messageEl = document.createElement('linter-message-line');

      el.className = 'linter-message-item';

      el.appendChild(messageEl);

      if (includeLink && message.filePath) {
        el.appendChild(Message.getLink(message));
      }

      if (message.html && typeof message.html !== 'string') {
        messageEl.appendChild(message.html.cloneNode(true));
      } else if (message.html) {
        messageEl.innerHTML = message.html;
      } else if (message.text) {
        messageEl.textContent = message.text;
      }

      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message, includeLink) {
      var container = document.createElement('span');
      var messageEl = document.createElement('linter-multiline-message');

      container.className = 'linter-message-item';
      messageEl.setAttribute('title', message.text);

      message.text.split(NewLine).forEach(function (line, index) {
        if (!line) return;

        var el = document.createElement('linter-message-line');
        el.textContent = line;
        messageEl.appendChild(el);

        // Render the link in the "title" line.
        if (index === 0 && includeLink && message.filePath) {
          messageEl.appendChild(Message.getLink(message));
        }
      });

      container.appendChild(messageEl);

      messageEl.addEventListener('click', function (e) {
        // Avoid opening the message contents when we click the link.
        var link = e.target.tagName === 'A' ? e.target : e.target.parentNode;

        if (!link.classList.contains('linter-message-link')) {
          messageEl.classList.toggle('expanded');
        }
      });

      return container;
    }
  }, {
    key: 'getName',
    value: function getName(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight';
      el.textContent = message.linter;
      return el;
    }
  }, {
    key: 'getRibbon',
    value: function getRibbon(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight';
      el.className += ' ' + message['class'];
      el.textContent = message.type;
      return el;
    }
  }, {
    key: 'fromMessage',
    value: function fromMessage(message, includeLink) {
      return new MessageElement().initialize(message, includeLink);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7QUFFWCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUE7O0lBRVYsT0FBTztZQUFQLE9BQU87O1dBQVAsT0FBTzswQkFBUCxPQUFPOzsrQkFBUCxPQUFPOzs7ZUFBUCxPQUFPOztXQUNSLG9CQUFDLE9BQU8sRUFBc0I7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUNwQyxVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixVQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FDZSwwQkFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFVBQUksS0FBSyxLQUFLLE1BQU0sRUFDbEIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBLEtBQzlCLElBQUksS0FBSyxLQUFLLE1BQU0sRUFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBOztBQUVuQyxVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ2pELFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtBQUN2RCxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUN2QixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7V0FDckQsTUFBTTtBQUNMLGdCQUFJLENBQUMsYUFBYSxDQUFD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QU0sQ0FBQTtBQUMvQixhQUFPLEVBQUUsQ0FBQTtLQUNWOzs7V0FDZSxtQkFBQyxPQUFPLEVBQUU7QUFDeEIsVUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN6QyxRQUFFLENBQUMsU0FBUyxHQUFHLDJEQUEyRCxDQUFBO0FBQzFFLFFBQUUsQ0FBQyxTQUFTLFVBQVEsT0FBTyxTQUFNLEFBQUUsQ0FBQTtBQUNuQyxRQUFFLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7QUFDN0IsYUFBTyxFQUFFLENBQUE7S0FDVjs7O1dBQ2lCLHFCQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDdkMsYUFBTyxJQUFJLGNBQWMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7S0FDN0Q7OztTQTdJVSxPQUFPO0dBQVMsV0FBVzs7O0FBZ0pqQyxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFO0FBQ3ZFLFdBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztDQUM3QixDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9tZXNzYWdlLWVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBOZXdMaW5lID0gL1xccj9cXG4vXG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBpbml0aWFsaXplKG1lc3NhZ2UsIGluY2x1ZGVMaW5rID0gdHJ1ZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLmluY2x1ZGVMaW5rID0gaW5jbHVkZUxpbmtcbiAgICB0aGlzLnN0YXR1cyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1cGRhdGVWaXNpYmlsaXR5KHNjb3BlKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRydWVcbiAgICBpZiAoc2NvcGUgPT09ICdMaW5lJylcbiAgICAgIHN0YXR1cyA9IHRoaXMubWVzc2FnZS5jdXJyZW50TGluZVxuICAgIGVsc2UgaWYgKHNjb3BlID09PSAnRmlsZScpXG4gICAgICBzdGF0dXMgPSB0aGlzLm1lc3NhZ2UuY3VycmVudEZpbGVcblxuICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAmJiB0aGlzLm1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5saW50ZXItbWVzc2FnZS1saW5rJylcbiAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgIGlmIChzY29wZSA9PT0gJ1Byb2plY3QnKSB7XG4gICAgICAgICAgbGluay5xdWVyeVNlbGVjdG9yKCdzcGFuJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmsucXVlcnlTZWxlY3Rvcignc3BhbicpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzXG5cbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICB9IGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dQcm92aWRlck5hbWUnKSAmJiB0aGlzLm1lc3NhZ2UubGludGVyKSB7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TmFtZSh0aGlzLm1lc3NhZ2UpKVxuICAgIH1cbiAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0UmliYm9uKHRoaXMubWVzc2FnZSkpXG4gICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldE1lc3NhZ2UodGhpcy5tZXNzYWdlLCB0aGlzLmluY2x1ZGVMaW5rKSlcbiAgfVxuICBzdGF0aWMgZ2V0TGluayhtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICBjb25zdCBwYXRoRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBsZXQgZGlzcGxheUZpbGUgPSBtZXNzYWdlLmZpbGVQYXRoXG5cbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtbGluaydcblxuICAgIGZvciAobGV0IHBhdGggb2YgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkpXG4gICAgICBpZiAoZGlzcGxheUZpbGUuaW5kZXhPZihwYXRoKSA9PT0gMCkge1xuICAgICAgICBkaXNwbGF5RmlsZSA9IGRpc3BsYXlGaWxlLnN1YnN0cihwYXRoLmxlbmd0aCArIDEpIC8vIFBhdGggKyBQYXRoIFNlcGFyYXRvclxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gYGF0IGxpbmUgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LnJvdyArIDF9IGNvbCAke21lc3NhZ2UucmFuZ2Uuc3RhcnQuY29sdW1uICsgMX1gXG4gICAgfVxuICAgIHBhdGhFbC50ZXh0Q29udGVudCA9ICcgaW4gJyArIGRpc3BsYXlGaWxlXG4gICAgZWwuYXBwZW5kQ2hpbGQocGF0aEVsKVxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG1lc3NhZ2UuZmlsZVBhdGgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLnJhbmdlKSB7XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKG1lc3NhZ2UucmFuZ2Uuc3RhcnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZ2V0TWVzc2FnZShtZXNzYWdlLCBpbmNsdWRlTGluaykge1xuICAgIGlmIChtZXNzYWdlLm11bHRpbGluZSB8fCBOZXdMaW5lLnRlc3QobWVzc2FnZS50ZXh0KSkge1xuICAgICAgcmV0dXJuIE1lc3NhZ2UuZ2V0TXVsdGlMaW5lTWVzc2FnZShtZXNzYWdlLCBpbmNsdWRlTGluaylcbiAgICB9XG5cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGNvbnN0IG1lc3NhZ2VFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1tZXNzYWdlLWxpbmUnKVxuXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWl0ZW0nXG5cbiAgICBlbC5hcHBlbmRDaGlsZChtZXNzYWdlRWwpXG5cbiAgICBpZiAoaW5jbHVkZUxpbmsgJiYgbWVzc2FnZS5maWxlUGF0aCkge1xuICAgICAgZWwuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRMaW5rKG1lc3NhZ2UpKVxuICAgIH1cblxuICAgIGlmIChtZXNzYWdlLmh0bWwgJiYgdHlwZW9mIG1lc3NhZ2UuaHRtbCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG1lc3NhZ2VFbC5hcHBlbmRDaGlsZChtZXNzYWdlLmh0bWwuY2xvbmVOb2RlKHRydWUpKVxuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5odG1sKSB7XG4gICAgICBtZXNzYWdlRWwuaW5uZXJIVE1MID0gbWVzc2FnZS5odG1sXG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLnRleHQpIHtcbiAgICAgIG1lc3NhZ2VFbC50ZXh0Q29udGVudCA9IG1lc3NhZ2UudGV4dFxuICAgIH1cblxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRNdWx0aUxpbmVNZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgY29uc3QgbWVzc2FnZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLW11bHRpbGluZS1tZXNzYWdlJylcblxuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSdcbiAgICBtZXNzYWdlRWwuc2V0QXR0cmlidXRlKCd0aXRsZScsIG1lc3NhZ2UudGV4dClcblxuICAgIG1lc3NhZ2UudGV4dC5zcGxpdChOZXdMaW5lKS5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGluZGV4KSB7XG4gICAgICBpZiAoIWxpbmUpIHJldHVyblxuXG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1tZXNzYWdlLWxpbmUnKVxuICAgICAgZWwudGV4dENvbnRlbnQgPSBsaW5lXG4gICAgICBtZXNzYWdlRWwuYXBwZW5kQ2hpbGQoZWwpXG5cbiAgICAgIC8vIFJlbmRlciB0aGUgbGluayBpbiB0aGUgXCJ0aXRsZVwiIGxpbmUuXG4gICAgICBpZiAoaW5kZXggPT09IDAgJiYgaW5jbHVkZUxpbmsgJiYgbWVzc2FnZS5maWxlUGF0aCkge1xuICAgICAgICBtZXNzYWdlRWwuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRMaW5rKG1lc3NhZ2UpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobWVzc2FnZUVsKVxuXG4gICAgbWVzc2FnZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgLy8gQXZvaWQgb3BlbmluZyB0aGUgbWVzc2FnZSBjb250ZW50cyB3aGVuIHdlIGNsaWNrIHRoZSBsaW5rLlxuICAgICAgdmFyIGxpbmsgPSBlLnRhcmdldC50YWdOYW1lID09PSAnQScgPyBlLnRhcmdldCA6IGUudGFyZ2V0LnBhcmVudE5vZGVcblxuICAgICAgaWYgKCFsaW5rLmNsYXNzTGlzdC5jb250YWlucygnbGludGVyLW1lc3NhZ2UtbGluaycpKSB7XG4gICAgICAgIG1lc3NhZ2VFbC5jbGFzc0xpc3QudG9nZ2xlKCdleHBhbmRlZCcpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBjb250YWluZXJcbiAgfVxuICBzdGF0aWMgZ2V0TmFtZShtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSBiYWRnZSBiYWRnZS1mbGV4aWJsZSBsaW50ZXItaGlnaGxpZ2h0J1xuICAgIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZS5saW50ZXJcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZ2V0UmliYm9uKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtIGJhZGdlIGJhZGdlLWZsZXhpYmxlIGxpbnRlci1oaWdobGlnaHQnXG4gICAgZWwuY2xhc3NOYW1lICs9IGAgJHttZXNzYWdlLmNsYXNzfWBcbiAgICBlbC50ZXh0Q29udGVudCA9IG1lc3NhZ2UudHlwZVxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBmcm9tTWVzc2FnZShtZXNzYWdlLCBpbmNsdWRlTGluaykge1xuICAgIHJldHVybiBuZXcgTWVzc2FnZUVsZW1lbnQoKS5pbml0aWFsaXplKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBNZXNzYWdlRWxlbWVudCA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnbGludGVyLW1lc3NhZ2UnLCB7XG4gIHByb3RvdHlwZTogTWVzc2FnZS5wcm90b3R5cGVcbn0pXG4iXX0=
//# sourceURL=/Users/lildude/.atom/packages/linter/lib/ui/message-element.js
