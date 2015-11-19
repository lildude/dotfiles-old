(function() {
  var CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  debounce = require('underscore-plus').debounce;

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  EventsDelegation = require('atom-utils').EventsDelegation;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  MinimapElement = (function(_super) {
    __extends(MinimapElement, _super);

    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
      return MinimapElement.__super__.constructor.apply(this, arguments);
    }

    DOMStylesReader.includeInto(MinimapElement);

    CanvasDrawer.includeInto(MinimapElement);

    EventsDelegation.includeInto(MinimapElement);


    /* Public */

    MinimapElement.prototype.domPollingInterval = 100;

    MinimapElement.prototype.domPollingIntervalId = null;

    MinimapElement.prototype.domPollingPaused = false;

    MinimapElement.prototype.displayMinimapOnLeft = false;

    MinimapElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.initializeContent();
      this.subscriptions.add(atom.themes.onDidChangeActiveThemes((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.requestForcedUpdate();
        };
      })(this)));
      return this.observeConfig({
        'minimap.displayMinimapOnLeft': (function(_this) {
          return function(displayMinimapOnLeft) {
            var swapPosition;
            swapPosition = (_this.minimap != null) && displayMinimapOnLeft !== _this.displayMinimapOnLeft;
            _this.displayMinimapOnLeft = displayMinimapOnLeft;
            if (swapPosition) {
              return _this.swapMinimapPosition();
            }
          };
        })(this),
        'minimap.minimapScrollIndicator': (function(_this) {
          return function(minimapScrollIndicator) {
            _this.minimapScrollIndicator = minimapScrollIndicator;
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null)) {
              _this.initializeScrollIndicator();
            } else if (_this.scrollIndicator != null) {
              _this.disposeScrollIndicator();
            }
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.displayPluginsControls': (function(_this) {
          return function(displayPluginsControls) {
            _this.displayPluginsControls = displayPluginsControls;
            if (_this.displayPluginsControls && (_this.openQuickSettings == null)) {
              return _this.initializeOpenQuickSettings();
            } else if (_this.openQuickSettings != null) {
              return _this.disposeOpenQuickSettings();
            }
          };
        })(this),
        'minimap.textOpacity': (function(_this) {
          return function(textOpacity) {
            _this.textOpacity = textOpacity;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.displayCodeHighlights': (function(_this) {
          return function(displayCodeHighlights) {
            _this.displayCodeHighlights = displayCodeHighlights;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.adjustMinimapWidthToSoftWrap': (function(_this) {
          return function(adjustToSoftWrap) {
            _this.adjustToSoftWrap = adjustToSoftWrap;
            if (_this.attached) {
              _this.measureHeightAndWidth();
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.useHardwareAcceleration': (function(_this) {
          return function(useHardwareAcceleration) {
            _this.useHardwareAcceleration = useHardwareAcceleration;
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.attachedCallback = function() {
      this.domPollingIntervalId = setInterval(((function(_this) {
        return function() {
          return _this.pollDOM();
        };
      })(this)), this.domPollingInterval);
      this.measureHeightAndWidth();
      this.requestUpdate();
      return this.attached = true;
    };

    MinimapElement.prototype.detachedCallback = function() {
      clearInterval(this.domPollingIntervalId);
      return this.attached = false;
    };

    MinimapElement.prototype.attributeChangedCallback = function(attrName, oldValue, newValue) {};

    MinimapElement.prototype.isVisible = function() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    };

    MinimapElement.prototype.attach = function() {
      if (this.attached) {
        return;
      }
      this.swapMinimapPosition();
      return this.attached = true;
    };

    MinimapElement.prototype.attachToLeft = function() {
      var root;
      root = this.getTextEditorElementRoot();
      return root.insertBefore(this, root.children[0]);
    };

    MinimapElement.prototype.attachToRight = function() {
      return this.getTextEditorElementRoot().appendChild(this);
    };

    MinimapElement.prototype.swapMinimapPosition = function() {
      if (this.displayMinimapOnLeft) {
        return this.attachToLeft();
      } else {
        return this.attachToRight();
      }
    };

    MinimapElement.prototype.detach = function() {
      if (!this.attached) {
        return;
      }
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    MinimapElement.prototype.destroy = function() {
      this.subscriptions.dispose();
      return this.detach();
    };

    MinimapElement.prototype.initializeContent = function() {
      var canvasMousedown, elementMousewheel, visibleAreaMousedown;
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
      elementMousewheel = (function(_this) {
        return function(e) {
          return _this.relayMousewheelEvent(e);
        };
      })(this);
      canvasMousedown = (function(_this) {
        return function(e) {
          return _this.mousePressedOverCanvas(e);
        };
      })(this);
      visibleAreaMousedown = (function(_this) {
        return function(e) {
          return _this.startDrag(e);
        };
      })(this);
      this.addEventListener('mousewheel', elementMousewheel);
      this.canvas.addEventListener('mousedown', canvasMousedown);
      this.visibleArea.addEventListener('mousedown', visibleAreaMousedown);
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.removeEventListener('mousewheel', elementMousewheel);
          _this.canvas.removeEventListener('mousedown', canvasMousedown);
          return _this.visibleArea.removeEventListener('mousedown', visibleAreaMousedown);
        };
      })(this)));
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      this.controls.removeChild(this.scrollIndicator);
      return this.scrollIndicator = void 0;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if (this.openQuickSettings != null) {
        return;
      }
      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);
      return this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': (function(_this) {
          return function(e) {
            var left, right, top, _ref1;
            e.preventDefault();
            e.stopPropagation();
            if (_this.quickSettingsElement != null) {
              _this.quickSettingsElement.destroy();
              return _this.quickSettingsSubscription.dispose();
            } else {
              if (MinimapQuickSettingsElement == null) {
                MinimapQuickSettingsElement = require('./minimap-quick-settings-element');
              }
              _this.quickSettingsElement = new MinimapQuickSettingsElement;
              _this.quickSettingsElement.setModel(_this);
              _this.quickSettingsSubscription = _this.quickSettingsElement.onDidDestroy(function() {
                return _this.quickSettingsElement = null;
              });
              _this.quickSettingsElement.attach();
              _ref1 = _this.canvas.getBoundingClientRect(), top = _ref1.top, left = _ref1.left, right = _ref1.right;
              _this.quickSettingsElement.style.top = top + 'px';
              if (_this.displayMinimapOnLeft) {
                return _this.quickSettingsElement.style.left = right + 'px';
              } else {
                return _this.quickSettingsElement.style.left = (left - _this.quickSettingsElement.clientWidth) + 'px';
              }
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.disposeOpenQuickSettings = function() {
      if (this.openQuickSettings == null) {
        return;
      }
      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      return this.openQuickSettings = void 0;
    };

    MinimapElement.prototype.getTextEditor = function() {
      return this.minimap.getTextEditor();
    };

    MinimapElement.prototype.getTextEditorElement = function() {
      return this.editorElement != null ? this.editorElement : this.editorElement = atom.views.getView(this.getTextEditor());
    };

    MinimapElement.prototype.getTextEditorElementRoot = function() {
      var editorElement, _ref1;
      editorElement = this.getTextEditorElement();
      return (_ref1 = editorElement.shadowRoot) != null ? _ref1 : editorElement;
    };

    MinimapElement.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    };

    MinimapElement.prototype.getModel = function() {
      return this.minimap;
    };

    MinimapElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeConfig((function(_this) {
        return function() {
          if (_this.attached) {
            return _this.requestForcedUpdate();
          }
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      return this.minimap;
    };

    MinimapElement.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapElement.prototype.requestForcedUpdate = function() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapElement.prototype.update = function() {
      var canvasTop, canvasTransform, editorHeight, indicatorHeight, indicatorScroll, visibleAreaLeft, visibleAreaTop;
      if (!(this.attached && this.isVisible() && !this.minimap.isDestroyed())) {
        return;
      }
      if (this.adjustToSoftWrap && (this.marginRight != null)) {
        this.style.marginRight = this.marginRight + 'px';
      } else {
        this.style.marginRight = null;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      this.applyStyles(this.visibleArea, {
        width: this.clientWidth + 'px',
        height: this.minimap.getTextEditorScaledHeight() + 'px',
        transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
      });
      this.applyStyles(this.controls, {
        width: Math.min(this.canvas.width / devicePixelRatio, this.width) + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      this.applyStyles(this.canvas, {
        transform: canvasTransform
      });
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        editorHeight = this.getTextEditor().getHeight();
        indicatorHeight = editorHeight * (editorHeight / this.minimap.getHeight());
        indicatorScroll = (editorHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        this.applyStyles(this.scrollIndicator, {
          height: indicatorHeight + 'px',
          transform: this.makeTranslate(0, indicatorScroll)
        });
        if (!this.minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }
      return this.updateCanvas();
    };

    MinimapElement.prototype.setDisplayCodeHighlights = function(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.pauseDOMPolling = function() {
      this.domPollingPaused = true;
      if (this.resumeDOMPollingAfterDelay == null) {
        this.resumeDOMPollingAfterDelay = debounce(this.resumeDOMPolling, 100);
      }
      return this.resumeDOMPollingAfterDelay();
    };

    MinimapElement.prototype.resumeDOMPolling = function() {
      return this.domPollingPaused = false;
    };

    MinimapElement.prototype.resumeDOMPollingAfterDelay = null;

    MinimapElement.prototype.pollDOM = function() {
      if (this.domPollingPaused || this.updateRequested) {
        return;
      }
      if (this.width !== this.clientWidth || this.height !== this.clientHeight) {
        this.measureHeightAndWidth();
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.measureHeightAndWidth = function() {
      var canvasWidth, lineLength, softWrap, softWrapAtPreferredLineLength, width;
      this.height = this.clientHeight;
      this.width = this.clientWidth;
      canvasWidth = this.width;
      if (!this.isVisible()) {
        return;
      }
      if (this.adjustToSoftWrap) {
        lineLength = atom.config.get('editor.preferredLineLength');
        softWrap = atom.config.get('editor.softWrap');
        softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
        width = lineLength * this.minimap.getCharWidth();
        if (softWrap && softWrapAtPreferredLineLength && lineLength && width < this.width) {
          this.marginRight = width - this.width;
          canvasWidth = width;
        } else {
          this.marginRight = null;
        }
      } else {
        delete this.marginRight;
      }
      if (canvasWidth !== this.canvas.width || this.height !== this.canvas.height) {
        this.canvas.width = canvasWidth * devicePixelRatio;
        return this.canvas.height = (this.height + this.minimap.getLineHeight()) * devicePixelRatio;
      }
    };

    MinimapElement.prototype.observeConfig = function(configs) {
      var callback, config, _results;
      if (configs == null) {
        configs = {};
      }
      _results = [];
      for (config in configs) {
        callback = configs[config];
        _results.push(this.subscriptions.add(atom.config.observe(config, callback)));
      }
      return _results;
    };

    MinimapElement.prototype.mousePressedOverCanvas = function(_arg) {
      var duration, from, pageY, row, scrollTop, step, target, to, which, y;
      which = _arg.which, pageY = _arg.pageY, target = _arg.target;
      if (which !== 1) {
        return;
      }
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();
      scrollTop = row * this.minimap.textEditor.getLineHeightInPixels() - this.minimap.textEditor.getHeight() / 2;
      from = this.minimap.textEditor.getScrollTop();
      to = scrollTop;
      step = (function(_this) {
        return function(now) {
          return _this.minimap.textEditor.setScrollTop(now);
        };
      })(this);
      if (atom.config.get('minimap.scrollAnimation')) {
        duration = 300;
      } else {
        duration = 0;
      }
      return this.animate({
        from: from,
        to: to,
        duration: duration,
        step: step
      });
    };

    MinimapElement.prototype.relayMousewheelEvent = function(e) {
      var editorElement;
      editorElement = atom.views.getView(this.minimap.textEditor);
      return editorElement.component.onMouseWheel(e);
    };

    MinimapElement.prototype.startDrag = function(_arg) {
      var dragOffset, initial, mousemoveHandler, mouseupHandler, offsetTop, pageY, top, which;
      which = _arg.which, pageY = _arg.pageY;
      if (which !== 1) {
        return;
      }
      top = this.visibleArea.getBoundingClientRect().top;
      offsetTop = this.getBoundingClientRect().top;
      dragOffset = pageY - top;
      initial = {
        dragOffset: dragOffset,
        offsetTop: offsetTop
      };
      mousemoveHandler = (function(_this) {
        return function(e) {
          return _this.drag(e, initial);
        };
      })(this);
      mouseupHandler = (function(_this) {
        return function(e) {
          return _this.endDrag(e, initial);
        };
      })(this);
      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseout', mouseupHandler);
      return this.dragSubscription = new Disposable((function(_this) {
        return function() {
          document.body.removeEventListener('mousemove', mousemoveHandler);
          document.body.removeEventListener('mouseup', mouseupHandler);
          return document.body.removeEventListener('mouseout', mouseupHandler);
        };
      })(this));
    };

    MinimapElement.prototype.drag = function(e, initial) {
      var ratio, y;
      if (e.which !== 1) {
        return;
      }
      y = e.pageY - initial.offsetTop - initial.dragOffset;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.textEditor.setScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
      cssText = '';
      for (property in styles) {
        value = styles[property];
        cssText += "" + property + ": " + value + "; ";
      }
      return element.style.cssText = cssText;
    };

    MinimapElement.prototype.makeTranslate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (this.useHardwareAcceleration) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapElement.prototype.makeScale = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = x;
      }
      if (this.useHardwareAcceleration) {
        return "scale3d(" + x + ", " + y + ", 1)";
      } else {
        return "scale(" + x + ", " + y + ")";
      }
    };

    MinimapElement.prototype.animate = function(_arg) {
      var duration, from, start, step, swing, to, update;
      from = _arg.from, to = _arg.to, duration = _arg.duration, step = _arg.step;
      start = new Date();
      swing = function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };
      update = function() {
        var delta, passed, progress;
        passed = new Date() - start;
        if (duration === 0) {
          progress = 1;
        } else {
          progress = passed / duration;
        }
        if (progress > 1) {
          progress = 1;
        }
        delta = swing(progress);
        step(from + (to - from) * delta);
        if (progress < 1) {
          return requestAnimationFrame(update);
        }
      };
      return update();
    };

    return MinimapElement;

  })(HTMLElement);

  module.exports = MinimapElement = document.registerElement('atom-text-editor-minimap', {
    prototype: MinimapElement.prototype
  });

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBRHRCLENBQUE7O0FBQUEsRUFFQyxtQkFBb0IsT0FBQSxDQUFRLFlBQVIsRUFBcEIsZ0JBRkQsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDRCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1BLDJCQUFBLEdBQThCLElBTjlCLENBQUE7O0FBQUEsRUFTTTtBQUNKLHFDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxlQUFlLENBQUMsV0FBaEIsQ0FBNEIsY0FBNUIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsY0FBekIsQ0FEQSxDQUFBOztBQUFBLElBRUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsY0FBN0IsQ0FGQSxDQUFBOztBQUlBO0FBQUEsZ0JBSkE7O0FBQUEsNkJBTUEsa0JBQUEsR0FBb0IsR0FOcEIsQ0FBQTs7QUFBQSw2QkFPQSxvQkFBQSxHQUFzQixJQVB0QixDQUFBOztBQUFBLDZCQVFBLGdCQUFBLEdBQWtCLEtBUmxCLENBQUE7O0FBQUEsNkJBU0Esb0JBQUEsR0FBc0IsS0FUdEIsQ0FBQTs7QUFBQSw2QkFtQkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGlCQUFE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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-element.coffee