(function() {
  var CompositeDisposable, DecorationManagement, Emitter, Minimap, nextModelId, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  DecorationManagement = require('./mixins/decoration-management');

  nextModelId = 1;

  module.exports = Minimap = (function() {
    DecorationManagement.includeInto(Minimap);


    /* Public */

    function Minimap(options) {
      var subs;
      if (options == null) {
        options = {};
      }
      this.textEditor = options.textEditor, this.standAlone = options.standAlone, this.width = options.width, this.height = options.height;
      if (this.textEditor == null) {
        throw new Error('Cannot create a minimap without an editor');
      }
      this.id = nextModelId++;
      this.emitter = new Emitter;
      this.subscriptions = subs = new CompositeDisposable;
      this.initializeDecorations();
      if (this.standAlone) {
        this.scrollTop = 0;
      }
      subs.add(atom.config.observe('editor.scrollPastEnd', (function(_this) {
        return function(scrollPastEnd) {
          _this.scrollPastEnd = scrollPastEnd;
          return _this.emitter.emit('did-change-config', {
            config: 'editor.scrollPastEnd',
            value: _this.scrollPastEnd
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charHeight',
            value: _this.charHeight
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charWidth',
            value: _this.charWidth
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.interline',
            value: _this.interline
          });
        };
      })(this)));
      subs.add(this.textEditor.onDidChange((function(_this) {
        return function(changes) {
          return _this.emitChanges(changes);
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollTop((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-top', _this);
          }
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollLeft((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-left', _this);
          }
        };
      })(this)));
      subs.add(this.textEditor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      subs.add(this.textEditor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.emitter.emit('did-change-config');
        };
      })(this)));
    }

    Minimap.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      return this.destroyed = true;
    };

    Minimap.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    Minimap.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    Minimap.prototype.onDidChangeConfig = function(callback) {
      return this.emitter.on('did-change-config', callback);
    };

    Minimap.prototype.onDidChangeScrollTop = function(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    };

    Minimap.prototype.onDidChangeScrollLeft = function(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    };

    Minimap.prototype.onDidChangeStandAlone = function(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    };

    Minimap.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    Minimap.prototype.isStandAlone = function() {
      return this.standAlone;
    };

    Minimap.prototype.setStandAlone = function(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        return this.emitter.emit('did-change-stand-alone', this);
      }
    };

    Minimap.prototype.getTextEditor = function() {
      return this.textEditor;
    };

    Minimap.prototype.getTextEditorScaledHeight = function() {
      return this.textEditor.getHeight() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollTop = function() {
      return this.textEditor.getScrollTop() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollLeft = function() {
      return this.textEditor.getScrollLeft() * this.getHorizontalScaleFactor();
    };

    Minimap.prototype.getTextEditorMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.displayBuffer.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.textEditor.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    Minimap.prototype.getTextEditorScrollRatio = function() {
      return this.textEditor.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    };

    Minimap.prototype.getCapedTextEditorScrollRatio = function() {
      return Math.min(1, this.getTextEditorScrollRatio());
    };

    Minimap.prototype.getHeight = function() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    };

    Minimap.prototype.getWidth = function() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    };

    Minimap.prototype.getVisibleHeight = function() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    };

    Minimap.prototype.getScreenHeight = function() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.textEditor.getHeight();
      }
    };

    Minimap.prototype.getVisibleWidth = function() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    };

    Minimap.prototype.getScreenWidth = function() {
      if (this.isStandAlone() && (this.width != null)) {
        return this.width;
      } else {
        return this.getWidth();
      }
    };

    Minimap.prototype.setScreenHeightAndWidth = function(height, width) {
      this.height = height;
      this.width = width;
    };

    Minimap.prototype.getVerticalScaleFactor = function() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    };

    Minimap.prototype.getHorizontalScaleFactor = function() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    };

    Minimap.prototype.getLineHeight = function() {
      return this.charHeight + this.interline;
    };

    Minimap.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    Minimap.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    Minimap.prototype.getInterline = function() {
      return this.interline;
    };

    Minimap.prototype.getFirstVisibleScreenRow = function() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    };

    Minimap.prototype.getLastVisibleScreenRow = function() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    };

    Minimap.prototype.getScrollTop = function() {
      if (this.standAlone) {
        return this.scrollTop;
      } else {
        return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
      }
    };

    Minimap.prototype.setScrollTop = function(scrollTop) {
      this.scrollTop = scrollTop;
      if (this.standAlone) {
        return this.emitter.emit('did-change-scroll-top', this);
      }
    };

    Minimap.prototype.getMaxScrollTop = function() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    };

    Minimap.prototype.canScroll = function() {
      return this.getMaxScrollTop() > 0;
    };

    Minimap.prototype.getMarker = function(id) {
      return this.textEditor.getMarker(id);
    };

    Minimap.prototype.findMarkers = function(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (_error) {
        return [];
      }
    };

    Minimap.prototype.markBufferRange = function(range) {
      return this.textEditor.markBufferRange(range);
    };

    Minimap.prototype.emitChanges = function(changes) {
      return this.emitter.emit('did-change', changes);
    };

    return Minimap;

  })();

}).call(this);
