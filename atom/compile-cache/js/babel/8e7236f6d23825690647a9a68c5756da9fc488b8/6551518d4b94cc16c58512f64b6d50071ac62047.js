Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var Interact = require('interact.js');

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    this.element.tabIndex = '-1';
    this.messagesElement = document.createElement('div');
    this.panel = atom.workspace.addBottomPanel({ item: this.element, visible: false, priority: 500 });
    this.visibility = false;
    this.visibleMessages = 0;
    this.alwaysTakeMinimumSpace = atom.config.get('linter.alwaysTakeMinimumSpace');
    this.errorPanelHeight = atom.config.get('linter.errorPanelHeight');
    this.configVisibility = atom.config.get('linter.showErrorPanel');
    this.scope = scope;
    this.messages = new Map();

    // Keep messages contained to measure height.
    this.element.appendChild(this.messagesElement);

    this.subscriptions.add(atom.config.onDidChange('linter.alwaysTakeMinimumSpace', function (_ref) {
      var newValue = _ref.newValue;
      var oldValue = _ref.oldValue;

      _this.alwaysTakeMinimumSpace = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.errorPanelHeight', function (_ref2) {
      var newValue = _ref2.newValue;
      var oldValue = _ref2.oldValue;

      _this.errorPanelHeight = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.showErrorPanel', function (_ref3) {
      var newValue = _ref3.newValue;
      var oldValue = _ref3.oldValue;

      _this.configVisibility = newValue;
      _this.updateVisibility();
    }));

    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.updateVisibility();
    }));

    Interact(this.element).resizable({ edges: { top: true } }).on('resizemove', function (event) {
      event.target.style.height = event.rect.height + 'px';
    }).on('resizeend', function (event) {
      atom.config.set('linter.errorPanelHeight', event.target.clientHeight);
    });
  }

  _createClass(BottomPanel, [{
    key: 'refresh',
    value: function refresh(scope) {
      this.scope = scope;
      this.visibleMessages = 0;

      for (var message of this.messages) {
        if (message[1].updateVisibility(scope).status) this.visibleMessages++;
      }

      this.updateVisibility();
    }
  }, {
    key: 'setMessages',
    value: function setMessages(_ref4) {
      var added = _ref4.added;
      var removed = _ref4.removed;

      if (removed.length) this.removeMessages(removed);

      for (var message of added) {
        var messageElement = _messageElement.Message.fromMessage(message);
        this.messagesElement.appendChild(messageElement);
        messageElement.updateVisibility(this.scope);
        if (messageElement.status) this.visibleMessages++;
        this.messages.set(message, messageElement);
      }

      this.updateVisibility();
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      var height = this.errorPanelHeight;

      if (this.alwaysTakeMinimumSpace) {
        // Add `1px` for the top border.
        height = Math.min(this.messagesElement.clientHeight + 1, height);
      }

      this.element.style.height = height + 'px';
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(removed) {
      for (var message of removed) {
        if (this.messages.has(message)) {
          var messageElement = this.messages.get(message);
          if (messageElement.status) this.visibleMessages--;
          this.messagesElement.removeChild(messageElement);
          this.messages['delete'](message);
        }
      }
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.visibility = this.configVisibility && this.paneVisibility && this.visibleMessages > 0;

      if (this.visibility) {
        this.panel.show();
        this.updateHeight();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      this.panel.destroy();
    }
  }]);

  return BottomPanel;
})();

exports.BottomPanel = BottomPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUdrQyxNQUFNOzs4QkFDbEIsbUJBQW1COztBQUp6QyxXQUFXLENBQUE7O0FBRVgsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBOztJQUkxQixXQUFXO0FBQ1gsV0FEQSxXQUFXLENBQ1YsS0FBSyxFQUFFOzs7MEJBRFIsV0FBVzs7QUFFcEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBdUIsQ0FBQTtBQUM1QyxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDckQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQTtBQUMvRixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2QixRQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQTtBQUN4QixRQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUM5RSxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUNsRSxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENB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RCxjQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ2pELGNBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ2hELGNBQUksQ0FBQyxRQUFRLFVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUM5QjtPQUNGO0tBQ0Y7OztXQUNZLHlCQUFHO0FBQ2QsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFBO0tBQ3ZCOzs7V0FDZSw0QkFBRztBQUNqQixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFBOztBQUUxRixVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNqQixZQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7T0FDcEIsTUFBTTtBQUNMLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDbEI7S0FDRjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDckIsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNyQjs7O1NBM0dVLFdBQVciLCJmaWxlIjoiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBJbnRlcmFjdCA9IHJlcXVpcmUoJ2ludGVyYWN0LmpzJylcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlLWVsZW1lbnQnXG5cbmV4cG9ydCBjbGFzcyBCb3R0b21QYW5lbCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItcGFuZWwnKSAvLyBUT0RPKHN0ZWVsYnJhaW4pOiBNYWtlIHRoaXMgYSBgZGl2YFxuICAgIHRoaXMuZWxlbWVudC50YWJJbmRleCA9ICctMSdcbiAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtpdGVtOiB0aGlzLmVsZW1lbnQsIHZpc2libGU6IGZhbHNlLCBwcmlvcml0eTogNTAwfSlcbiAgICB0aGlzLnZpc2liaWxpdHkgPSBmYWxzZVxuICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzID0gMFxuICAgIHRoaXMuYWx3YXlzVGFrZU1pbmltdW1TcGFjZSA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UnKVxuICAgIHRoaXMuZXJyb3JQYW5lbEhlaWdodCA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmVycm9yUGFuZWxIZWlnaHQnKVxuICAgIHRoaXMuY29uZmlnVmlzaWJpbGl0eSA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dFcnJvclBhbmVsJylcbiAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1hcCgpXG5cbiAgICAvLyBLZWVwIG1lc3NhZ2VzIGNvbnRhaW5lZCB0byBtZWFzdXJlIGhlaWdodC5cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tZXNzYWdlc0VsZW1lbnQpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsaW50ZXIuYWx3YXlzVGFrZU1pbmltdW1TcGFjZScsICh7bmV3VmFsdWUsIG9sZFZhbHVlfSkgPT4ge1xuICAgICAgdGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlID0gbmV3VmFsdWVcbiAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5lcnJvclBhbmVsSGVpZ2h0JywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmVycm9yUGFuZWxIZWlnaHQgPSBuZXdWYWx1ZVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLnNob3dFcnJvclBhbmVsJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgPSBuZXdWYWx1ZVxuICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgIHRoaXMucGFuZVZpc2liaWxpdHkgPSBwYW5lSXRlbSA9PT0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICAgIH0pKVxuXG4gICAgSW50ZXJhY3QodGhpcy5lbGVtZW50KS5yZXNpemFibGUoe2VkZ2VzOiB7dG9wOiB0cnVlfX0pXG4gICAgICAub24oJ3Jlc2l6ZW1vdmUnLCBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBgJHtldmVudC5yZWN0LmhlaWdodH1weGBcbiAgICAgIH0pXG4gICAgICAub24oJ3Jlc2l6ZWVuZCcsIGV2ZW50ID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuZXJyb3JQYW5lbEhlaWdodCcsIGV2ZW50LnRhcmdldC5jbGllbnRIZWlnaHQpXG4gICAgICB9KVxuICB9XG4gIHJlZnJlc2goc2NvcGUpIHtcbiAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IDBcblxuICAgIGZvciAobGV0IG1lc3NhZ2Ugb2YgdGhpcy5tZXNzYWdlcykge1xuICAgICAgaWYgKG1lc3NhZ2VbMV0udXBkYXRlVmlzaWJpbGl0eShzY29wZSkuc3RhdHVzKSB0aGlzLnZpc2libGVNZXNzYWdlcysrXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgfVxuICBzZXRNZXNzYWdlcyh7YWRkZWQsIHJlbW92ZWR9KSB7XG4gICAgaWYgKHJlbW92ZWQubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVNZXNzYWdlcyhyZW1vdmVkKVxuXG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiBhZGRlZCkge1xuICAgICAgY29uc3QgbWVzc2FnZUVsZW1lbnQgPSBNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudClcbiAgICAgIG1lc3NhZ2VFbGVtZW50LnVwZGF0ZVZpc2liaWxpdHkodGhpcy5zY29wZSlcbiAgICAgIGlmIChtZXNzYWdlRWxlbWVudC5zdGF0dXMpIHRoaXMudmlzaWJsZU1lc3NhZ2VzKytcbiAgICAgIHRoaXMubWVzc2FnZXMuc2V0KG1lc3NhZ2UsIG1lc3NhZ2VFbGVtZW50KVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpXG4gIH1cbiAgdXBkYXRlSGVpZ2h0KCkge1xuICAgIGxldCBoZWlnaHQgPSB0aGlzLmVycm9yUGFuZWxIZWlnaHRcblxuICAgIGlmICh0aGlzLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UpIHtcbiAgICAgIC8vIEFkZCBgMXB4YCBmb3IgdGhlIHRvcCBib3JkZXIuXG4gICAgICBoZWlnaHQgPSBNYXRoLm1pbih0aGlzLm1lc3NhZ2VzRWxlbWVudC5jbGllbnRIZWlnaHQgKyAxLCBoZWlnaHQpXG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGBcbiAgfVxuICByZW1vdmVNZXNzYWdlcyhyZW1vdmVkKSB7XG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiByZW1vdmVkKSB7XG4gICAgICBpZiAodGhpcy5tZXNzYWdlcy5oYXMobWVzc2FnZSkpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZUVsZW1lbnQgPSB0aGlzLm1lc3NhZ2VzLmdldChtZXNzYWdlKVxuICAgICAgICBpZiAobWVzc2FnZUVsZW1lbnQuc3RhdHVzKSB0aGlzLnZpc2libGVNZXNzYWdlcy0tXG4gICAgICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LnJlbW92ZUNoaWxkKG1lc3NhZ2VFbGVtZW50KVxuICAgICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXRWaXNpYmlsaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnZpc2liaWxpdHlcbiAgfVxuICB1cGRhdGVWaXNpYmlsaXR5KCkge1xuICAgIHRoaXMudmlzaWJpbGl0eSA9IHRoaXMuY29uZmlnVmlzaWJpbGl0eSAmJiB0aGlzLnBhbmVWaXNpYmlsaXR5ICYmIHRoaXMudmlzaWJsZU1lc3NhZ2VzID4gMFxuXG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eSkge1xuICAgICAgdGhpcy5wYW5lbC5zaG93KClcbiAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgfVxufVxuIl19
//# sourceURL=/Users/lildude/.atom/packages/linter/lib/ui/bottom-panel.js
