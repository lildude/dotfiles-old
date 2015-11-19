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

    MinimapElement.prototype.devicePixelRatio = 1;

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
        })(this),
        'minimap.devicePixelRatio': (function(_this) {
          return function(devicePixelRatio) {
            _this.devicePixelRatio = devicePixelRatio;
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
        this.canvas.width = canvasWidth * this.devicePixelRatio;
        return this.canvas.height = (this.height + this.minimap.getLineHeight()) * this.devicePixelRatio;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBRHRCLENBQUE7O0FBQUEsRUFFQyxtQkFBb0IsT0FBQSxDQUFRLFlBQVIsRUFBcEIsZ0JBRkQsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDRCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1BLDJCQUFBLEdBQThCLElBTjlCLENBQUE7O0FBQUEsRUFTTTtBQUNKLHFDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxlQUFlLENBQUMsV0FBaEIsQ0FBNEIsY0FBNUIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsY0FBekIsQ0FEQSxDQUFBOztBQUFBLElBRUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsY0FBN0IsQ0FGQSxDQUFBOztBQUlBO0FBQUEsZ0JBSkE7O0FBQUEsNkJBTUEsa0JBQUEsR0FBb0IsR0FOcEIsQ0FBQTs7QUFBQSw2QkFPQSxvQkFBQSxHQUFzQixJQVB0QixDQUFBOztBQUFBLDZCQVFBLGdCQUFBLEdBQWtCLEtBUmxCLENBQUE7O0FBQUEsNkJBU0Esb0JBQUEsR0FBc0IsS0FUdEIsQ0FBQTs7QUFBQSw2QkFVQSxnQkFBQSxHQUFrQixDQVZsQixDQUFBOztBQUFBLDZCQW9CQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1C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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/minimap-element.coffee