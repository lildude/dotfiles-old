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
      this.paneView.classList.add('with-minimap');
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
      var position, top, y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      top = (y + this.renderView.scrollTop()) / this.scaleY;
      position = this.editor.displayBuffer.screenPositionForPixelPosition({
        top: top,
        left: 0
      });
      this.editor.scrollToScreenPosition(position, {
        center: true
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdKQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLFFBQTZDLE9BQUEsQ0FBUSxXQUFSLENBQTdDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsbUJBQUEsVUFBdEIsRUFBa0MsZ0JBQUEsT0FGbEMsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUpwQixDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBTG5CLENBQUE7O0FBQUEsRUFNQSw0QkFBQSxHQUErQixPQUFBLENBQVEsb0NBQVIsQ0FOL0IsQ0FBQTs7QUFBQSxFQXdDQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBQSxJQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLFdBQXJCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixlQUFsQixFQUFtQyxlQUFuQyxFQUFvRCxjQUFwRCxFQUFvRSxlQUFwRSxFQUFxRixrQkFBckYsRUFBeUcsd0JBQXpHLEVBQW1JLHlCQUFuSSxFQUE4SiwwQkFBOUosRUFBMEwseUJBQTFMLEVBQXFOLGdDQUFyTixFQUF1UCxnQkFBdlAsRUFBeVEsa0JBQXpRLEVBQTZSLDhCQUE3UixFQUE2VCwrQkFBN1QsRUFBOFY7QUFBQSxNQUFBLFVBQUEsRUFBWSxZQUFaO0tBQTlWLENBRkEsQ0FBQTs7QUFBQSxJQUlBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixjQUFsQixFQUFrQyxlQUFsQyxFQUFtRCxrQkFBbkQsRUFBdUUseUJBQXZFLEVBQWtHLHNCQUFsRyxFQUEwSCxzQkFBMUgsRUFBa0osbUJBQWxKLEVBQXVLLGlCQUF2SyxFQUEwTDtBQUFBLE1BQUEsVUFBQSxFQUFZLFFBQVo7S0FBMUwsQ0FKQSxDQUFBOztBQUFBLElBTUEsV0FBQyxDQUFBLGlCQUFELENBQW1CLFlBQW5CLEVBQWlDO0FBQUEsTUFBQSxRQUFBLEVBQVUsZUFBVjtLQUFqQyxDQU5BLENBQUE7O0FBQUEsSUFPQSxXQUFDLENBQUEsaUJBQUQsQ0FBbUIsV0FBbkIsRUFBZ0M7QUFBQSxNQUFBLFFBQUEsRUFBVSxjQUFWO0tBQWhDLENBUEEsQ0FBQTs7QUFBQSxJQVNBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixVQUFBLFdBQUE7QUFBQSxNQURVLGNBQUQsS0FBQyxXQUNWLENBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sU0FBUDtPQUFMLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDckIsVUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FBSDtBQUNFLFlBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxtQkFBVCxFQUFrQyxJQUFBLDRCQUFBLENBQTZCLFdBQTdCLENBQWxDLENBQUEsQ0FERjtXQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQVEsY0FBUjtBQUFBLFlBQXdCLE9BQUEsRUFBTyxrQkFBL0I7V0FBTCxDQUZBLENBQUE7aUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLGFBQVI7QUFBQSxZQUF1QixPQUFBLEVBQU8saUJBQTlCO1dBQUwsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsTUFBQSxFQUFRLGdCQUFSO0FBQUEsY0FBMEIsT0FBQSxFQUFPLG9CQUFqQzthQUFMLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVCLEdBQUEsQ0FBQSxpQkFBdkIsQ0FEQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE1BQUEsRUFBUSxlQUFSO0FBQUEsY0FBeUIsT0FBQSxFQUFPLG1CQUFoQzthQUFMLEVBQTBELFNBQUEsR0FBQTtxQkFDeEQsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE1BQUEsRUFBUSxpQkFBUjtBQUFBLGdCQUEyQixPQUFBLEVBQU8sc0JBQWxDO2VBQUwsRUFEd0Q7WUFBQSxDQUExRCxFQUhvRDtVQUFBLENBQXRELEVBSnFCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsRUFEUTtJQUFBLENBVFYsQ0FBQTs7QUFBQSwwQkFvQkEsU0FBQSxHQUFXLEtBcEJYLENBQUE7O0FBc0JBO0FBQUEsZ0JBdEJBOztBQW1DYSxJQUFBLHFCQUFDLFVBQUQsRUFBYyxRQUFkLEdBQUE7QUFDWCxNQUR3QixJQUFDLENBQUEsV0FBQSxRQUN6QixDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsdUVBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSx5REFBQSxDQUFBO0FBQUEsdUVBQUEsQ0FBQTtBQUFBLHlEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSwrRUFBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxDQUFlLFVBQWYsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFwQixDQUF3QixjQUF4QixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFMakIsQ0FBQTtBQUFBLE1BT0EsNkNBQU07QUFBQSxRQUFDLFdBQUEsRUFBYSxJQUFkO0FBQUEsUUFBb0IsWUFBQSxVQUFwQjtPQUFOLENBUEEsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQVRBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFWOUIsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQVhkLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FaYixDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLGdCQUFBLENBQUEsQ0FiakIsQ0FBQTtBQUFBLE1BZUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUFvQixDQUFDLGFBQXJCLENBQW1DLGNBQW5DLENBZmQsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUEwQixRQUExQixDQWpCbkIsQ0FBQTtBQUFBLE1BbUJBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBbkJBLENBQUE7QUFBQSxNQXFCQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosR0FBMEIsSUFyQjFCLENBQUE7QUFBQSxNQXNCQSxJQUFDLENBQUEsVUFBVSxDQUFDLGFBQVosQ0FBMEIsSUFBQyxDQUFBLFVBQTNCLENBdEJBLENBQUE7QUFBQSxNQXdCQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQXhCQSxDQURXO0lBQUEsQ0FuQ2I7O0FBQUEsMEJBZ0VBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBMEIsWUFBMUIsRUFBd0MsSUFBQyxDQUFBLFlBQXpDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxJQUFDLENBQUEsV0FBeEMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxnQkFBcEIsQ0FBcUMsV0FBckMsRUFBa0QsSUFBQyxDQUFBLFdBQW5ELENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQXVCLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDaEMsVUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLG1CQUFULENBQTZCLFlBQTdCLEVBQTJDLEtBQUMsQ0FBQSxZQUE1QyxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsbUJBQVQsQ0FBNkIsV0FBN0IsRUFBMEMsS0FBQyxDQUFBLFdBQTNDLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxtQkFBcEIsQ0FBd0MsV0FBeEMsRUFBcUQsS0FBQyxDQUFBLFdBQXRELEVBSGdDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxDQUF2QixDQUpBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxpQkFBTixDQUF3QixJQUFDLENBQUEsbUJBQXpCLENBVFgsQ0FBQTtBQUFBLE1BZUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsaUJBQXpCLENBQW5CLENBZkEsQ0FBQTtBQUFBLE1BZ0JBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsVUFBVSxDQUFDLGdCQUFaLENBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDOUMsVUFBQSxLQUFDLENBQUEsWUFBRCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsZUFBRCxDQUFBLEVBRjhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0IsQ0FBbkIsQ0FoQkEsQ0FBQTtBQUFBLE1Bc0JBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsZ0JBQUEsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsU0FBRCxHQUFBO2lCQUMvQixLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUQrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLENBdEJoQixDQUFBO0FBQUEsTUF5QkEsTUFBQSxHQUFTO0FBQUEsUUFBQSxTQUFBLEVBQVcsSUFBWDtPQXpCVCxDQUFBO0FBQUEsTUEwQkEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLElBQUMsQ0FBQSxRQUFuQixFQUE2QixNQUE3QixDQTFCQSxDQUFBO0FBQUEsTUE2QkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBWixDQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzVDLFVBQUEsS0FBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBRjRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0FBbkIsQ0E3QkEsQ0FBQTtBQUFBLE1BbUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUF1QixJQUFBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoQyxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsWUFBM0IsRUFBeUMsS0FBQyxDQUFBLG1CQUExQyxFQURnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsQ0FBdkIsQ0FuQ0EsQ0FBQTtBQUFBLE1BcUNBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixZQUF4QixFQUFzQyxJQUFDLENBQUEsbUJBQXZDLENBckNBLENBQUE7QUFBQSxNQXVDQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQXZDckIsQ0FBQTtBQUFBLE1Bd0NBLElBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixTQUExQixFQUFxQyxJQUFDLENBQUEsaUJBQXRDLENBeENBLENBQUE7QUFBQSxNQTBDQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixDQTFDekIsQ0FBQTtBQUFBLE1BNENBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsZ0NBQXBCLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkUsVUFBQSxLQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUFyQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixTQUExQixFQUFxQyxLQUFDLENBQUEsaUJBQXRDLEVBRnVFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsQ0FBbkIsQ0E1Q0EsQ0FBQTtBQUFBLE1BZ0RBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsaUNBQXBCLEVBQXVELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDeEUsVUFBQSxJQUFtQix3QkFBbkI7bUJBQUEsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQUFBO1dBRHdFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkQsQ0FBbkIsQ0FoREEsQ0FBQTtBQUFBLE1BbURBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsK0JBQXBCLEVBQXFELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdEUsY0FBQSxjQUFBO0FBQUEsVUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FBakIsQ0FBQTtpQkFDQSxLQUFDLENBQUEsd0JBQUQsQ0FBMEIsY0FBMUIsRUFGc0U7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyRCxDQUFuQixDQW5EQSxDQUFBO0FBQUEsTUF1REEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixzQ0FBcEIsRUFBNEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQzdFLFVBQUEsSUFBRyxLQUFIO21CQUNFLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSx5QkFBRCxDQUFBLEVBSEY7V0FENkU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RCxDQUFuQixDQXZEQSxDQUFBO0FBQUEsTUE2REEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixtQkFBcEIsRUFBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMxRCxVQUFBLEtBQUMsQ0FBQSxZQUFELENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBRjBEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FBbkIsQ0E3REEsQ0FBQTtBQUFBLE1BaUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsaUJBQXBCLEVBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDeEQsVUFBQSxLQUFDLENBQUEsWUFBRCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUZ3RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLENBQW5CLENBakVBLENBQUE7QUFBQSxNQXFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlCQUFwQixFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3hELFVBQUEsS0FBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBRndEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsQ0FBbkIsQ0FyRUEsQ0FBQTthQXlFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDRCQUFwQixFQUFrRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNuRSxLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQURtRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxELENBQW5CLEVBMUVVO0lBQUEsQ0FoRVosQ0FBQTs7QUFBQSwwQkE2SUEsV0FBQSxHQUFhLFNBQUMsUUFBRCxHQUFBO2FBQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksWUFBWixFQUEwQixRQUExQixFQURXO0lBQUEsQ0E3SWIsQ0FBQTs7QUFBQSwwQkFvSkEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsc0NBQUE7QUFBQSxNQUFBLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQXJCLENBQUE7QUFBQSxNQUNBLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FEckIsQ0FBQTthQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQUQsR0FBVSxrQkFBQSxHQUFxQixtQkFKN0I7SUFBQSxDQXBKZCxDQUFBOztBQUFBLDBCQTBKQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBQW9CLENBQUMsYUFBckIsQ0FBbUMsUUFBbkMsQ0FBeEIsQ0FBcUUsQ0FBQyxnQkFBdEUsQ0FBdUYsYUFBdkYsQ0FBYixDQUFBO2FBQ0EsUUFBQSxDQUFTLFVBQVQsRUFGbUI7SUFBQSxDQTFKckIsQ0FBQTs7QUFBQSwwQkErSkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFwQixDQUEyQixjQUEzQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxHQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQUEsQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQVBBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBUkEsQ0FBQTthQVNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFWTztJQUFBLENBL0pULENBQUE7O0FBQUEsMEJBMktBLGFBQUEsR0FBZSxTQUFFLFVBQUYsR0FBQTtBQUNiLFVBQUEsS0FBQTtBQUFBLE1BRGMsSUFBQyxDQUFBLGFBQUEsVUFDZixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQVYsQ0FBQTtBQUNBLE1BQUEsSUFBRyxxQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsQ0FBQSxDQUFSLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBZixDQUEyQixJQUFDLENBQUEsTUFBNUIsQ0FBUixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFDLENBQUEsSUFBcEIsQ0FEWixDQUhGO09BREE7O2FBT1csQ0FBRSxhQUFiLENBQTJCLElBQUMsQ0FBQSxVQUE1QjtPQVBBO0FBU0EsTUFBQSxJQUFHLG9CQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxJQUFJLENBQUMsaUJBQU4sQ0FBd0IsSUFBQyxDQUFBLG1CQUF6QixFQUZiO09BVmE7SUFBQSxDQTNLZixDQUFBOztBQUFBLDBCQXlMQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxLQUFBO29FQUF5QixJQUFDLENBQUEsV0FEVDtJQUFBLENBekxuQixDQUFBOztBQUFBLDBCQXVNQSx3QkFBQSxHQUEwQixTQUFDLEtBQUQsR0FBQTtBQUN4QixNQUFBLElBQUcsS0FBQSxLQUFXLElBQUMsQ0FBQSxxQkFBZjtBQUNFLFFBQUEsSUFBQyxDQUFBLHFCQUFELEdBQXlCLEtBQXpCLENBQUE7ZUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBQSxFQUZGO09BRHdCO0lBQUEsQ0F2TTFCLENBQUE7O0FBQUEsMEJBNk1BLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixJQUFDLENBQUEsT0FBdkIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBSGdCO0lBQUEsQ0E3TWxCLENBQUE7O0FBQUEsMEJBbU5BLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNsQixJQUFDLENBQUEsTUFBRCxDQUFBLEVBRGtCO0lBQUEsQ0FuTnBCLENBQUE7O0FBQUEsMEJBeU5BLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxNQUEzQixLQUFxQyxFQUF4QztJQUFBLENBek5uQixDQUFBOztBQUFBLDBCQThOQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLHFCQUFaLENBQUEsRUFBSDtJQUFBLENBOU56QixDQUFBOztBQUFBLDBCQW1PQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsZUFBZSxDQUFDLHFCQUFqQixDQUFBLEVBQUg7SUFBQSxDQW5PekIsQ0FBQTs7QUFBQSwwQkF3T0Esb0JBQUEsR0FBc0IsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxxQkFBVCxDQUFBLEVBQUg7SUFBQSxDQXhPdEIsQ0FBQTs7QUFBQSwwQkF1UEEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxVQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsU0FBZjtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBR0EsTUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFYO0FBQUEsY0FBQSxDQUFBO09BSEE7QUFBQSxNQUtBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFObEIsQ0FBQTthQU9BLHFCQUFBLENBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFDLENBQUEsWUFBRCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsY0FBRCxHQUFrQixNQUZFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsRUFSaUI7SUFBQSxDQXZQbkIsQ0FBQTs7QUFBQSwwQkFvUUEsdUJBQUEsR0FBeUIsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFBSDtJQUFBLENBcFF6QixDQUFBOztBQUFBLDBCQXdRQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxzR0FBQTtBQUFBLE1BQUEsSUFBYyxzQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxRQUFrQixJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQUFsQixFQUFDLGNBQUEsS0FBRCxFQUFRLGVBQUEsTUFGUixDQUFBO0FBQUEsTUFHQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSx1QkFBRCxDQUFBLENBSGpCLENBQUE7QUFBQSxNQUlBLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBLENBSnJCLENBQUE7QUFBQSxNQU1BLEdBQUEsR0FBTSxjQUFjLENBQUMsS0FOckIsQ0FBQTtBQUFBLE1BT0EsR0FBQSxHQUFNLGNBQWMsQ0FBQyxNQVByQixDQUFBO0FBQUEsTUFTQSxzQkFBQSxHQUF5QixrQkFBa0IsQ0FBQyxNQUFuQixHQUE0QixNQVRyRCxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsR0FBQSxHQUFNLHNCQUEzQixDQVhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixTQUExQixFQUFxQyxzQkFBQSxHQUF5QixDQUF6QixJQUErQixJQUFDLENBQUEsaUJBQXJFLENBWkEsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCO0FBQUEsUUFBQyxPQUFBLEtBQUQ7T0FBakIsQ0FkQSxDQUFBO0FBQUEsTUFpQkEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLEdBQW9CLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFqQjNCLENBQUE7QUFBQSxNQWtCQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsR0FBbUIsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQWxCNUIsQ0FBQTtBQUFBLE1Bb0JBLElBQUMsQ0FBQSxlQUFlLENBQUMsR0FBakIsQ0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFRLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBakI7QUFBQSxRQUNBLE1BQUEsRUFBUSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BRGY7T0FERixDQXBCQSxDQUFBO0FBQUEsTUF3QkEsSUFBQyxDQUFBLDBCQUFELENBQUEsQ0F4QkEsQ0FBQTtBQUFBLE1BMEJBLElBQUEsR0FBTyxrQkFBa0IsQ0FBQyxLQUFuQixJQUE0QixDQTFCbkMsQ0FBQTtBQUFBLE1BMkJBLElBQUEsR0FBTyxrQkFBa0IsQ0FBQyxNQUFuQixJQUE2QixDQTNCcEMsQ0FBQTtBQUFBLE1BOEJBLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxDQUEwQixLQUExQixFQUFpQyxJQUFJLENBQUMsR0FBTCxDQUFTLE1BQVQsRUFBaUIsSUFBakIsQ0FBakMsQ0E5QkEsQ0FBQTtBQUFBLE1BaUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsZUFBWCxDQUEyQixJQUEzQixFQUFpQyxJQUFqQyxDQWpDQSxDQUFBO2FBb0NBLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxDQUFBLEVBckNpQjtJQUFBLENBeFFuQixDQUFBOztBQUFBLDBCQWlUQSwwQkFBQSxHQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSwrQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUZQLENBQUE7QUFBQSxNQUdBLEtBQUEsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLENBSFIsQ0FBQTtBQUFBLE1BSUEsV0FBQSxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FKZCxDQUFBO0FBQUEsTUFLQSxXQUFBLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixDQUxkLENBQUE7QUFBQSxNQU9BLFFBQUEsR0FBWSxJQUFBLEdBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQVBuQixDQUFBO0FBUUEsTUFBQSxJQUFHLEtBQUEsSUFBVSxXQUFWLElBQTBCLElBQTFCLElBQW1DLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBQSxHQUFXLFFBQWpEO0FBQ0UsUUFBQSxRQUFBLEdBQVcsUUFBQSxHQUFXLElBQXRCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLFFBQUEsRUFBVSxRQUFWO1NBQUwsQ0FEQSxDQUFBO0FBRUEsUUFBQSxJQUFHLFdBQUg7aUJBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBbEIsR0FBZ0MsU0FEbEM7U0FBQSxNQUFBO0FBR0UsVUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFsQixHQUFpQyxRQUFqQyxDQUFBO2lCQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBQW9CLENBQUMsYUFBckIsQ0FBbUMscUJBQW5DLENBQXlELENBQUMsS0FBSyxDQUFDLEtBQWhFLEdBQXdFLFNBSjFFO1NBSEY7T0FUMEI7SUFBQSxDQWpUNUIsQ0FBQTs7QUFBQSwwQkFxVUEseUJBQUEsR0FBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsUUFBQSxFQUFVLEVBQVY7T0FBTCxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQWxCLEdBQWlDLEVBRGpDLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBSyxDQUFDLFdBQWxCLEdBQWdDLEVBRmhDLENBQUE7b0dBS3lELENBQUUsS0FBSyxDQUFDLEtBQWpFLEdBQXlFLFlBTmhEO0lBQUEsQ0FyVTNCLENBQUE7O0FBQUEsMEJBZ1ZBLGFBQUEsR0FBZSxTQUFDLEdBQUQsR0FBQTtBQUdiLFVBQUEsMkNBQUE7QUFBQSxNQUFBLElBQUcsV0FBSDtBQUNFLFFBQUEsUUFBQSxHQUFXLEdBQVgsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSx1QkFBRCxDQUFBLENBQTBCLENBQUMsR0FBOUMsQ0FBQTtBQUFBLFFBQ0EsZUFBQSxHQUFrQixJQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUEwQixDQUFDLEdBRDdDLENBQUE7QUFBQSxRQUVBLFFBQUEsR0FBVyxDQUFBLGVBQUEsR0FBbUIsZ0JBRjlCLENBSEY7T0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLFFBQUEsR0FBVyxJQUFDLENBQUEsTUFBNUIsQ0FQQSxDQUFBO2FBUUEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxFQVhhO0lBQUEsQ0FoVmYsQ0FBQTs7QUFBQSwwQkE4VkEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQWhCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxlQUFELENBQUEsRUFGYTtJQUFBLENBOVZmLENBQUE7O0FBQUEsMEJBb1dBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUFoQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsWUFBZCxFQUhZO0lBQUEsQ0FwV2QsQ0FBQTs7QUFBQSwwQkEyV0EsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGVBQWdCLENBQUEsQ0FBQSxDQUE1QixFQUFnQyxJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLENBQXpCLENBQWhDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQXBCLEdBQXdCLENBQUEsQ0FBOUMsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxVQUFXLENBQUEsQ0FBQSxDQUF2QixFQUEyQixJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFwQixHQUF3QixJQUFDLENBQUEsd0JBQUQsQ0FBQSxDQUFBLEdBQThCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBcEUsQ0FBM0IsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxjQUFlLENBQUEsQ0FBQSxDQUEzQixFQUErQixJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFsQyxDQUEvQixDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGFBQWMsQ0FBQSxDQUFBLENBQTFCLEVBQThCLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWCxFQUFjLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQWxDLENBQTlCLENBTkEsQ0FBQTthQVFBLElBQUMsQ0FBQSxzQkFBRCxDQUFBLEVBVGU7SUFBQSxDQTNXakIsQ0FBQTs7QUFBQSwwQkF1WEEsc0JBQUEsR0FBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBRCxDQUFBLENBRGQsQ0FBQTtBQUFBLE1BR0EsV0FBQSxHQUFjLFdBQUEsR0FBYyxNQUg1QixDQUFBO2FBS0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsWUFBYSxDQUFBLENBQUEsQ0FBekIsRUFBNkIsSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLEVBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLEdBQW9CLFdBQWxDLENBQTdCLEVBTnNCO0lBQUEsQ0F2WHhCLENBQUE7O0FBQUEsMEJBa1lBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUNqQixJQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsUUFBQSxHQUFBLEVBQUssQ0FBQyxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBQSxDQUFtQyxDQUFDLEdBQWxELENBQUw7T0FBUixFQURpQjtJQUFBLENBbFluQixDQUFBOztBQTZZQTtBQUFBLGtCQTdZQTs7QUFBQSwwQkFnWkEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsSUFBQyxDQUFBLGFBQTlCLENBQW5CLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLGFBQS9CLENBQW5CLENBRkEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQXVCLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxtQkFBWixDQUFnQyxPQUFoQyxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxDQUF2QixDQVBBLENBQUE7YUFRQSxJQUFDLENBQUEsVUFBVSxDQUFDLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEMsY0FBQSxjQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQTJCLEtBQUMsQ0FBQSxNQUE1QixDQUFQLENBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsQ0FEWCxDQUFBO0FBRUEsVUFBQSxJQUFHLFFBQUEsS0FBYyxLQUFDLENBQUEsUUFBbEI7QUFDRSxZQUFBLEtBQUMsQ0FBQSxrQkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLFFBQUQsR0FBWSxRQURaLENBQUE7QUFBQSxZQUVBLEtBQUMsQ0FBQSxnQkFBRCxDQUFBLENBRkEsQ0FERjtXQUZBO2lCQU9BLEtBUm9DO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEMsRUFUaUI7SUFBQSxDQWhabkIsQ0FBQTs7QUFBQSwwQkFvYUEscUJBQUEsR0FBdUIsU0FBQSxHQUFBO2FBQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRHFCO0lBQUEsQ0FwYXZCLENBQUE7O0FBQUEsMEJBMmFBLG1CQUFBLEdBQXFCLFNBQUMsVUFBRCxHQUFBO0FBQ25CLE1BQUEsSUFBRyxVQUFBLEtBQWMsSUFBQyxDQUFBLE1BQWxCO0FBQ0UsUUFBQSxJQUF1QixJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFWLEtBQW9CLENBQTNDO0FBQUEsVUFBQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FEQSxDQUFBO2VBRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQUEsRUFIRjtPQUFBLE1BQUE7QUFLRSxRQUFBLElBQXlCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLE1BQVYsS0FBb0IsQ0FBN0M7aUJBQUEsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFBQTtTQUxGO09BRG1CO0lBQUEsQ0EzYXJCLENBQUE7O0FBQUEsMEJBcWJBLFlBQUEsR0FBYyxTQUFDLENBQUQsR0FBQTtBQUNaLFVBQUEsd0JBQUE7QUFBQSxNQUFBLElBQVUsSUFBQyxDQUFBLFNBQVg7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0MsZ0JBQUEsV0FBRCxFQUFjLGdCQUFBLFdBRGQsQ0FBQTtBQUVBLE1BQUEsSUFBRyxXQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBc0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUEsQ0FBQSxHQUEwQixXQUFoRCxDQUFBLENBREY7T0FGQTtBQUlBLE1BQUEsSUFBRyxXQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFBLENBQUEsR0FBeUIsV0FBOUMsRUFERjtPQUxZO0lBQUEsQ0FyYmQsQ0FBQTs7QUFBQSwwQkErYkEsV0FBQSxHQUFhLFNBQUMsQ0FBRCxHQUFBO0FBRVgsVUFBQSxnQkFBQTtBQUFBLE1BQUEsSUFBVSxDQUFDLENBQUMsS0FBRixLQUFhLENBQXZCO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFEYixDQUFBO0FBQUEsTUFFQSxDQUFDLENBQUMsY0FBRixDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUtBLENBQUEsR0FBSSxDQUFDLENBQUMsS0FBRixHQUFVLElBQUMsQ0FBQSxTQUxmLENBQUE7QUFBQSxNQU1BLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBSSxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUFMLENBQUEsR0FBZ0MsSUFBQyxDQUFBLE1BTnZDLENBQUE7QUFBQSxNQVFBLFFBQUEsR0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyw4QkFBdEIsQ0FBcUQ7QUFBQSxRQUFDLEtBQUEsR0FBRDtBQUFBLFFBQU0sSUFBQSxFQUFNLENBQVo7T0FBckQsQ0FSWCxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQStCLFFBQS9CLEVBQXlDO0FBQUEsUUFBQSxNQUFBLEVBQVEsSUFBUjtPQUF6QyxDQVRBLENBQUE7YUFZQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDVCxLQUFDLENBQUEsU0FBRCxHQUFhLE1BREo7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBRUUsR0FGRixFQWRXO0lBQUEsQ0EvYmIsQ0FBQTs7QUFBQSwwQkFtZEEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBdkIsQ0FBOEIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUExQyxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsMEJBQUQsQ0FBQSxDQUhBLENBQUE7YUFJQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBQSxFQUxtQjtJQUFBLENBbmRyQixDQUFBOztBQUFBLDBCQTRkQSxXQUFBLEdBQWEsU0FBQyxDQUFELEdBQUE7QUFFWCxVQUFBLENBQUE7QUFBQSxNQUFBLElBQVUsQ0FBQyxDQUFDLEtBQUYsS0FBYSxDQUF2QjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBRGIsQ0FBQTtBQUFBLE1BRUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLENBQUMsQ0FBQyxlQUFGLENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFLQSxDQUFBLEdBQUksQ0FBQyxDQUFDLEtBQUYsR0FBVSxJQUFDLENBQUEsU0FMZixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUEsR0FBSSxDQUFDLElBQUMsQ0FBQSxTQUFTLENBQUMsQ0FBWCxHQUFlLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQXBDLENBTmIsQ0FBQTthQU9BLElBQUMsQ0FBQSxFQUFELENBQUksd0JBQUosRUFBOEIsSUFBQyxDQUFBLE1BQS9CLEVBVFc7SUFBQSxDQTVkYixDQUFBOztBQUFBLDBCQXdlQSxNQUFBLEdBQVEsU0FBQyxDQUFELEdBQUE7QUFDTixNQUFBLElBQUcsQ0FBQyxDQUFDLEtBQUYsS0FBVyxDQUFkO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBUSxDQUFSLEVBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQWIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxHQUFELENBQUssZUFBTCxFQUpGO09BRE07SUFBQSxDQXhlUixDQUFBOztBQUFBLDBCQWdmQSxNQUFBLEdBQVEsU0FBQyxDQUFELEdBQUE7QUFJTixVQUFBLE1BQUE7QUFBQSxNQUFBLENBQUEsR0FBSSxDQUFDLENBQUMsS0FBRixHQUFVLElBQUMsQ0FBQSxTQUFmLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxDQUFDLENBQUEsR0FBRSxJQUFDLENBQUEsS0FBSixDQUFBLEdBQWEsQ0FBQyxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFwQixHQUEyQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQXZDLENBQWIsR0FBOEQsQ0FBQyxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFuQixHQUEwQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQXRDLENBRHBFLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUE1QixFQU5NO0lBQUEsQ0FoZlIsQ0FBQTs7QUFBQSwwQkF1Z0JBLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSyxDQUFMLEdBQUE7O1FBQUMsSUFBRTtPQUNaOztRQURjLElBQUU7T0FDaEI7QUFBQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFIO2VBQ0csY0FBQSxHQUFhLENBQWIsR0FBZ0IsTUFBaEIsR0FBcUIsQ0FBckIsR0FBd0IsU0FEM0I7T0FBQSxNQUFBO2VBR0csWUFBQSxHQUFXLENBQVgsR0FBYyxNQUFkLEdBQW1CLENBQW5CLEdBQXNCLE1BSHpCO09BRFM7SUFBQSxDQXZnQlgsQ0FBQTs7QUFBQSwwQkFraEJBLEtBQUEsR0FBTyxTQUFDLEtBQUQsR0FBQTthQUFZLFNBQUEsR0FBUSxLQUFSLEdBQWUsSUFBZixHQUFrQixLQUFsQixHQUF5QixJQUFyQztJQUFBLENBbGhCUCxDQUFBOztBQUFBLDBCQXdoQkEsU0FBQSxHQUFXLFNBQUMsRUFBRCxFQUFLLFNBQUwsR0FBQTthQUNULEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBVCxHQUEyQixFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVQsR0FBcUIsVUFEdkM7SUFBQSxDQXhoQlgsQ0FBQTs7dUJBQUE7O0tBRHdCLEtBekMxQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-view.coffee