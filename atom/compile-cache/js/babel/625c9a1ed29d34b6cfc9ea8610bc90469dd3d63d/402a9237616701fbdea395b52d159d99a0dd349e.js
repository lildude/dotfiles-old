var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var Validate = require('./validate');
var Helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    var _this = this;

    _classCallCheck(this, MessageRegistry);

    this.hasChanged = false;
    this.shouldRefresh = true;
    this.publicMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.linterResponses = new Map();
    this.editorMessages = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', function (value) {
      return _this.ignoredMessageTypes = value || [];
    }));

    var UpdateMessages = function UpdateMessages() {
      if (_this.shouldRefresh) {
        if (_this.hasChanged) {
          _this.hasChanged = false;
          _this.updatePublic();
        }
        Helpers.requestUpdateFrame(UpdateMessages);
      }
    };
    Helpers.requestUpdateFrame(UpdateMessages);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var _this2 = this;

      var linter = _ref.linter;
      var messages = _ref.messages;
      var editor = _ref.editor;

      if (linter.deactivated) return;
      try {
        Validate.messages(messages);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editor.alive) return;
        if (!(editor instanceof _atom.TextEditor)) throw new Error("Given editor isn't really an editor");
        if (!this.editorMessages.has(editor)) this.editorMessages.set(editor, new Map());
        this.editorMessages.get(editor).set(linter, messages);
      } else {
        // It's project
        this.linterResponses.set(linter, messages);
      }
      this.hasChanged = true;
    }
  }, {
    key: 'updatePublic',
    value: function updatePublic() {
      var latestMessages = [];
      var publicMessages = [];
      var added = [];
      var removed = [];
      var currentKeys = undefined;
      var lastKeys = undefined;

      this.linterResponses.forEach(function (messages) {
        return latestMessages = latestMessages.concat(messages);
      });
      this.editorMessages.forEach(function (editorMessages) {
        return editorMessages.forEach(function (messages) {
          return latestMessages = latestMessages.concat(messages);
        });
      });

      currentKeys = latestMessages.map(function (i) {
        return i.key;
      });
      lastKeys = this.publicMessages.map(function (i) {
        return i.key;
      });

      for (var i of latestMessages) {
        if (lastKeys.indexOf(i.key) === -1) {
          added.push(i);
          publicMessages.push(i);
        }
      }

      for (var i of this.publicMessages) {
        if (currentKeys.indexOf(i.key) === -1) removed.push(i);else publicMessages.push(i);
      }this.publicMessages = publicMessages;
      this.emitter.emit('did-update-messages', { added: added, removed: removed, messages: publicMessages });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages(linter) {
      if (linter.scope === 'file') {
        this.editorMessages.forEach(function (r) {
          return r['delete'](linter);
        });
        this.hasChanged = true;
      } else if (this.linterResponses.has(linter)) {
        this.linterResponses['delete'](linter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'deleteEditorMessages',
    value: function deleteEditorMessages(editor) {
      if (!this.editorMessages.has(editor)) return;
      this.editorMessages['delete'](editor);
      this.hasChanged = true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.editorMessages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saWxkdWRlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUN1RCxNQUFNOztBQUQ3RCxXQUFXLENBQUE7O0FBR1gsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3RDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7SUFFOUIsZUFBZTtBQUNSLFdBRFAsZUFBZSxHQUNMOzs7MEJBRFYsZUFBZTs7QUFFakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFL0IsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLFVBQUEsS0FBSzthQUFJLE1BQUssbUJBQW1CLEdBQUksS0FBSyxJQUFJLEVBQUUsQUFBQztLQUFBLENBQUMsQ0FBQyxDQUFBOztBQUU1SCxRQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLEdBQVM7QUFDM0IsVUFBSSxNQUFLLGFBQWEsRUFBRTtBQUN0QixZQUFJLE1BQUssVUFBVSxFQUFFO0FBQ25CLGdCQUFLLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsZ0JB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VUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU07QUFDNUMsVUFBSSxDQUFDLGNBQWMsVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO0tBQ3ZCOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFBO0FBQzFCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQzVCOzs7U0EvRkcsZUFBZTs7O0FBa0dyQixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQSIsImZpbGUiOiIvVXNlcnMvbGlsZHVkZS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IHtFbWl0dGVyLCBUZXh0RWRpdG9yLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5jb25zdCBWYWxpZGF0ZSA9IHJlcXVpcmUoJy4vdmFsaWRhdGUnKVxuY29uc3QgSGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpXG5cbmNsYXNzIE1lc3NhZ2VSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gdHJ1ZVxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMgPSBuZXcgTWFwKClcbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVkTWVzc2FnZVR5cGVzJywgdmFsdWUgPT4gdGhpcy5pZ25vcmVkTWVzc2FnZVR5cGVzID0gKHZhbHVlIHx8IFtdKSkpXG5cbiAgICBjb25zdCBVcGRhdGVNZXNzYWdlcyA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlZCkge1xuICAgICAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICAgdGhpcy51cGRhdGVQdWJsaWMoKVxuICAgICAgICB9XG4gICAgICAgIEhlbHBlcnMucmVxdWVzdFVwZGF0ZUZyYW1lKFVwZGF0ZU1lc3NhZ2VzKVxuICAgICAgfVxuICAgIH1cbiAgICBIZWxwZXJzLnJlcXVlc3RVcGRhdGVGcmFtZShVcGRhdGVNZXNzYWdlcylcbiAgfVxuICBzZXQoe2xpbnRlciwgbWVzc2FnZXMsIGVkaXRvcn0pIHtcbiAgICBpZiAobGludGVyLmRlYWN0aXZhdGVkKSByZXR1cm5cbiAgICB0cnkge1xuICAgICAgVmFsaWRhdGUubWVzc2FnZXMobWVzc2FnZXMpXG4gICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gSGVscGVycy5lcnJvcihlKSB9XG4gICAgbWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoaSA9PiB0aGlzLmlnbm9yZWRNZXNzYWdlVHlwZXMuaW5kZXhPZihpLnR5cGUpID09PSAtMSlcbiAgICBpZiAobGludGVyLnNjb3BlID09PSAnZmlsZScpIHtcbiAgICAgIGlmICghZWRpdG9yLmFsaXZlKSByZXR1cm5cbiAgICAgIGlmICghKGVkaXRvciBpbnN0YW5jZW9mIFRleHRFZGl0b3IpKSB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBlZGl0b3IgaXNuJ3QgcmVhbGx5IGFuIGVkaXRvclwiKVxuICAgICAgaWYgKCF0aGlzLmVkaXRvck1lc3NhZ2VzLmhhcyhlZGl0b3IpKVxuICAgICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLnNldChlZGl0b3IsIG5ldyBNYXAoKSlcbiAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZ2V0KGVkaXRvcikuc2V0KGxpbnRlciwgbWVzc2FnZXMpXG4gICAgfSBlbHNlIHsgLy8gSXQncyBwcm9qZWN0XG4gICAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5zZXQobGludGVyLCBtZXNzYWdlcylcbiAgICB9XG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICB9XG4gIHVwZGF0ZVB1YmxpYygpIHtcbiAgICBsZXQgbGF0ZXN0TWVzc2FnZXMgPSBbXVxuICAgIGxldCBwdWJsaWNNZXNzYWdlcyA9IFtdXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBsZXQgcmVtb3ZlZCA9IFtdXG4gICAgbGV0IGN1cnJlbnRLZXlzXG4gICAgbGV0IGxhc3RLZXlzXG5cbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5mb3JFYWNoKG1lc3NhZ2VzID0+IGxhdGVzdE1lc3NhZ2VzID0gbGF0ZXN0TWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSlcbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmZvckVhY2goZWRpdG9yTWVzc2FnZXMgPT5cbiAgICAgIGVkaXRvck1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZXMgPT4gbGF0ZXN0TWVzc2FnZXMgPSBsYXRlc3RNZXNzYWdlcy5jb25jYXQobWVzc2FnZXMpKVxuICAgIClcblxuICAgIGN1cnJlbnRLZXlzID0gbGF0ZXN0TWVzc2FnZXMubWFwKGkgPT4gaS5rZXkpXG4gICAgbGFzdEtleXMgPSB0aGlzLnB1YmxpY01lc3NhZ2VzLm1hcChpID0+IGkua2V5KVxuXG4gICAgZm9yIChsZXQgaSBvZiBsYXRlc3RNZXNzYWdlcykge1xuICAgICAgaWYgKGxhc3RLZXlzLmluZGV4T2YoaS5rZXkpID09PSAtMSkge1xuICAgICAgICBhZGRlZC5wdXNoKGkpXG4gICAgICAgIHB1YmxpY01lc3NhZ2VzLnB1c2goaSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpIG9mIHRoaXMucHVibGljTWVzc2FnZXMpXG4gICAgICBpZiAoY3VycmVudEtleXMuaW5kZXhPZihpLmtleSkgPT09IC0xKVxuICAgICAgICByZW1vdmVkLnB1c2goaSlcbiAgICAgIGVsc2VcbiAgICAgICAgcHVibGljTWVzc2FnZXMucHVzaChpKVxuXG4gICAgdGhpcy5wdWJsaWNNZXNzYWdlcyA9IHB1YmxpY01lc3NhZ2VzXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7YWRkZWQsIHJlbW92ZWQsIG1lc3NhZ2VzOiBwdWJsaWNNZXNzYWdlc30pXG4gIH1cbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBkZWxldGVNZXNzYWdlcyhsaW50ZXIpIHtcbiAgICBpZiAobGludGVyLnNjb3BlID09PSAnZmlsZScpIHtcbiAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZm9yRWFjaChyID0+IHIuZGVsZXRlKGxpbnRlcikpXG4gICAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gICAgfSBlbHNlIGlmKHRoaXMubGludGVyUmVzcG9uc2VzLmhhcyhsaW50ZXIpKSB7XG4gICAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5kZWxldGUobGludGVyKVxuICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkZWxldGVFZGl0b3JNZXNzYWdlcyhlZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yTWVzc2FnZXMuaGFzKGVkaXRvcikpIHJldHVyblxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZGVsZXRlKGVkaXRvcilcbiAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnNob3VsZFJlZnJlc2ggPSBmYWxzZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5jbGVhcigpXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5jbGVhcigpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlUmVnaXN0cnlcbiJdfQ==