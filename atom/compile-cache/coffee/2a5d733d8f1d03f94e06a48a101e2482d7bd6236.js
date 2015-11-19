(function() {
  var BetaAdater, CompositeDisposable, DecorationManagement, Emitter, LegacyAdater, Minimap, nextModelId, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  DecorationManagement = require('./mixins/decoration-management');

  LegacyAdater = require('./adapters/legacy-adapter');

  BetaAdater = require('./adapters/beta-adapter');

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
      if (atom.views.getView(this.textEditor).getScrollTop != null) {
        this.adapter = new BetaAdater(this.textEditor);
      } else {
        this.adapter = new LegacyAdater(this.textEditor);
      }
      if (this.standAlone) {
        this.scrollTop = 0;
      }
      subs.add(atom.config.observe('editor.scrollPastEnd', (function(_this) {
        return function(scrollPastEnd) {
          _this.scrollPastEnd = scrollPastEnd;
          _this.adapter.scrollPastEnd = _this.scrollPastEnd;
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
      subs.add(this.adapter.onDidChangeScrollTop((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-top', _this);
          }
        };
      })(this)));
      subs.add(this.adapter.onDidChangeScrollLeft((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-left', _this);
          }
        };
      })(this)));
      subs.add(this.textEditor.onDidChange((function(_this) {
        return function(changes) {
          return _this.emitChanges(changes);
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
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollTop = function() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollLeft = function() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    };

    Minimap.prototype.getTextEditorMaxScrollTop = function() {
      return this.adapter.getMaxScrollTop();
    };

    Minimap.prototype.getTextEditorScrollTop = function() {
      return this.adapter.getScrollTop();
    };

    Minimap.prototype.setTextEditorScrollTop = function(scrollTop) {
      return this.adapter.setScrollTop(scrollTop);
    };

    Minimap.prototype.getTextEditorScrollLeft = function() {
      return this.adapter.getScrollLeft();
    };

    Minimap.prototype.getTextEditorHeight = function() {
      return this.adapter.getHeight();
    };

    Minimap.prototype.getTextEditorScrollRatio = function() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
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
        return this.adapter.getHeight();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0dBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsV0FBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUFWLENBQUE7O0FBQUEsRUFDQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsZ0NBQVIsQ0FEdkIsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsMkJBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSx5QkFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsQ0FMZCxDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsb0JBQW9CLENBQUMsV0FBckIsQ0FBaUMsT0FBakMsQ0FBQSxDQUFBOztBQUVBO0FBQUEsZ0JBRkE7O0FBUWEsSUFBQSxpQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLElBQUE7O1FBRFksVUFBUTtPQUNwQjtBQUFBLE1BQUMsSUFBQyxDQUFBLHFCQUFBLFVBQUYsRUFBYyxJQUFDLENBQUEscUJBQUEsVUFBZixFQUEyQixJQUFDLENBQUEsZ0JBQUEsS0FBNUIsRUFBbUMsSUFBQyxDQUFBLGlCQUFBLE1BQXBDLENBQUE7QUFFQSxNQUFBLElBQU8sdUJBQVA7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFNLDJDQUFOLENBQVYsQ0FERjtPQUZBO0FBQUEsTUFLQSxJQUFDLENBQUEsRUFBRCxHQUFNLFdBQUEsRUFMTixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQU5YLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUEsR0FBTyxHQUFBLENBQUEsbUJBUHhCLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxxQkFBRCxDQUFBLENBUkEsQ0FBQTtBQVVBLE1BQUEsSUFBRyx3REFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLFVBQUEsQ0FBVyxJQUFDLENBQUEsVUFBWixDQUFmLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsWUFBQSxDQUFhLElBQUMsQ0FBQSxVQUFkLENBQWYsQ0FIRjtPQVZBO0FBZUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFKO0FBQ0UsUUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLENBQWIsQ0FERjtPQWZBO0FBQUEsTUFrQkEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXBCLEVBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLGFBQUYsR0FBQTtBQUNuRCxVQURvRCxLQUFDLENBQUEsZ0JBQUEsYUFDckQsQ0FBQTtBQUFBLFVBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULEdBQXlCLEtBQUMsQ0FBQSxhQUExQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DO0FBQUEsWUFDakMsTUFBQSxFQUFRLHNCQUR5QjtBQUFBLFlBRWpDLEtBQUEsRUFBTyxLQUFDLENBQUEsYUFGeUI7V0FBbkMsRUFGbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QyxDQUFULENBbEJBLENBQUE7QUFBQSxNQXdCQSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixvQkFBcEIsRUFBMEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUUsVUFBRixHQUFBO0FBQ2pELFVBRGtELEtBQUMsQ0FBQSxhQUFBLFVBQ25ELENBQUE7aUJBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsbUJBQWQsRUFBbUM7QUFBQSxZQUNqQyxNQUFBLEVBQVEsb0JBRHlCO0FBQUEsWUFFakMsS0FBQSxFQUFPLEtBQUMsQ0FBQSxVQUZ5QjtXQUFuQyxFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLENBQVQsQ0F4QkEsQ0FBQTtBQUFBLE1BNkJBLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1CQUFwQixFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBRSxTQUFGLEdBQUE7QUFDaEQsVUFEaUQsS0FBQyxDQUFBLFlBQUEsU0FDbEQsQ0FBQTtpQkFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxtQkFBZCxFQUFtQztBQUFBLFlBQ2pDLE1BQUEsRUFBUSxtQkFEeUI7QUFBQSxZQUVqQyxLQUFBLEVBQU8sS0FBQyxDQUFBLFNBRnlCO1dBQW5DLEVBRGdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FBVCxDQTdCQSxDQUFBO0FBQUEsTUFrQ0EsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsbUJBQXBCLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLFNBQUYsR0FBQTtBQUNoRCxVQURpRCxLQUFDLENBQUEsWUFBQSxTQUNsRCxDQUFBO2lCQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DO0FBQUEsWUFDakMsTUFBQSxFQUFRLG1CQUR5QjtBQUFBLFlBRWpDLEtBQUEsRUFBTyxLQUFDLENBQUEsU0FGeUI7V0FBbkMsRUFEZ0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFULENBbENBLENBQUE7QUFBQSxNQXdDQSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMsb0JBQVQsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyQyxVQUFBLElBQUEsQ0FBQSxLQUFxRCxDQUFBLFVBQXJEO21CQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHVCQUFkLEVBQXVDLEtBQXZDLEVBQUE7V0FEcUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QixDQUFULENBeENBLENBQUE7QUFBQSxNQTBDQSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMscUJBQVQsQ0FBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0QyxVQUFBLElBQUEsQ0FBQSxLQUFzRCxDQUFBLFVBQXREO21CQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHdCQUFkLEVBQXdDLEtBQXhDLEVBQUE7V0FEc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUFULENBMUNBLENBQUE7QUFBQSxNQTZDQSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7aUJBQy9CLEtBQUMsQ0FBQSxXQUFELENBQWEsT0FBYixFQUQrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLENBQVQsQ0E3Q0EsQ0FBQTtBQUFBLE1BK0NBLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFaLENBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2hDLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFEZ0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUFULENBL0NBLENBQUE7QUFBQSxNQXVEQSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQTFCLENBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQy9DLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLG1CQUFkLEVBRCtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsQ0FBVCxDQXZEQSxDQURXO0lBQUEsQ0FSYjs7QUFBQSxzQkFvRUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBVSxJQUFDLENBQUEsU0FBWDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFKakIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUxkLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGFBQWQsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQVBBLENBQUE7YUFRQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBVE47SUFBQSxDQXBFVCxDQUFBOztBQUFBLHNCQStFQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQUo7SUFBQSxDQS9FYixDQUFBOztBQUFBLHNCQTJGQSxXQUFBLEdBQWEsU0FBQyxRQUFELEdBQUE7YUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLFFBQTFCLEVBRFc7SUFBQSxDQTNGYixDQUFBOztBQUFBLHNCQXdHQSxpQkFBQSxHQUFtQixTQUFDLFFBQUQsR0FBQTthQUNqQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxtQkFBWixFQUFpQyxRQUFqQyxFQURpQjtJQUFBLENBeEduQixDQUFBOztBQUFBLHNCQW1IQSxvQkFBQSxHQUFzQixTQUFDLFFBQUQsR0FBQTthQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSx1QkFBWixFQUFxQyxRQUFyQyxFQURvQjtJQUFBLENBbkh0QixDQUFBOztBQUFBLHNCQTZIQSxxQkFBQSxHQUF1QixTQUFDLFFBQUQsR0FBQTthQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSx3QkFBWixFQUFzQyxRQUF0QyxFQURxQjtJQUFBLENBN0h2QixDQUFBOztBQUFBLHNCQXNJQSxxQkFBQSxHQUF1QixTQUFDLFFBQUQsR0FBQTthQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSx3QkFBWixFQUFzQyxRQUF0QyxFQURxQjtJQUFBLENBdEl2QixDQUFBOztBQUFBLHNCQStJQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxhQUFaLEVBQTJCLFFBQTNCLEVBRFk7SUFBQSxDQS9JZCxDQUFBOztBQUFBLHNCQXdKQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFdBQUo7SUFBQSxDQXhKZCxDQUFBOztBQUFBLHNCQThKQSxhQUFBLEdBQWUsU0FBQyxVQUFELEdBQUE7QUFDYixNQUFBLElBQUcsVUFBQSxLQUFnQixJQUFDLENBQUEsVUFBcEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsVUFBZCxDQUFBO2VBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsd0JBQWQsRUFBd0MsSUFBeEMsRUFGRjtPQURhO0lBQUEsQ0E5SmYsQ0FBQTs7QUFBQSxzQkFzS0EsYUFBQSxHQUFlLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxXQUFKO0lBQUEsQ0F0S2YsQ0FBQTs7QUFBQSxzQkEyS0EseUJBQUEsR0FBMkIsU0FBQSxHQUFBO2FBQ3pCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFBLENBQUEsR0FBdUIsSUFBQyxDQUFBLHNCQUFELENBQUEsRUFERTtJQUFBLENBM0szQixDQUFBOztBQUFBLHNCQWlMQSw0QkFBQSxHQUE4QixTQUFBLEdBQUE7YUFDNUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FBQSxHQUEwQixJQUFDLENBQUEsc0JBQUQsQ0FBQSxFQURFO0lBQUEsQ0FqTDlCLENBQUE7O0FBQUEsc0JBdUxBLDZCQUFBLEdBQStCLFNBQUEsR0FBQTthQUM3QixJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUFBLEdBQTJCLElBQUMsQ0FBQSx3QkFBRCxDQUFBLEVBREU7SUFBQSxDQXZML0IsQ0FBQTs7QUFBQSxzQkFpTUEseUJBQUEsR0FBMkIsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxlQUFULENBQUEsRUFBSDtJQUFBLENBak0zQixDQUFBOztBQUFBLHNCQW1NQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxFQUFIO0lBQUEsQ0FuTXhCLENBQUE7O0FBQUEsc0JBcU1BLHNCQUFBLEdBQXdCLFNBQUMsU0FBRCxHQUFBO2FBQWUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLFNBQXRCLEVBQWY7SUFBQSxDQXJNeEIsQ0FBQTs7QUFBQSxzQkF1TUEsdUJBQUEsR0FBeUIsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsRUFBSDtJQUFBLENBdk16QixDQUFBOztBQUFBLHNCQXlNQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQSxFQUFIO0lBQUEsQ0F6TXJCLENBQUE7O0FBQUEsc0JBbU5BLHdCQUFBLEdBQTBCLFNBQUEsR0FBQTthQUV4QixJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxDQUFBLEdBQTBCLENBQUMsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxJQUFnQyxDQUFqQyxFQUZGO0lBQUEsQ0FuTjFCLENBQUE7O0FBQUEsc0JBNE5BLDZCQUFBLEdBQStCLFNBQUEsR0FBQTthQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUMsQ0FBQSx3QkFBRCxDQUFBLENBQVosRUFBSDtJQUFBLENBNU4vQixDQUFBOztBQUFBLHNCQWtPQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxrQkFBWixDQUFBLENBQUEsR0FBbUMsSUFBQyxDQUFBLGFBQUQsQ0FBQSxFQUF0QztJQUFBLENBbE9YLENBQUE7O0FBQUEsc0JBd09BLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLHNCQUFaLENBQUEsQ0FBQSxHQUF1QyxJQUFDLENBQUEsWUFBRCxDQUFBLEVBQTFDO0lBQUEsQ0F4T1YsQ0FBQTs7QUFBQSxzQkFnUEEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO2FBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsZUFBRCxDQUFBLENBQVQsRUFBNkIsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUE3QixFQUFIO0lBQUEsQ0FoUGxCLENBQUE7O0FBQUEsc0JBc1BBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFHLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBSDtBQUNFLFFBQUEsSUFBRyxtQkFBSDtpQkFBaUIsSUFBQyxDQUFBLE9BQWxCO1NBQUEsTUFBQTtpQkFBOEIsSUFBQyxDQUFBLFNBQUQsQ0FBQSxFQUE5QjtTQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFBLEVBSEY7T0FEZTtJQUFBLENBdFBqQixDQUFBOztBQUFBLHNCQStQQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTthQUNmLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFULEVBQTRCLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBNUIsRUFEZTtJQUFBLENBL1BqQixDQUFBOztBQUFBLHNCQXVRQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLE1BQUEsSUFBRyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQUEsSUFBb0Isb0JBQXZCO2VBQW9DLElBQUMsQ0FBQSxNQUFyQztPQUFBLE1BQUE7ZUFBZ0QsSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQUFoRDtPQURjO0lBQUEsQ0F2UWhCLENBQUE7O0FBQUEsc0JBaVJBLHVCQUFBLEdBQXlCLFNBQUUsTUFBRixFQUFXLEtBQVgsR0FBQTtBQUFtQixNQUFsQixJQUFDLENBQUEsU0FBQSxNQUFpQixDQUFBO0FBQUEsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQW5CO0lBQUEsQ0FqUnpCLENBQUE7O0FBQUEsc0JBdVJBLHNCQUFBLEdBQXdCLFNBQUEsR0FBQTthQUN0QixJQUFDLENBQUEsYUFBRCxDQUFBLENBQUEsR0FBbUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxxQkFBWixDQUFBLEVBREc7SUFBQSxDQXZSeEIsQ0FBQTs7QUFBQSxzQkE4UkEsd0JBQUEsR0FBMEIsU0FBQSxHQUFBO2FBQ3hCLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBQSxHQUFrQixJQUFDLENBQUEsVUFBVSxDQUFDLG1CQUFaLENBQUEsRUFETTtJQUFBLENBOVIxQixDQUFBOztBQUFBLHNCQW9TQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsVUFBbEI7SUFBQSxDQXBTZixDQUFBOztBQUFBLHNCQXlTQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQUo7SUFBQSxDQXpTZCxDQUFBOztBQUFBLHNCQThTQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFdBQUo7SUFBQSxDQTlTZixDQUFBOztBQUFBLHNCQW1UQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQUo7SUFBQSxDQW5UZCxDQUFBOztBQUFBLHNCQXdUQSx3QkFBQSxHQUEwQixTQUFBLEdBQUE7YUFDeEIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQUEsR0FBa0IsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUE3QixFQUR3QjtJQUFBLENBeFQxQixDQUFBOztBQUFBLHNCQThUQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7YUFDdkIsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFDLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBQSxHQUFrQixJQUFDLENBQUEsZUFBRCxDQUFBLENBQW5CLENBQUEsR0FBeUMsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFuRCxFQUR1QjtJQUFBLENBOVR6QixDQUFBOztBQUFBLHNCQXVVQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osTUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFKO2VBQ0UsSUFBQyxDQUFBLFVBREg7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsNkJBQUQsQ0FBQSxDQUFBLEdBQW1DLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBNUMsRUFIRjtPQURZO0lBQUEsQ0F2VWQsQ0FBQTs7QUFBQSxzQkFnVkEsWUFBQSxHQUFjLFNBQUUsU0FBRixHQUFBO0FBQ1osTUFEYSxJQUFDLENBQUEsWUFBQSxTQUNkLENBQUE7QUFBQSxNQUFBLElBQWdELElBQUMsQ0FBQSxVQUFqRDtlQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHVCQUFkLEVBQXVDLElBQXZDLEVBQUE7T0FEWTtJQUFBLENBaFZkLENBQUE7O0FBQUEsc0JBc1ZBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO2FBQ2YsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLEdBQWUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUEzQixFQURlO0lBQUEsQ0F0VmpCLENBQUE7O0FBQUEsc0JBNFZBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsZUFBRCxDQUFBLENBQUEsR0FBcUIsRUFBeEI7SUFBQSxDQTVWWCxDQUFBOztBQUFBLHNCQStWQSxTQUFBLEdBQVcsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBc0IsRUFBdEIsRUFBUjtJQUFBLENBL1ZYLENBQUE7O0FBQUEsc0JBa1dBLFdBQUEsR0FBYSxTQUFDLENBQUQsR0FBQTtBQUdYO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLENBQXhCLEVBREY7T0FBQSxjQUFBO0FBR0UsZUFBTyxFQUFQLENBSEY7T0FIVztJQUFBLENBbFdiLENBQUE7O0FBQUEsc0JBMldBLGVBQUEsR0FBaUIsU0FBQyxLQUFELEdBQUE7YUFBVyxJQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBNEIsS0FBNUIsRUFBWDtJQUFBLENBM1dqQixDQUFBOztBQUFBLHNCQThXQSxXQUFBLEdBQWEsU0FBQyxPQUFELEdBQUE7YUFBYSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxZQUFkLEVBQTRCLE9BQTVCLEVBQWI7SUFBQSxDQTlXYixDQUFBOzttQkFBQTs7TUFmRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap.coffee
