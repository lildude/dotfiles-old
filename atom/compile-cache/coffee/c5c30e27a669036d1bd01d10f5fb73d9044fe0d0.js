(function() {
  var $, CompositeDisposable, Delegato, Disposable, Emitter, MinimapIndicator, MinimapOpenQuickSettingsView, MinimapRenderView, MinimapView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  Delegato = require('delegato');

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Disposable = _ref1.Disposable, Emitter = _ref1.Emitter;

  MinimapRenderView = require('./minimap-render-view');

  MinimapIndicator = require('./minimap-indicator');

  MinimapOpenQuickSettingsView = require('./minimap-open-quick-settings-view');

  module.exports = MinimapView = (function(_super) {
    __extends(MinimapView, _super);

    Delegato.includeInto(MinimapView);

    MinimapView.delegatesMethods('getLineHeight', 'getCharHeight', 'getCharWidth', 'getLinesCount', 'getMinimapHeight', 'getMinimapScreenHeight', 'getMinimapHeightInLines', 'getFirstVisibleScreenRow', 'getLastVisibleScreenRow', 'pixelPositionForScreenPosition', 'decorateMarker', 'removeDecoration', 'decorationsForScreenRowRange', 'removeAllDecorationsForMarker', {
      toProperty: 'renderView'
    });

    MinimapView.delegatesMethods('getSelection', 'getSelections', 'getLastSelection', 'bufferRangeForBufferRow', 'getTextInBufferRange', 'getEofBufferPosition', 'scanInBufferRange', 'markBufferRange', {
      toProperty: 'editor'
    });

    MinimapView.delegatesProperty('lineHeight', {
      toMethod: 'getLineHeight'
    });

    MinimapView.delegatesProperty('charWidth', {
      toMethod: 'getCharWidth'
    });

    MinimapView.content = function(_arg) {
      var minimapView;
      minimapView = _arg.minimapView;
      return this.div({
        "class": 'minimap'
      }, (function(_this) {
        return function() {
          if (atom.config.get('minimap.displayPluginsControls')) {
            _this.subview('openQuickSettings', new MinimapOpenQuickSettingsView(minimapView));
          }
          _this.div({
            outlet: 'miniScroller',
            "class": "minimap-scroller"
          });
          return _this.div({
            outlet: 'miniWrapper',
            "class": "minimap-wrapper"
          }, function() {
            _this.div({
              outlet: 'miniUnderlayer',
              "class": "minimap-underlayer"
            });
            _this.subview('renderView', new MinimapRenderView);
            return _this.div({
              outlet: 'miniOverlayer',
              "class": "minimap-overlayer"
            }, function() {
              return _this.div({
                outlet: 'miniVisibleArea',
                "class": "minimap-visible-area"
              });
            });
          });
        };
      })(this));
    };

    MinimapView.prototype.isClicked = false;


    /* Public */

    function MinimapView(editorView, paneView) {
      this.paneView = paneView;
      this.onDrag = __bind(this.onDrag, this);
      this.onMove = __bind(this.onMove, this);
      this.onDragStart = __bind(this.onDragStart, this);
      this.onScrollViewResized = __bind(this.onScrollViewResized, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.onActiveItemChanged = __bind(this.onActiveItemChanged, this);
      this.updateScroll = __bind(this.updateScroll, this);
      this.updateScrollX = __bind(this.updateScrollX, this);
      this.updateScrollY = __bind(this.updateScrollY, this);
      this.updateMinimapSize = __bind(this.updateMinimapSize, this);
      this.updateMinimapRenderView = __bind(this.updateMinimapRenderView, this);
      this.updateMinimapView = __bind(this.updateMinimapView, this);
      this.emitter = new Emitter;
      this.setEditorView(editorView);
      this.subscriptions = new CompositeDisposable;
      MinimapView.__super__.constructor.call(this, {
        minimapView: this,
        editorView: editorView
      });
      this.computeScale();
      this.miniScrollView = this.renderView.scrollView;
      this.offsetLeft = 0;
      this.offsetTop = 0;
      this.indicator = new MinimapIndicator();
      this.scrollView = this.getEditorViewRoot().querySelector('.scroll-view');
      this.scrollViewLines = this.scrollView.querySelector('.lines');
      this.subscribeToEditor();
      this.renderView.minimapView = this;
      this.renderView.setEditorView(this.editorView);
      this.updateMinimapView();
    }

    MinimapView.prototype.initialize = function() {
      var config;
      this.element.addEventListener('mousewheel', this.onMouseWheel);
      this.element.addEventListener('mousedown', this.onMouseDown);
      this.miniVisibleArea[0].addEventListener('mousedown', this.onDragStart);
      this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.element.removeEventListener('mousewheel', _this.onMouseWheel);
          _this.element.removeEventListener('mousedown', _this.onMouseDown);
          return _this.miniVisibleArea[0].removeEventListener('mousedown', _this.onDragStart);
        };
      })(this)));
      this.obsPane = this.pane.observeActiveItem(this.onActiveItemChanged);
      this.subscriptions.add(this.renderView.onDidUpdate(this.updateMinimapSize));
      this.subscriptions.add(this.renderView.onDidChangeScale((function(_this) {
        return function() {
          _this.computeScale();
          return _this.updatePositions();
        };
      })(this)));
      this.observer = new MutationObserver((function(_this) {
        return function(mutations) {
          return _this.updateTopPosition();
        };
      })(this));
      config = {
        childList: true
      };
      this.observer.observe(this.paneView, config);
      this.subscriptions.add(atom.themes.onDidReloadAll((function(_this) {
        return function() {
          _this.updateTopPosition();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          return window.removeEventListener('resize:end', _this.onScrollViewResized);
        };
      })(this)));
      window.addEventListener('resize:end', this.onScrollViewResized);
      this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
      this.miniScroller.toggleClass('visible', this.miniScrollVisible);
      this.displayCodeHighlights = atom.config.get('minimap.displayCodeHighlights');
      this.subscriptions.add(atom.config.observe('minimap.minimapScrollIndicator', (function(_this) {
        return function() {
          _this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
          return _this.miniScroller.toggleClass('visible', _this.miniScrollVisible);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.useHardwareAcceleration', (function(_this) {
        return function() {
          if (_this.ScrollView != null) {
            return _this.updateScroll();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.displayCodeHighlights', (function(_this) {
        return function() {
          var newOptionValue;
          newOptionValue = atom.config.get('minimap.displayCodeHighlights');
          return _this.setDisplayCodeHighlights(newOptionValue);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.adjustMinimapWidthToSoftWrap', (function(_this) {
        return function(value) {
          if (value) {
            return _this.updateMinimapSize();
          } else {
            return _this.resetMinimapWidthWithWrap();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.softWrap', (function(_this) {
        return function() {
          _this.updateMinimapSize();
          return _this.updateMinimapView();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('editor.preferredLineLength', (function(_this) {
        return function() {
          return _this.updateMinimapSize();
        };
      })(this)));
    };

    MinimapView.prototype.onDidScroll = function(callback) {
      return this.emitter.on('did-scroll', callback);
    };

    MinimapView.prototype.computeScale = function() {
      var computedLineHeight, originalLineHeight;
      originalLineHeight = this.getEditorLineHeight();
      computedLineHeight = this.getLineHeight();
      return this.scaleX = this.scaleY = computedLineHeight / originalLineHeight;
    };

    MinimapView.prototype.getEditorLineHeight = function() {
      var lineHeight;
      lineHeight = window.getComputedStyle(this.getEditorViewRoot().querySelector('.lines')).getPropertyValue('line-height');
      return parseInt(lineHeight);
    };

    MinimapView.prototype.destroy = function() {
      this.resetMinimapWidthWithWrap();
      this.paneView.classList.remove('with-minimap');
      this.off();
      this.obsPane.dispose();
      this.subscriptions.dispose();
      this.observer.disconnect();
      this.detachFromPaneView();
      this.renderView.destroy();
      return this.remove();
    };

    MinimapView.prototype.getTextEditor = function() {
      return this.editor;
    };

    MinimapView.prototype.setEditorView = function(editorView) {
      var _ref2;
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      if (this.paneView != null) {
        this.pane = this.paneView.getModel();
      } else {
        this.pane = atom.workspace.paneForItem(this.editor);
        this.paneView = atom.views.getView(this.pane);
      }
      if ((_ref2 = this.renderView) != null) {
        _ref2.setEditorView(this.editorView);
      }
      if (this.obsPane != null) {
        this.obsPane.dispose();
        return this.obsPane = this.pane.observeActiveItem(this.onActiveItemChanged);
      }
    };

    MinimapView.prototype.getEditorViewRoot = function() {
      var _ref2;
      return (_ref2 = this.editorView.shadowRoot) != null ? _ref2 : this.editorView;
    };

    MinimapView.prototype.setDisplayCodeHighlights = function(value) {
      if (value !== this.displayCodeHighlights) {
        this.displayCodeHighlights = value;
        return this.renderView.forceUpdate();
      }
    };

    MinimapView.prototype.attachToPaneView = function() {
      this.paneView.appendChild(this.element);
      this.computeScale();
      return this.updateTopPosition();
    };

    MinimapView.prototype.detachFromPaneView = function() {
      return this.detach();
    };

    MinimapView.prototype.minimapIsAttached = function() {
      return this.paneView.find('.minimap').length === 1;
    };

    MinimapView.prototype.getEditorViewClientRect = function() {
      return this.editorView.getBoundingClientRect();
    };

    MinimapView.prototype.getScrollViewClientRect = function() {
      return this.scrollViewLines.getBoundingClientRect();
    };

    MinimapView.prototype.getMinimapClientRect = function() {
      return this.element.getBoundingClientRect();
    };

    MinimapView.prototype.updateMinimapView = function() {
      if (!this.editorView) {
        return;
      }
      if (!this.indicator) {
        return;
      }
      if (this.frameRequested) {
        return;
      }
      this.updateMinimapSize();
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.updateScroll();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapView.prototype.updateMinimapRenderView = function() {
      return this.renderView.update();
    };

    MinimapView.prototype.updateMinimapSize = function() {
      var editorViewRect, evh, evw, height, miniScrollViewRect, minimapVisibilityRatio, msvh, msvw, width, _ref2;
      if (this.indicator == null) {
        return;
      }
      _ref2 = this.getMinimapClientRect(), width = _ref2.width, height = _ref2.height;
      editorViewRect = this.getEditorViewClientRect();
      miniScrollViewRect = this.renderView.getClientRect();
      evw = editorViewRect.width;
      evh = editorViewRect.height;
      minimapVisibilityRatio = miniScrollViewRect.height / height;
      this.miniScroller.height(evh / minimapVisibilityRatio);
      this.miniScroller.toggleClass('visible', minimapVisibilityRatio > 1 && this.miniScrollVisible);
      this.miniWrapper.css({
        width: width
      });
      this.indicator.height = evh * this.scaleY;
      this.indicator.width = width / this.scaleX;
      this.miniVisibleArea.css({
        width: width / this.scaleX,
        height: evh * this.scaleY
      });
      this.updateMinimapWidthWithWrap();
      msvw = miniScrollViewRect.width || 0;
      msvh = miniScrollViewRect.height || 0;
      this.indicator.setWrapperSize(width, Math.min(height, msvh));
      this.indicator.setScrollerSize(msvw, msvh);
      return this.indicator.updateBoundary();
    };

    MinimapView.prototype.updateMinimapWidthWithWrap = function() {
      var adjustWidth, displayLeft, maxWidth, size, wraps;
      this.resetMinimapWidthWithWrap();
      size = atom.config.get('editor.preferredLineLength');
      wraps = atom.config.get('editor.softWrap');
      adjustWidth = atom.config.get('minimap.adjustMinimapWidthToSoftWrap');
      displayLeft = atom.config.get('minimap.displayMinimapOnLeft');
      maxWidth = size * this.getCharWidth();
      if (wraps && adjustWidth && size && this.width() > maxWidth) {
        maxWidth = maxWidth + 'px';
        this.css({
          maxWidth: maxWidth
        });
        if (displayLeft) {
          return this.editorView.style.paddingLeft = maxWidth;
        } else {
          this.editorView.style.paddingRight = maxWidth;
          return this.getEditorViewRoot().querySelector('.vertical-scrollbar').style.right = maxWidth;
        }
      }
    };

    MinimapView.prototype.resetMinimapWidthWithWrap = function() {
      var _ref2;
      this.css({
        maxWidth: ''
      });
      this.editorView.style.paddingRight = '';
      this.editorView.style.paddingLeft = '';
      return (_ref2 = this.getEditorViewRoot().querySelector('.vertical-scrollbar')) != null ? _ref2.style.right = '' : void 0;
    };

    MinimapView.prototype.updateScrollY = function(top) {
      var overlayY, overlayerOffset, scrollViewOffset;
      if (top != null) {
        overlayY = top;
      } else {
        scrollViewOffset = this.getEditorViewClientRect().top;
        overlayerOffset = this.getScrollViewClientRect().top;
        overlayY = -overlayerOffset + scrollViewOffset;
      }
      this.indicator.setY(overlayY * this.scaleY);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScrollX = function() {
      this.indicator.setX(this.editor.getScrollLeft());
      return this.updatePositions();
    };

    MinimapView.prototype.updateScroll = function() {
      this.indicator.setX(this.editor.getScrollTop());
      this.updateScrollY();
      return this.emitter.emit('did-scroll');
    };

    MinimapView.prototype.updatePositions = function() {
      this.transform(this.miniVisibleArea[0], this.translate(0, this.indicator.y));
      this.renderView.scrollTop(this.indicator.scroller.y * -1);
      this.transform(this.renderView[0], this.translate(0, this.indicator.scroller.y + this.getFirstVisibleScreenRow() * this.getLineHeight()));
      this.transform(this.miniUnderlayer[0], this.translate(0, this.indicator.scroller.y));
      this.transform(this.miniOverlayer[0], this.translate(0, this.indicator.scroller.y));
      return this.updateScrollerPosition();
    };

    MinimapView.prototype.updateScrollerPosition = function() {
      var height, scrollRange, totalHeight;
      height = this.miniScroller.height();
      totalHeight = this.height();
      scrollRange = totalHeight - height;
      return this.transform(this.miniScroller[0], this.translate(0, this.indicator.ratioY * scrollRange));
    };

    MinimapView.prototype.updateTopPosition = function() {
      return this.offset({
        top: (this.offsetTop = this.editorView.getBoundingClientRect().top)
      });
    };


    /* Internal */

    MinimapView.prototype.subscribeToEditor = function() {
      this.subscriptions.add(this.editor.onDidChangeScrollTop(this.updateScrollY));
      this.subscriptions.add(this.editor.onDidChangeScrollLeft(this.updateScrollX));
      this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          return _this.editorView.removeEventListener('focus');
        };
      })(this)));
      return this.editorView.addEventListener('focus', (function(_this) {
        return function() {
          var pane, paneView;
          pane = atom.workspace.paneForItem(_this.editor);
          paneView = atom.views.getView(pane);
          if (paneView !== _this.paneView) {
            _this.detachFromPaneView();
            _this.paneView = paneView;
            _this.attachToPaneView();
          }
          return true;
        };
      })(this));
    };

    MinimapView.prototype.unsubscribeFromEditor = function() {
      return this.subscriptions.dispose();
    };

    MinimapView.prototype.onActiveItemChanged = function(activeItem) {
      if (activeItem === this.editor) {
        if (this.parent().length === 0) {
          this.attachToPaneView();
        }
        this.updateMinimapView();
        return this.renderView.forceUpdate();
      } else {
        if (this.parent().length === 1) {
          return this.detachFromPaneView();
        }
      }
    };

    MinimapView.prototype.onMouseWheel = function(e) {
      var wheelDeltaX, wheelDeltaY;
      if (this.isClicked) {
        return;
      }
      wheelDeltaX = e.wheelDeltaX, wheelDeltaY = e.wheelDeltaY;
      if (wheelDeltaX) {
        this.editor.setScrollLeft(this.editor.getScrollLeft() - wheelDeltaX);
      }
      if (wheelDeltaY) {
        return this.editor.setScrollTop(this.editor.getScrollTop() - wheelDeltaY);
      }
    };

    MinimapView.prototype.onMouseDown = function(e) {
      var pageY, row, scrollTop, target, y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      pageY = e.pageY, target = e.target;
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.getLineHeight()) + this.getFirstVisibleScreenRow();
      scrollTop = row * this.getTextEditor().getLineHeightInPixels() - this.getTextEditor().getHeight() / 2;
      this.getTextEditor().setScrollTop(scrollTop);
      return setTimeout((function(_this) {
        return function() {
          return _this.isClicked = false;
        };
      })(this), 377);
    };

    MinimapView.prototype.onScrollViewResized = function() {
      this.renderView.lineCanvas.height(this.editorView.clientHeight);
      this.updateMinimapSize();
      this.updateMinimapView();
      this.updateMinimapWidthWithWrap();
      return this.renderView.forceUpdate();
    };

    MinimapView.prototype.onDragStart = function(e) {
      var y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      this.grabY = y - (this.indicator.y + this.indicator.scroller.y);
      return this.on('mousemove.visible-area', this.onMove);
    };

    MinimapView.prototype.onMove = function(e) {
      if (e.which === 1) {
        return this.onDrag(e);
      } else {
        this.isClicked = false;
        return this.off('.visible-area');
      }
    };

    MinimapView.prototype.onDrag = function(e) {
      var top, y;
      y = e.pageY - this.offsetTop;
      top = (y - this.grabY) * (this.indicator.scroller.height - this.indicator.height) / (this.indicator.wrapper.height - this.indicator.height);
      return this.editor.setScrollTop(top / this.scaleY);
    };

    MinimapView.prototype.translate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (atom.config.get('minimap.useHardwareAcceleration')) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapView.prototype.scale = function(scale) {
      return " scale(" + scale + ", " + scale + ")";
    };

    MinimapView.prototype.transform = function(el, transform) {
      return el.style.webkitTransform = el.style.transform = transform;
    };

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdKQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLFFBQTZDLE9BQUEsQ0FBUSxXQUFSLENBQTdDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsbUJBQUEsVUFBdEIsRUFBa0MsZ0JBQUEsT0FGbEMsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUpwQixDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBTG5CLENBQUE7O0FBQUEsRUFNQSw0QkFBQSxHQUErQixPQUFBLENBQVEsb0NBQVIsQ0FOL0IsQ0FBQTs7QUFBQSxFQXdDQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBQSxJQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLFdBQXJCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixlQUFsQixFQUFtQyxlQUFuQyxFQUFvRCxjQUFwRCxFQUFvRSxlQUFwRSxFQUFxRixrQkFBckYsRUFBeUcsd0JBQXpHLEVBQW1JLHlCQUFuSSxFQUE4SiwwQkFBOUosRUFBMEwseUJBQTFMLEVBQXFOLGdDQUFyTixFQUF1UCxnQkFBdlAsRUFBeVEsa0JBQXpRLEVBQTZSLDhCQUE3UixFQUE2VCwrQkFBN1QsRUFBOFY7QUFBQSxNQUFBLFVBQUEsRUFBWSxZQUFaO0tBQTlWLENBRkEsQ0FBQTs7QUFBQSxJQUlBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixjQUFsQixFQUFrQyxl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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-view.coffee