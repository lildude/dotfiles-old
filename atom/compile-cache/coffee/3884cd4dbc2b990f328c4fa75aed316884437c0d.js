(function() {
  var $, CompositeDisposable, Delegato, Disposable, MinimapIndicator, MinimapOpenQuickSettingsView, MinimapRenderView, MinimapView, TextEditorView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  Delegato = require('delegato');

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Disposable = _ref1.Disposable;

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

    MinimapView.content = function() {
      return this.div({
        "class": 'minimap'
      }, (function(_this) {
        return function() {
          if (atom.config.get('minimap.displayPluginsControls')) {
            _this.subview('openQuickSettings', new MinimapOpenQuickSettingsView);
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

    function MinimapView(editorView) {
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
      this.setEditorView(editorView);
      this.paneView.addClass('with-minimap');
      this.subscriptions = new CompositeDisposable;
      MinimapView.__super__.constructor.apply(this, arguments);
      this.computeScale();
      this.miniScrollView = this.renderView.scrollView;
      this.offsetLeft = 0;
      this.offsetTop = 0;
      this.indicator = new MinimapIndicator();
      this.scrollView = this.editorView.scrollView;
      this.scrollViewLines = this.scrollView.find('.lines');
      this.subscribeToEditor();
      this.renderView.minimapView = this;
      this.renderView.setEditorView(this.editorView);
      this.updateMinimapView();
    }

    MinimapView.prototype.initialize = function() {
      var config;
      this.on('mousewheel', this.onMouseWheel);
      this.on('mousedown', this.onMouseDown);
      this.miniVisibleArea.on('mousedown', this.onDragStart);
      this.obsPane = this.paneView.model.observeActiveItem(this.onActiveItemChanged);
      this.subscribe(this.renderView, 'minimap:updated', this.updateMinimapSize);
      this.subscribe(this.renderView, 'minimap:scaleChanged', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updatePositions();
        };
      })(this));
      this.observer = new MutationObserver((function(_this) {
        return function(mutations) {
          return _this.updateTopPosition();
        };
      })(this));
      config = {
        childList: true
      };
      this.observer.observe(this.paneView.element, config);
      this.subscriptions.add(atom.themes.onDidReloadAll((function(_this) {
        return function() {
          _this.updateTopPosition();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscribe($(window), 'resize:end', this.onScrollViewResized);
      this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
      this.miniScroller.toggleClass('visible', this.miniScrollVisible);
      this.displayCodeHighlights = atom.config.get('minimap.displayCodeHighlights');
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.minimapScrollIndicator', (function(_this) {
        return function() {
          _this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
          return _this.miniScroller.toggleClass('visible', _this.miniScrollVisible);
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.useHardwareAcceleration', (function(_this) {
        return function() {
          if (_this.ScrollView != null) {
            return _this.updateScroll();
          }
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.displayCodeHighlights', (function(_this) {
        return function() {
          var newOptionValue;
          newOptionValue = atom.config.get('minimap.displayCodeHighlights');
          return _this.setDisplayCodeHighlights(newOptionValue);
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.adjustMinimapWidthToSoftWrap', (function(_this) {
        return function(value) {
          if (value) {
            return _this.updateMinimapSize();
          } else {
            return _this.resetMinimapWidthWithWrap();
          }
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('editor.softWrap', (function(_this) {
        return function() {
          _this.updateMinimapSize();
          return _this.updateMinimapView();
        };
      })(this))));
      return this.subscriptions.add(this.asDisposable(atom.config.observe('editor.preferredLineLength', (function(_this) {
        return function() {
          return _this.updateMinimapSize();
        };
      })(this))));
    };

    MinimapView.prototype.computeScale = function() {
      var computedLineHeight, originalLineHeight;
      originalLineHeight = parseInt(this.editorView.find('.lines').css('line-height'));
      computedLineHeight = this.getLineHeight();
      return this.scaleX = this.scaleY = computedLineHeight / originalLineHeight;
    };

    MinimapView.prototype.destroy = function() {
      this.paneView.removeClass('with-minimap');
      this.off();
      this.obsPane.dispose();
      this.unsubscribe();
      this.observer.disconnect();
      this.detachFromPaneView();
      this.renderView.destroy();
      return this.remove();
    };

    MinimapView.prototype.setEditorView = function(editorView) {
      var _ref2;
      this.editorView = editorView;
      this.editor = this.editorView.getEditor();
      this.paneView = this.editorView.getPaneView();
      return (_ref2 = this.renderView) != null ? _ref2.setEditorView(this.editorView) : void 0;
    };

    MinimapView.prototype.setDisplayCodeHighlights = function(value) {
      if (value !== this.displayCodeHighlights) {
        this.displayCodeHighlights = value;
        return this.renderView.forceUpdate();
      }
    };

    MinimapView.prototype.attachToPaneView = function() {
      this.paneView.append(this);
      return this.updateTopPosition();
    };

    MinimapView.prototype.detachFromPaneView = function() {
      return this.detach();
    };

    MinimapView.prototype.minimapIsAttached = function() {
      return this.paneView.find('.minimap').length === 1;
    };

    MinimapView.prototype.getEditorViewClientRect = function() {
      return this.scrollView[0].getBoundingClientRect();
    };

    MinimapView.prototype.getScrollViewClientRect = function() {
      return this.scrollViewLines[0].getBoundingClientRect();
    };

    MinimapView.prototype.getMinimapClientRect = function() {
      return this[0].getBoundingClientRect();
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
      if (wraps && adjustWidth && size) {
        maxWidth = (size * this.getCharWidth()) + 'px';
        this.css({
          maxWidth: maxWidth
        });
        if (displayLeft) {
          return this.editorView.find('.editor-contents').css({
            paddingLeft: maxWidth
          });
        } else {
          this.editorView.find('.editor-contents').css({
            paddingRight: maxWidth
          });
          return this.editorView.find('.vertical-scrollbar').css({
            right: maxWidth
          });
        }
      }
    };

    MinimapView.prototype.resetMinimapWidthWithWrap = function() {
      this.css({
        maxWidth: ''
      });
      this.editorView.find('.editor-contents').css({
        paddingRight: ''
      });
      this.editorView.find('.editor-contents').css({
        paddingLeft: ''
      });
      return this.editorView.find('.vertical-scrollbar').css({
        right: ''
      });
    };

    MinimapView.prototype.updateScrollY = function(top) {
      var overlayY, overlayerOffset, scrollViewOffset;
      if (top != null) {
        overlayY = top;
      } else {
        scrollViewOffset = this.scrollView.offset().top;
        overlayerOffset = this.scrollView.find('.overlayer').offset().top;
        overlayY = -overlayerOffset + scrollViewOffset;
      }
      this.indicator.setY(overlayY * this.scaleY);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScrollX = function() {
      this.indicator.setX(this.scrollView[0].scrollLeft);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScroll = function() {
      this.indicator.setX(this.scrollView[0].scrollLeft);
      this.updateScrollY();
      return this.trigger('minimap:scroll');
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
        top: (this.offsetTop = this.editorView.offset().top)
      });
    };


    /* Internal */

    MinimapView.prototype.subscribeToEditor = function() {
      this.subscribe(this.editor, 'scroll-top-changed.minimap', this.updateScrollY);
      return this.subscribe(this.scrollView, 'scroll.minimap', this.updateScrollX);
    };

    MinimapView.prototype.unsubscribeFromEditor = function() {
      if (this.editor != null) {
        this.unsubscribe(this.editor, '.minimap');
      }
      if (this.scrollView != null) {
        return this.unsubscribe(this.scrollView, '.minimap');
      }
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
      var wheelDeltaX, wheelDeltaY, _ref2;
      if (this.isClicked) {
        return;
      }
      _ref2 = e.originalEvent, wheelDeltaX = _ref2.wheelDeltaX, wheelDeltaY = _ref2.wheelDeltaY;
      if (wheelDeltaX) {
        this.editorView.scrollLeft(this.editorView.scrollLeft() - wheelDeltaX);
      }
      if (wheelDeltaY) {
        return this.editorView.scrollTop(this.editorView.scrollTop() - wheelDeltaY);
      }
    };

    MinimapView.prototype.onMouseDown = function(e) {
      var top, y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      top = this.indicator.computeFromCenterY(y) / this.scaleY;
      this.editorView.scrollTop(top);
      return setTimeout((function(_this) {
        return function() {
          return _this.isClicked = false;
        };
      })(this), 377);
    };

    MinimapView.prototype.onScrollViewResized = function() {
      this.renderView.lineCanvas.height(this.editorView.height());
      this.updateMinimapSize();
      this.updateMinimapView();
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
      return this.editorView.scrollTop(top / this.scaleY);
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

    MinimapView.prototype.asDisposable = function(subscription) {
      return new Disposable(function() {
        return subscription.off();
      });
    };

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtKQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLE1BQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxzQkFBQSxjQUFWLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsUUFBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyw0QkFBQSxtQkFBRCxFQUFzQixtQkFBQSxVQUZ0QixDQUFBOztBQUFBLEVBSUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBSnBCLENBQUE7O0FBQUEsRUFLQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVIsQ0FMbkIsQ0FBQTs7QUFBQSxFQU1BLDRCQUFBLEdBQStCLE9BQUEsQ0FBUSxvQ0FBUixDQU4vQixDQUFBOztBQUFBLEVBd0NBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOztBQUFBLElBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsV0FBckIsQ0FBQSxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLGdCQUFELENBQWtCLGVBQWxCLEVBQW1DLGVBQW5DLEVBQW9ELGNBQXBELEVBQW9FLGVBQXBFLEVBQXFGLGtCQUFyRixFQUF5Ryx3QkFBekcsRUFBbUkseUJBQW5JLEVBQThKLDBCQUE5SixFQUEwTCx5QkFBMUwsRUFBcU4sZ0NBQXJOLEVBQXVQLGdCQUF2UCxFQUF5USxrQkFBelEsRUFBNlIsOEJBQTdSLEVBQTZULCtCQUE3VCxFQUE4VjtBQUFBLE1BQUEsVUFBQSxFQUFZLFlBQVo7S0FBOVYsQ0FGQSxDQUFBOztBQUFBLElBSUEsV0FBQyxDQUFBLGdCQUFELENBQWtCLGNBQWxCLEVBQWtDLGVB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-view.coffee