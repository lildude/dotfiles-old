(function() {
  var Minimap, MinimapElement, TextEditor, fs, isVisible, mousedown, mousemove, mouseup, mousewheel, path, realOffsetLeft, realOffsetTop, sleep, stylesheet, stylesheetPath, touchmove, touchstart, _ref;

  fs = require('fs-plus');

  path = require('path');

  TextEditor = require('atom').TextEditor;

  Minimap = require('../lib/minimap');

  MinimapElement = require('../lib/minimap-element');

  _ref = require('./helpers/events'), mousemove = _ref.mousemove, mousedown = _ref.mousedown, mouseup = _ref.mouseup, mousewheel = _ref.mousewheel, touchstart = _ref.touchstart, touchmove = _ref.touchmove;

  stylesheetPath = path.resolve(__dirname, '..', 'styles', 'minimap.less');

  stylesheet = atom.themes.loadStylesheet(stylesheetPath);

  realOffsetTop = function(o) {
    var transform;
    transform = new WebKitCSSMatrix(window.getComputedStyle(o).transform);
    return o.offsetTop + transform.m42;
  };

  realOffsetLeft = function(o) {
    var transform;
    transform = new WebKitCSSMatrix(window.getComputedStyle(o).transform);
    return o.offsetLeft + transform.m41;
  };

  isVisible = function(node) {
    return node.offsetWidth > 0 || node.offsetHeight > 0;
  };

  window.devicePixelRatio = 2;

  sleep = function(duration) {
    var t;
    t = new Date;
    return waitsFor(function() {
      return new Date - t > duration;
    });
  };

  describe('MinimapElement', function() {
    var dir, editor, editorElement, jasmineContent, largeSample, mediumSample, minimap, minimapElement, smallSample, _ref1;
    _ref1 = [], editor = _ref1[0], minimap = _ref1[1], largeSample = _ref1[2], mediumSample = _ref1[3], smallSample = _ref1[4], jasmineContent = _ref1[5], editorElement = _ref1[6], minimapElement = _ref1[7], dir = _ref1[8];
    beforeEach(function() {
      jasmineContent = document.body.querySelector('#jasmine-content');
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      atom.config.set('minimap.textOpacity', 1);
      MinimapElement.registerViewProvider();
      editor = new TextEditor({});
      editorElement = atom.views.getView(editor);
      jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
      editorElement.setHeight(50);
      minimap = new Minimap({
        textEditor: editor
      });
      dir = atom.project.getDirectories()[0];
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      mediumSample = fs.readFileSync(dir.resolve('two-hundred.txt')).toString();
      smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
      editor.setText(largeSample);
      return minimapElement = atom.views.getView(minimap);
    });
    it('has been registered in the view registry', function() {
      return expect(minimapElement).toExist();
    });
    it('has stored the minimap as its model', function() {
      return expect(minimapElement.getModel()).toBe(minimap);
    });
    it('has a canvas in a shadow DOM', function() {
      return expect(minimapElement.shadowRoot.querySelector('canvas')).toExist();
    });
    it('has a div representing the visible area', function() {
      return expect(minimapElement.shadowRoot.querySelector('.minimap-visible-area')).toExist();
    });
    return describe('when attached to the text editor element', function() {
      var canvas, lastFn, nextAnimationFrame, noAnimationFrame, visibleArea, _ref2;
      _ref2 = [], noAnimationFrame = _ref2[0], nextAnimationFrame = _ref2[1], lastFn = _ref2[2], canvas = _ref2[3], visibleArea = _ref2[4];
      beforeEach(function() {
        var requestAnimationFrameSafe, styleNode;
        noAnimationFrame = function() {
          throw new Error('No animation frame requested');
        };
        nextAnimationFrame = noAnimationFrame;
        requestAnimationFrameSafe = window.requestAnimationFrame;
        spyOn(window, 'requestAnimationFrame').andCallFake(function(fn) {
          lastFn = fn;
          return nextAnimationFrame = function() {
            nextAnimationFrame = noAnimationFrame;
            return fn();
          };
        });
        styleNode = document.createElement('style');
        styleNode.textContent = "" + stylesheet + "\n\natom-text-editor-minimap[stand-alone] {\n  width: 100px;\n  height: 100px;\n}\n\natom-text-editor, atom-text-editor::shadow {\n  height: 10px;\n  font-size: 9px;\n}\n\natom-text-editor atom-text-editor-minimap, atom-text-editor::shadow atom-text-editor-minimap {\n  background: rgba(255,0,0,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-scroll-indicator, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-scroll-indicator {\n  background: rgba(0,0,255,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-visible-area, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-visible-area {\n  background: rgba(0,255,0,0.3);\n  opacity: 1;\n}\n\natom-text-editor::shadow atom-text-editor-minimap::shadow .open-minimap-quick-settings {\n  opacity: 1 !important;\n}";
        return jasmineContent.appendChild(styleNode);
      });
      beforeEach(function() {
        canvas = minimapElement.shadowRoot.querySelector('canvas');
        editorElement.setWidth(200);
        editorElement.setHeight(50);
        editorElement.setScrollTop(1000);
        editorElement.setScrollLeft(200);
        return minimapElement.attach();
      });
      afterEach(function() {
        return minimap.destroy();
      });
      it('takes the height of the editor', function() {
        expect(minimapElement.offsetHeight).toEqual(editorElement.clientHeight);
        return expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.clientWidth / 11, 0);
      });
      it('knows when attached to a text editor', function() {
        return expect(minimapElement.attachedToTextEditor).toBeTruthy();
      });
      it('resizes the canvas to fit the minimap', function() {
        expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
        return expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
      });
      it('requests an update', function() {
        return expect(minimapElement.frameRequested).toBeTruthy();
      });
      describe('with css filters', function() {
        describe('when a hue-rotate filter is applied to a rgb color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: red;\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgb(0, " + 0x6d + ", " + 0x6d + ")");
            });
          });
        });
        return describe('when a hue-rotate filter is applied to a rgba color', function() {
          var additionnalStyleNode;
          additionnalStyleNode = [][0];
          beforeEach(function() {
            minimapElement.invalidateCache();
            additionnalStyleNode = document.createElement('style');
            additionnalStyleNode.textContent = "" + stylesheet + "\n\n.editor {\n  color: rgba(255,0,0,0);\n  -webkit-filter: hue-rotate(180deg);\n}";
            return jasmineContent.appendChild(additionnalStyleNode);
          });
          return it('computes the new color by applying the hue rotation', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.retrieveStyleFromDom(['.editor'], 'color')).toEqual("rgba(0, " + 0x6d + ", " + 0x6d + ", 0)");
            });
          });
        });
      });
      describe('when the update is performed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return visibleArea = minimapElement.shadowRoot.querySelector('.minimap-visible-area');
          });
        });
        it('sets the visible area width and height', function() {
          expect(visibleArea.offsetWidth).toEqual(minimapElement.clientWidth);
          return expect(visibleArea.offsetHeight).toBeCloseTo(minimap.getTextEditorScaledHeight(), 0);
        });
        it('sets the visible visible area offset', function() {
          expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
          return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
        });
        it('offsets the canvas when the scroll does not match line height', function() {
          editorElement.setScrollTop(1004);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(realOffsetTop(canvas)).toBeCloseTo(-2, -1);
          });
        });
        it('does not fail to update render the invisible char when modified', function() {
          atom.config.set('editor.showInvisibles', true);
          atom.config.set('editor.invisibles', {
            cr: '*'
          });
          return expect(function() {
            return nextAnimationFrame();
          }).not.toThrow();
        });
        it('renders the visible line decorations', function() {
          spyOn(minimapElement, 'drawLineDecorations').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[10, 0], [10, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 0], [100, 10]]), {
            type: 'line',
            color: '#0000FF'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawLineDecorations).toHaveBeenCalled();
            return expect(minimapElement.drawLineDecorations.calls.length).toEqual(2);
          });
        });
        it('renders the visible highlight decorations', function() {
          spyOn(minimapElement, 'drawHighlightDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 0], [1, 4]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[2, 20], [2, 30]]), {
            type: 'highlight-over',
            color: '#0000FF'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-under',
            color: '#0000FF'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightDecoration.calls.length).toEqual(2);
          });
        });
        it('renders the visible outline decorations', function() {
          spyOn(minimapElement, 'drawHighlightOutlineDecoration').andCallThrough();
          minimap.decorateMarker(editor.markBufferRange([[1, 4], [3, 6]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[6, 0], [6, 7]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          minimap.decorateMarker(editor.markBufferRange([[100, 3], [100, 5]]), {
            type: 'highlight-outline',
            color: '#0000ff'
          });
          editorElement.setScrollTop(0);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            expect(minimapElement.drawHighlightOutlineDecoration).toHaveBeenCalled();
            return expect(minimapElement.drawHighlightOutlineDecoration.calls.length).toEqual(4);
          });
        });
        describe('when the editor is scrolled', function() {
          beforeEach(function() {
            editorElement.setScrollTop(2000);
            editorElement.setScrollLeft(50);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('updates the visible area', function() {
            expect(realOffsetTop(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop(), 0);
            return expect(realOffsetLeft(visibleArea)).toBeCloseTo(minimap.getTextEditorScaledScrollLeft(), 0);
          });
        });
        describe('when the editor is resized to a greater size', function() {
          beforeEach(function() {
            var height;
            height = editorElement.getHeight();
            editorElement.style.width = '800px';
            editorElement.style.height = '500px';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('detect the resize and adjust itself', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 11, 0);
            expect(minimapElement.offsetHeight).toEqual(editorElement.offsetHeight);
            expect(canvas.offsetWidth / devicePixelRatio).toBeCloseTo(minimapElement.offsetWidth, 0);
            return expect(canvas.offsetHeight / devicePixelRatio).toBeCloseTo(minimapElement.offsetHeight + minimap.getLineHeight(), 0);
          });
        });
        describe('when the editor visible content is changed', function() {
          beforeEach(function() {
            editorElement.setScrollLeft(0);
            editorElement.setScrollTop(1400);
            editor.setSelectedBufferRange([[101, 0], [102, 20]]);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              spyOn(minimapElement, 'drawLines').andCallThrough();
              return editor.insertText('foo');
            });
          });
          return it('rerenders the part that have changed', function() {
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.drawLines).toHaveBeenCalled();
              expect(minimapElement.drawLines.argsForCall[0][1]).toEqual(100);
              return expect(minimapElement.drawLines.argsForCall[0][2]).toEqual(101);
            });
          });
        });
        return describe('when the editor visibility change', function() {
          it('does not modify the size of the canvas', function() {
            var canvasHeight, canvasWidth;
            canvasWidth = minimapElement.canvas.width;
            canvasHeight = minimapElement.canvas.height;
            editorElement.style.display = 'none';
            minimapElement.measureHeightAndWidth();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              expect(minimapElement.canvas.width).toEqual(canvasWidth);
              return expect(minimapElement.canvas.height).toEqual(canvasHeight);
            });
          });
          return describe('from hidden to visible', function() {
            beforeEach(function() {
              editorElement.style.display = 'none';
              minimapElement.checkForVisibilityChange();
              spyOn(minimapElement, 'requestForcedUpdate');
              editorElement.style.display = '';
              return minimapElement.pollDOM();
            });
            return it('requests an update of the whole minimap', function() {
              return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
            });
          });
        });
      });
      describe('mouse scroll controls', function() {
        beforeEach(function() {
          editorElement.setWidth(400);
          editorElement.setHeight(400);
          editorElement.setScrollTop(0);
          editorElement.setScrollLeft(0);
          nextAnimationFrame();
          minimapElement.measureHeightAndWidth();
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        describe('using the mouse scrollwheel over the minimap', function() {
          beforeEach(function() {
            spyOn(editorElement.component.presenter, 'setScrollTop').andCallFake(function() {});
            return mousewheel(minimapElement, 0, 15);
          });
          return it('relays the events to the editor view', function() {
            return expect(editorElement.component.presenter.setScrollTop).toHaveBeenCalled();
          });
        });
        describe('middle clicking the minimap', function() {
          var maxScroll, originalLeft, _ref3;
          _ref3 = [], canvas = _ref3[0], visibleArea = _ref3[1], originalLeft = _ref3[2], maxScroll = _ref3[3];
          beforeEach(function() {
            canvas = minimapElement.canvas, visibleArea = minimapElement.visibleArea;
            originalLeft = visibleArea.getBoundingClientRect().left;
            return maxScroll = minimap.getTextEditorMaxScrollTop();
          });
          it('scrolls to the top using the middle mouse button', function() {
            mousedown(canvas, {
              x: originalLeft + 1,
              y: 0,
              btn: 1
            });
            return expect(editorElement.getScrollTop()).toEqual(0);
          });
          describe('scrolling to the middle using the middle mouse button', function() {
            var canvasMidY;
            canvasMidY = void 0;
            beforeEach(function() {
              var actualMidY, editorMidY, height, top, _ref4;
              editorMidY = editorElement.getHeight() / 2.0;
              _ref4 = canvas.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
              canvasMidY = top + (height / 2.0);
              actualMidY = Math.min(canvasMidY, editorMidY);
              return mousedown(canvas, {
                x: originalLeft + 1,
                y: actualMidY,
                btn: 1
              });
            });
            it('scrolls the editor to the middle', function() {
              var middleScrollTop;
              middleScrollTop = Math.round(maxScroll / 2.0);
              return expect(editorElement.getScrollTop()).toEqual(middleScrollTop);
            });
            return it('updates the visible area to be centered', function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                var height, top, visibleCenterY, _ref4;
                nextAnimationFrame();
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, height = _ref4.height;
                visibleCenterY = top + (height / 2);
                return expect(visibleCenterY).toBeCloseTo(200);
              });
            });
          });
          return describe('scrolling the editor to an arbitrary location', function() {
            var scrollRatio, scrollTo, _ref4;
            _ref4 = [], scrollTo = _ref4[0], scrollRatio = _ref4[1];
            beforeEach(function() {
              scrollTo = 101;
              scrollRatio = (scrollTo - minimap.getTextEditorScaledHeight() / 2) / (minimap.getVisibleHeight() - minimap.getTextEditorScaledHeight());
              scrollRatio = Math.max(0, scrollRatio);
              scrollRatio = Math.min(1, scrollRatio);
              mousedown(canvas, {
                x: originalLeft + 1,
                y: scrollTo,
                btn: 1
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            it('scrolls the editor to an arbitrary location', function() {
              var expectedScroll;
              expectedScroll = maxScroll * scrollRatio;
              return expect(editorElement.getScrollTop()).toBeCloseTo(expectedScroll, 0);
            });
            return describe('dragging the visible area with middle mouse button ' + 'after scrolling to the arbitrary location', function() {
              var originalTop;
              originalTop = [][0];
              beforeEach(function() {
                originalTop = visibleArea.getBoundingClientRect().top;
                mousemove(visibleArea, {
                  x: originalLeft + 1,
                  y: scrollTo + 40
                });
                waitsFor(function() {
                  return nextAnimationFrame !== noAnimationFrame;
                });
                return runs(function() {
                  return nextAnimationFrame();
                });
              });
              afterEach(function() {
                return minimapElement.endDrag();
              });
              return it('scrolls the editor so that the visible area was moved down ' + 'by 40 pixels from the arbitrary location', function() {
                var top;
                top = visibleArea.getBoundingClientRect().top;
                return expect(top).toBeCloseTo(originalTop + 40, -1);
              });
            });
          });
        });
        describe('pressing the mouse on the minimap canvas (without scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('scrolls the editor to the line below the mouse', function() {
            return expect(editorElement.getScrollTop()).toEqual(400);
          });
        });
        describe('pressing the mouse on the minimap canvas (with scroll animation)', function() {
          beforeEach(function() {
            var t;
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', true);
            atom.config.set('minimap.scrollAnimationDuration', 300);
            canvas = minimapElement.canvas;
            mousedown(canvas);
            return waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
          });
          return xit('scrolls the editor gradually to the line below the mouse', function() {
            return waitsFor(function() {
              nextAnimationFrame !== noAnimationFrame && nextAnimationFrame();
              return editorElement.getScrollTop() >= 400;
            });
          });
        });
        describe('dragging the visible area', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            mousedown(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            mousemove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            mousemove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('dragging the visible area using touch events', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var left, _ref4;
            visibleArea = minimapElement.visibleArea;
            _ref4 = visibleArea.getBoundingClientRect(), originalTop = _ref4.top, left = _ref4.left;
            touchstart(visibleArea, {
              x: left + 10,
              y: originalTop + 10
            });
            touchmove(visibleArea, {
              x: left + 10,
              y: originalTop + 50
            });
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          afterEach(function() {
            return minimapElement.endDrag();
          });
          it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
            var top;
            top = visibleArea.getBoundingClientRect().top;
            return expect(top).toBeCloseTo(originalTop + 40, -1);
          });
          return it('stops the drag gesture when the mouse is released outside the minimap', function() {
            var left, top, _ref4;
            _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
            mouseup(jasmineContent, {
              x: left - 10,
              y: top + 80
            });
            spyOn(minimapElement, 'drag');
            touchmove(visibleArea, {
              x: left + 10,
              y: top + 50
            });
            return expect(minimapElement.drag).not.toHaveBeenCalled();
          });
        });
        describe('when the minimap cannot scroll', function() {
          var originalTop, _ref3;
          _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
          beforeEach(function() {
            var sample;
            sample = fs.readFileSync(dir.resolve('seventy.txt')).toString();
            editor.setText(sample);
            return editorElement.setScrollTop(0);
          });
          return describe('dragging the visible area', function() {
            beforeEach(function() {
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              runs(function() {
                var left, top, _ref4;
                nextAnimationFrame();
                visibleArea = minimapElement.visibleArea;
                _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
                originalTop = top;
                mousedown(visibleArea, {
                  x: left + 10,
                  y: top + 10
                });
                return mousemove(visibleArea, {
                  x: left + 10,
                  y: top + 50
                });
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls based on a ratio adjusted to the minimap height', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
        return describe('when scroll past end is enabled', function() {
          beforeEach(function() {
            atom.config.set('editor.scrollPastEnd', true);
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return describe('dragging the visible area', function() {
            var originalTop, _ref3;
            _ref3 = [], visibleArea = _ref3[0], originalTop = _ref3[1];
            beforeEach(function() {
              var left, top, _ref4;
              visibleArea = minimapElement.visibleArea;
              _ref4 = visibleArea.getBoundingClientRect(), top = _ref4.top, left = _ref4.left;
              originalTop = top;
              mousedown(visibleArea, {
                x: left + 10,
                y: top + 10
              });
              mousemove(visibleArea, {
                x: left + 10,
                y: top + 50
              });
              waitsFor(function() {
                return nextAnimationFrame !== noAnimationFrame;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            afterEach(function() {
              return minimapElement.endDrag();
            });
            return it('scrolls the editor so that the visible area was moved down by 40 pixels', function() {
              var top;
              top = visibleArea.getBoundingClientRect().top;
              return expect(top).toBeCloseTo(originalTop + 40, -1);
            });
          });
        });
      });
      describe('when the model is a stand-alone minimap', function() {
        beforeEach(function() {
          return minimap.setStandAlone(true);
        });
        it('has a stand-alone attribute', function() {
          return expect(minimapElement.hasAttribute('stand-alone')).toBeTruthy();
        });
        it('sets the minimap size when measured', function() {
          minimapElement.measureHeightAndWidth();
          expect(minimap.width).toEqual(minimapElement.clientWidth);
          return expect(minimap.height).toEqual(minimapElement.clientHeight);
        });
        it('does not display the visible area', function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(isVisible(minimapElement.visibleArea)).toBeFalsy();
          });
        });
        it('does not display the quick settings button', function() {
          atom.config.set('minimap.displayPluginsControls', true);
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          return runs(function() {
            nextAnimationFrame();
            return expect(isVisible(minimapElement.openQuickSettings)).toBeFalsy();
          });
        });
        describe('when minimap.minimapScrollIndicator setting is true', function() {
          beforeEach(function() {
            editor.setText(mediumSample);
            editorElement.setScrollTop(50);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            runs(function() {
              nextAnimationFrame();
              return atom.config.set('minimap.minimapScrollIndicator', true);
            });
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('offsets the scroll indicator by the difference', function() {
            var indicator;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            return expect(realOffsetLeft(indicator)).toBeCloseTo(16, -1);
          });
        });
        return describe('pressing the mouse on the minimap canvas', function() {
          beforeEach(function() {
            var t;
            jasmineContent.appendChild(minimapElement);
            t = 0;
            spyOn(minimapElement, 'getTime').andCallFake(function() {
              var n;
              n = t;
              t += 100;
              return n;
            });
            spyOn(minimapElement, 'requestUpdate').andCallFake(function() {});
            atom.config.set('minimap.scrollAnimation', false);
            canvas = minimapElement.canvas;
            return mousedown(canvas);
          });
          return it('does not scroll the editor to the line below the mouse', function() {
            return expect(editorElement.getScrollTop()).toEqual(1000);
          });
        });
      });
      describe('when the model is destroyed', function() {
        beforeEach(function() {
          return minimap.destroy();
        });
        it('detaches itself from its parent', function() {
          return expect(minimapElement.parentNode).toBeNull();
        });
        return it('stops the DOM polling interval', function() {
          spyOn(minimapElement, 'pollDOM');
          sleep(200);
          return runs(function() {
            return expect(minimapElement.pollDOM).not.toHaveBeenCalled();
          });
        });
      });
      describe('when the atom styles are changed', function() {
        beforeEach(function() {
          waitsFor(function() {
            return nextAnimationFrame !== noAnimationFrame;
          });
          runs(function() {
            var styleNode;
            nextAnimationFrame();
            spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
            spyOn(minimapElement, 'invalidateCache').andCallThrough();
            styleNode = document.createElement('style');
            styleNode.textContent = 'body{ color: #233; }';
            return atom.styles.emitter.emit('did-add-style-element', styleNode);
          });
          return waitsFor(function() {
            return minimapElement.frameRequested;
          });
        });
        return it('forces a refresh with cache invalidation', function() {
          expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
          return expect(minimapElement.invalidateCache).toHaveBeenCalled();
        });
      });
      describe('when minimap.textOpacity is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.textOpacity', 0.3);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayCodeHighlights is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.displayCodeHighlights', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charWidth is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charWidth', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.charHeight is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.charHeight', 1);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.interline is changed', function() {
        beforeEach(function() {
          spyOn(minimapElement, 'requestForcedUpdate').andCallThrough();
          atom.config.set('minimap.interline', 2);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        return it('requests a complete update', function() {
          return expect(minimapElement.requestForcedUpdate).toHaveBeenCalled();
        });
      });
      describe('when minimap.displayMinimapOnLeft setting is true', function() {
        it('moves the attached minimap to the left', function() {
          atom.config.set('minimap.displayMinimapOnLeft', true);
          return expect(minimapElement.classList.contains('left')).toBeTruthy();
        });
        return describe('when the minimap is not attached yet', function() {
          beforeEach(function() {
            editor = new TextEditor({});
            editorElement = atom.views.getView(editor);
            editorElement.setHeight(50);
            editor.setLineHeightInPixels(10);
            minimap = new Minimap({
              textEditor: editor
            });
            minimapElement = atom.views.getView(minimap);
            jasmineContent.insertBefore(editorElement, jasmineContent.firstChild);
            atom.config.set('minimap.displayMinimapOnLeft', true);
            return minimapElement.attach();
          });
          return it('moves the attached minimap to the left', function() {
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      describe('when minimap.adjustMinimapWidthToSoftWrap is true', function() {
        var minimapWidth;
        minimapWidth = [][0];
        beforeEach(function() {
          minimapWidth = minimapElement.offsetWidth;
          atom.config.set('editor.softWrap', true);
          atom.config.set('editor.softWrapAtPreferredLineLength', true);
          atom.config.set('editor.preferredLineLength', 2);
          atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          return runs(function() {
            return nextAnimationFrame();
          });
        });
        it('adjusts the width of the minimap canvas', function() {
          return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
        });
        it('offsets the minimap by the difference', function() {
          expect(realOffsetLeft(minimapElement)).toBeCloseTo(editorElement.clientWidth - 4, -1);
          return expect(minimapElement.clientWidth).toBeCloseTo(minimapWidth, -1);
        });
        describe('the dom polling routine', function() {
          return it('does not change the value', function() {
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              nextAnimationFrame();
              return expect(minimapElement.canvas.width / devicePixelRatio).toEqual(4);
            });
          });
        });
        describe('when the editor is resized', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 6);
            editorElement.style.width = '100px';
            editorElement.style.height = '100px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('makes the minimap smaller than soft wrap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(10, -1);
            return expect(minimapElement.style.marginRight).toEqual('');
          });
        });
        describe('and when minimap.minimapScrollIndicator setting is true', function() {
          beforeEach(function() {
            editor.setText(mediumSample);
            editorElement.setScrollTop(50);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            runs(function() {
              nextAnimationFrame();
              return atom.config.set('minimap.minimapScrollIndicator', true);
            });
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('offsets the scroll indicator by the difference', function() {
            var indicator;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            return expect(realOffsetLeft(indicator)).toBeCloseTo(2, -1);
          });
        });
        describe('and when minimap.displayPluginsControls setting is true', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', true);
          });
          return it('offsets the scroll indicator by the difference', function() {
            var openQuickSettings;
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            return expect(realOffsetLeft(openQuickSettings)).not.toBeCloseTo(2, -1);
          });
        });
        describe('and then disabled', function() {
          beforeEach(function() {
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', false);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 11, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
        return describe('and when preferredLineLength >= 16384', function() {
          beforeEach(function() {
            atom.config.set('editor.preferredLineLength', 16384);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the width of the minimap', function() {
            expect(minimapElement.offsetWidth).toBeCloseTo(editorElement.offsetWidth / 11, -1);
            return expect(minimapElement.style.width).toEqual('');
          });
        });
      });
      describe('when minimap.minimapScrollIndicator setting is true', function() {
        beforeEach(function() {
          editor.setText(mediumSample);
          editorElement.setScrollTop(50);
          waitsFor(function() {
            return minimapElement.frameRequested;
          });
          runs(function() {
            return nextAnimationFrame();
          });
          return atom.config.set('minimap.minimapScrollIndicator', true);
        });
        it('adds a scroll indicator in the element', function() {
          return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).toExist();
        });
        describe('and then deactivated', function() {
          return it('removes the scroll indicator from the element', function() {
            atom.config.set('minimap.minimapScrollIndicator', false);
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
        });
        describe('on update', function() {
          beforeEach(function() {
            var height;
            height = editorElement.getHeight();
            editorElement.style.height = '500px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return nextAnimationFrame !== noAnimationFrame;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          return it('adjusts the size and position of the indicator', function() {
            var height, indicator, scroll;
            indicator = minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
            height = editorElement.getHeight() * (editorElement.getHeight() / minimap.getHeight());
            scroll = (editorElement.getHeight() - height) * minimap.getTextEditorScrollRatio();
            expect(indicator.offsetHeight).toBeCloseTo(height, 0);
            return expect(realOffsetTop(indicator)).toBeCloseTo(scroll, 0);
          });
        });
        return describe('when the minimap cannot scroll', function() {
          beforeEach(function() {
            editor.setText(smallSample);
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('removes the scroll indicator', function() {
            return expect(minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator')).not.toExist();
          });
          return describe('and then can scroll again', function() {
            beforeEach(function() {
              editor.setText(largeSample);
              waitsFor(function() {
                return minimapElement.frameRequested;
              });
              return runs(function() {
                return nextAnimationFrame();
              });
            });
            return it('attaches the scroll indicator', function() {
              return waitsFor(function() {
                return minimapElement.shadowRoot.querySelector('.minimap-scroll-indicator');
              });
            });
          });
        });
      });
      describe('when minimap.absoluteMode setting is true', function() {
        beforeEach(function() {
          return atom.config.set('minimap.absoluteMode', true);
        });
        it('adds a absolute class to the minimap element', function() {
          return expect(minimapElement.classList.contains('absolute')).toBeTruthy();
        });
        return describe('when minimap.displayMinimapOnLeft setting is true', function() {
          return it('also adds a left class to the minimap element', function() {
            atom.config.set('minimap.displayMinimapOnLeft', true);
            expect(minimapElement.classList.contains('absolute')).toBeTruthy();
            return expect(minimapElement.classList.contains('left')).toBeTruthy();
          });
        });
      });
      return describe('when minimap.displayPluginsControls setting is true', function() {
        var openQuickSettings, quickSettingsElement, workspaceElement, _ref3;
        _ref3 = [], openQuickSettings = _ref3[0], quickSettingsElement = _ref3[1], workspaceElement = _ref3[2];
        beforeEach(function() {
          return atom.config.set('minimap.displayPluginsControls', true);
        });
        it('has a div to open the quick settings', function() {
          return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).toExist();
        });
        describe('clicking on the div', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          afterEach(function() {
            return minimapElement.quickSettingsElement.destroy();
          });
          it('opens the quick settings view', function() {
            return expect(quickSettingsElement).toExist();
          });
          return it('positions the quick settings view next to the minimap', function() {
            var minimapBounds, settingsBounds;
            minimapBounds = minimapElement.canvas.getBoundingClientRect();
            settingsBounds = quickSettingsElement.getBoundingClientRect();
            expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
            return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.left - settingsBounds.width, 0);
          });
        });
        describe('when the displayMinimapOnLeft setting is enabled', function() {
          return describe('clicking on the div', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
            afterEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('positions the quick settings view next to the minimap', function() {
              var minimapBounds, settingsBounds;
              minimapBounds = minimapElement.canvas.getBoundingClientRect();
              settingsBounds = quickSettingsElement.getBoundingClientRect();
              expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
              return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
            });
          });
        });
        describe('when the adjustMinimapWidthToSoftWrap setting is enabled', function() {
          var controls;
          controls = [][0];
          beforeEach(function() {
            atom.config.set('editor.softWrap', true);
            atom.config.set('editor.softWrapAtPreferredLineLength', true);
            atom.config.set('editor.preferredLineLength', 2);
            atom.config.set('minimap.adjustMinimapWidthToSoftWrap', true);
            nextAnimationFrame();
            controls = minimapElement.shadowRoot.querySelector('.minimap-controls');
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            editorElement.style.width = '1024px';
            atom.views.performDocumentPoll();
            waitsFor(function() {
              return minimapElement.frameRequested;
            });
            return runs(function() {
              return nextAnimationFrame();
            });
          });
          it('adjusts the size of the control div to fit in the minimap', function() {
            return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
          });
          it('positions the controls div over the canvas', function() {
            var canvasRect, controlsRect;
            controlsRect = controls.getBoundingClientRect();
            canvasRect = minimapElement.canvas.getBoundingClientRect();
            expect(controlsRect.left).toEqual(canvasRect.left);
            return expect(controlsRect.right).toEqual(canvasRect.right);
          });
          return describe('when the displayMinimapOnLeft setting is enabled', function() {
            beforeEach(function() {
              return atom.config.set('minimap.displayMinimapOnLeft', true);
            });
            it('adjusts the size of the control div to fit in the minimap', function() {
              return expect(controls.clientWidth).toEqual(minimapElement.canvas.clientWidth / devicePixelRatio);
            });
            it('positions the controls div over the canvas', function() {
              var canvasRect, controlsRect;
              controlsRect = controls.getBoundingClientRect();
              canvasRect = minimapElement.canvas.getBoundingClientRect();
              expect(controlsRect.left).toEqual(canvasRect.left);
              return expect(controlsRect.right).toEqual(canvasRect.right);
            });
            return describe('clicking on the div', function() {
              beforeEach(function() {
                workspaceElement = atom.views.getView(atom.workspace);
                jasmineContent.appendChild(workspaceElement);
                openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
                mousedown(openQuickSettings);
                return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
              });
              afterEach(function() {
                return minimapElement.quickSettingsElement.destroy();
              });
              return it('positions the quick settings view next to the minimap', function() {
                var minimapBounds, settingsBounds;
                minimapBounds = minimapElement.canvas.getBoundingClientRect();
                settingsBounds = quickSettingsElement.getBoundingClientRect();
                expect(realOffsetTop(quickSettingsElement)).toBeCloseTo(minimapBounds.top, 0);
                return expect(realOffsetLeft(quickSettingsElement)).toBeCloseTo(minimapBounds.right, 0);
              });
            });
          });
        });
        describe('when the quick settings view is open', function() {
          beforeEach(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            jasmineContent.appendChild(workspaceElement);
            openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
            mousedown(openQuickSettings);
            return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
          });
          it('sets the on right button active', function() {
            return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
          });
          describe('clicking on the code highlight item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.code-highlights');
              return mousedown(item);
            });
            it('toggles the code highlights on the minimap element', function() {
              return expect(minimapElement.displayCodeHighlights).toBeTruthy();
            });
            return it('requests an update', function() {
              return expect(minimapElement.frameRequested).toBeTruthy();
            });
          });
          describe('clicking on the absolute mode item', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('li.absolute-mode');
              return mousedown(item);
            });
            return it('toggles the absolute-mode setting', function() {
              expect(atom.config.get('minimap.absoluteMode')).toBeTruthy();
              return expect(minimapElement.absoluteMode).toBeTruthy();
            });
          });
          describe('clicking on the on left button', function() {
            beforeEach(function() {
              var item;
              item = quickSettingsElement.querySelector('.btn:first-child');
              return mousedown(item);
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-left', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-left');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeTruthy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:last-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:first-child')).toExist();
            });
          });
          describe('core:move-right when the minimap is on the right', function() {
            beforeEach(function() {
              atom.config.set('minimap.displayMinimapOnLeft', true);
              return atom.commands.dispatch(quickSettingsElement, 'core:move-right');
            });
            it('toggles the displayMinimapOnLeft setting', function() {
              return expect(atom.config.get('minimap.displayMinimapOnLeft')).toBeFalsy();
            });
            return it('changes the buttons activation state', function() {
              expect(quickSettingsElement.querySelector('.btn.selected:first-child')).not.toExist();
              return expect(quickSettingsElement.querySelector('.btn.selected:last-child')).toExist();
            });
          });
          describe('clicking on the open settings button again', function() {
            beforeEach(function() {
              return mousedown(openQuickSettings);
            });
            it('closes the quick settings view', function() {
              return expect(workspaceElement.querySelector('minimap-quick-settings')).not.toExist();
            });
            return it('removes the view from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
          return describe('when an external event destroys the view', function() {
            beforeEach(function() {
              return minimapElement.quickSettingsElement.destroy();
            });
            return it('removes the view reference from the element', function() {
              return expect(minimapElement.quickSettingsElement).toBeNull();
            });
          });
        });
        describe('then disabling it', function() {
          beforeEach(function() {
            return atom.config.set('minimap.displayPluginsControls', false);
          });
          return it('removes the div', function() {
            return expect(minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings')).not.toExist();
          });
        });
        return describe('with plugins registered in the package', function() {
          var minimapPackage, pluginA, pluginB, _ref4;
          _ref4 = [], minimapPackage = _ref4[0], pluginA = _ref4[1], pluginB = _ref4[2];
          beforeEach(function() {
            waitsForPromise(function() {
              return atom.packages.activatePackage('minimap').then(function(pkg) {
                return minimapPackage = pkg.mainModule;
              });
            });
            return runs(function() {
              var Plugin;
              Plugin = (function() {
                function Plugin() {}

                Plugin.prototype.active = false;

                Plugin.prototype.activatePlugin = function() {
                  return this.active = true;
                };

                Plugin.prototype.deactivatePlugin = function() {
                  return this.active = false;
                };

                Plugin.prototype.isActive = function() {
                  return this.active;
                };

                return Plugin;

              })();
              pluginA = new Plugin;
              pluginB = new Plugin;
              minimapPackage.registerPlugin('dummyA', pluginA);
              minimapPackage.registerPlugin('dummyB', pluginB);
              workspaceElement = atom.views.getView(atom.workspace);
              jasmineContent.appendChild(workspaceElement);
              openQuickSettings = minimapElement.shadowRoot.querySelector('.open-minimap-quick-settings');
              mousedown(openQuickSettings);
              return quickSettingsElement = workspaceElement.querySelector('minimap-quick-settings');
            });
          });
          it('creates one list item for each registered plugin', function() {
            return expect(quickSettingsElement.querySelectorAll('li').length).toEqual(5);
          });
          it('selects the first item of the list', function() {
            return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
          });
          describe('core:confirm', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
            });
            it('disable the plugin of the selected item', function() {
              return expect(pluginA.isActive()).toBeFalsy();
            });
            describe('triggered a second time', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('enable the plugin of the selected item', function() {
                return expect(pluginA.isActive()).toBeTruthy();
              });
            });
            describe('on the code highlight item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = minimapElement.displayCodeHighlights;
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(minimapElement.displayCodeHighlights).toEqual(!initial);
              });
            });
            return describe('on the absolute mode item', function() {
              var initial;
              initial = [][0];
              beforeEach(function() {
                initial = atom.config.get('minimap.absoluteMode');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                atom.commands.dispatch(quickSettingsElement, 'core:move-down');
                return atom.commands.dispatch(quickSettingsElement, 'core:confirm');
              });
              return it('toggles the code highlights on the minimap element', function() {
                return expect(atom.config.get('minimap.absoluteMode')).toEqual(!initial);
              });
            });
          });
          describe('core:move-down', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
            });
            it('selects the second item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.code-highlights.selected')).toExist();
              });
            });
            return describe('then core:move-up', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
          return describe('core:move-up', function() {
            beforeEach(function() {
              return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
            });
            it('selects the last item', function() {
              return expect(quickSettingsElement.querySelector('li.selected:last-child')).toExist();
            });
            describe('reaching a separator', function() {
              beforeEach(function() {
                atom.commands.dispatch(quickSettingsElement, 'core:move-up');
                return atom.commands.dispatch(quickSettingsElement, 'core:move-up');
              });
              return it('moves past the separator', function() {
                return expect(quickSettingsElement.querySelector('li.selected:nth-child(2)')).toExist();
              });
            });
            return describe('then core:move-down', function() {
              beforeEach(function() {
                return atom.commands.dispatch(quickSettingsElement, 'core:move-down');
              });
              return it('selects again the first item of the list', function() {
                return expect(quickSettingsElement.querySelector('li.selected:first-child')).toExist();
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrTUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBRkQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLE9BQXFFLE9BQUEsQ0FBUSxrQkFBUixDQUFyRSxFQUFDLGlCQUFBLFNBQUQsRUFBWSxpQkFBQSxTQUFaLEVBQXVCLGVBQUEsT0FBdkIsRUFBZ0Msa0JBQUEsVUFBaEMsRUFBNEMsa0JBQUEsVUFBNUMsRUFBd0QsaUJBQUEsU0FMeEQsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBQXdDLGNBQXhDLENBTmpCLENBQUE7O0FBQUEsRUFPQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQTJCLGNBQTNCLENBUGIsQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsU0FBQyxDQUFELEdBQUE7QUFDZCxRQUFBLFNBQUE7QUFBQSxJQUFBLFNBQUEsR0FBZ0IsSUFBQSxlQUFBLENBQWdCLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixDQUF4QixDQUEwQixDQUFDLFNBQTNDLENBQWhCLENBQUE7V0FDQSxDQUFDLENB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

//# sourceURL=/Users/lildude/.atom/packages/minimap/spec/minimap-element-spec.coffee
