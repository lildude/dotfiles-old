(function() {
  var $, CompositeDisposable, Delegato, Disposable, MinimapIndicator, MinimapOpenQuickSettingsView, MinimapRenderView, MinimapView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

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
      MinimapView.__super__.constructor.call(this, {
        minimapView: this,
        editorView: editorView
      });
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

    MinimapView.prototype.computeScale = function() {
      var computedLineHeight, originalLineHeight;
      originalLineHeight = parseInt(this.editorView.find('.lines').css('line-height'));
      computedLineHeight = this.getLineHeight();
      return this.scaleX = this.scaleY = computedLineHeight / originalLineHeight;
    };

    MinimapView.prototype.destroy = function() {
      this.resetMinimapWidthWithWrap();
      this.paneView.removeClass('with-minimap');
      this.off();
      this.obsPane.dispose();
      this.subscriptions.dispose();
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
      if ((_ref2 = this.renderView) != null) {
        _ref2.setEditorView(this.editorView);
      }
      if (this.obsPane != null) {
        this.obsPane.dispose();
        return this.obsPane = this.paneView.model.observeActiveItem(this.onActiveItemChanged);
      }
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
          return this.editorView.css({
            paddingLeft: maxWidth
          });
        } else {
          this.editorView.css({
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
      this.editorView.css({
        paddingRight: '',
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
        overlayerOffset = this.scrollView.find('.lines').offset().top;
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
      this.subscribe(this.scrollView, 'scroll.minimap', this.updateScrollX);
      return this.subscribe(this.editorView, 'focus', (function(_this) {
        return function() {
          if (_this.editorView.getPaneView() !== _this.paneView) {
            _this.detachFromPaneView();
            _this.paneView = _this.editorView.getPaneView();
            _this.attachToPaneView();
          }
          return true;
        };
      })(this));
    };

    MinimapView.prototype.unsubscribeFromEditor = function() {
      if (this.editor != null) {
        this.unsubscribe(this.editor);
      }
      if (this.editorView != null) {
        this.unsubscribe(this.editorView);
      }
      if (this.scrollView != null) {
        return this.unsubscribe(this.scrollView);
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

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsTUFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsUUFBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyw0QkFBQSxtQkFBRCxFQUFzQixtQkFBQSxVQUZ0QixDQUFBOztBQUFBLEVBSUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBSnBCLENBQUE7O0FBQUEsRUFLQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVIsQ0FMbkIsQ0FBQTs7QUFBQSxFQU1BLDRCQUFBLEdBQStCLE9BQUEsQ0FBUSxvQ0FBUixDQU4vQixDQUFBOztBQUFBLEVBd0NBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOztBQUFBLElBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsV0FBckIsQ0FBQSxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLGdCQUFELENBQWtCLGVBQWxCLEVBQW1DLGVBQW5DLEVBQW9ELGNBQXBELEVBQW9FLGVBQXBFLEVBQXFGLGtCQUFyRixFQUF5Ryx3QkFBekcsRUFBbUkseUJBQW5JLEVBQThKLDBCQUE5SixFQUEwTCx5QkFBMUwsRUFBcU4sZ0NBQXJOLEVBQXVQLGdCQUF2UCxFQUF5USxrQkFBelEsRUFBNlIsOEJBQTdSLEVBQTZULCtCQUE3VCxFQUE4VjtBQUFBLE1BQUEsVUFBQSxFQUFZLFlBQVo7S0FBOVYsQ0FGQSxDQUFBOztBQUFBLElBSUEsV0FBQyxDQUFBLGdCQUFELENBQWtCLGNBQWxCLEVBQWtDLGVBQWxDLEVBQW1ELGtCQUFuRCxF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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-view.coffee