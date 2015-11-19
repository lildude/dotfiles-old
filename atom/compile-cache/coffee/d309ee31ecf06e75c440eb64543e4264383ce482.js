(function() {
  var Minimap, TextEditor, fs;

  fs = require('fs-plus');

  TextEditor = require('atom').TextEditor;

  Minimap = require('../lib/minimap');

  describe('Minimap', function() {
    var editor, largeSample, minimap, smallSample, _ref;
    _ref = [], editor = _ref[0], minimap = _ref[1], largeSample = _ref[2], smallSample = _ref[3];
    beforeEach(function() {
      var dir;
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      editor = new TextEditor({});
      editor.setLineHeightInPixels(10);
      editor.setHeight(50);
      editor.setWidth(200);
      dir = atom.project.getDirectories()[0];
      minimap = new Minimap({
        textEditor: editor
      });
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      return smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
    });
    it('has an associated editor', function() {
      return expect(minimap.getTextEditor()).toEqual(editor);
    });
    it('returns false when asked if destroyed', function() {
      return expect(minimap.isDestroyed()).toBeFalsy();
    });
    it('raise an exception if created without a text editor', function() {
      return expect(function() {
        return new Minimap;
      }).toThrow();
    });
    it('measures the minimap size based on the current editor content', function() {
      editor.setText(smallSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      editor.setText(largeSample);
      return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
    });
    it('measures the scaling factor between the editor and the minimap', function() {
      expect(minimap.getVerticalScaleFactor()).toEqual(0.5);
      return expect(minimap.getHorizontalScaleFactor()).toEqual(2 / editor.getDefaultCharWidth());
    });
    it('measures the editor visible area size at minimap scale', function() {
      editor.setText(largeSample);
      return expect(minimap.getTextEditorScaledHeight()).toEqual(25);
    });
    it('measures the available minimap scroll', function() {
      var largeLineCount;
      editor.setText(largeSample);
      largeLineCount = editor.getScreenLineCount();
      expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 50);
      return expect(minimap.canScroll()).toBeTruthy();
    });
    it('computes the first visible row in the minimap', function() {
      return expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
    });
    it('computes the last visible row in the minimap', function() {
      return expect(minimap.getLastVisibleScreenRow()).toEqual(10);
    });
    it('relays change events from the text editor', function() {
      var changeSpy;
      changeSpy = jasmine.createSpy('didChange');
      minimap.onDidChange(changeSpy);
      editor.setText('foo');
      return expect(changeSpy).toHaveBeenCalled();
    });
    it('relays scroll top events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editor.setScrollTop(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    it('relays scroll left events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollLeft(scrollSpy);
      spyOn(editor.displayBuffer, 'getScrollWidth').andReturn(10000);
      editor.setScrollLeft(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    describe('when scrols past end is enabled', function() {
      beforeEach(function() {
        editor.setText(largeSample);
        return atom.config.set('editor.scrollPastEnd', true);
      });
      it('adjust the scrolling ratio', function() {
        var maxScrollTop;
        editor.setScrollTop(editor.displayBuffer.getMaxScrollTop());
        maxScrollTop = editor.displayBuffer.getMaxScrollTop() - (editor.getHeight() - 3 * editor.displayBuffer.getLineHeightInPixels());
        return expect(minimap.getTextEditorScrollRatio()).toEqual(editor.getScrollTop() / maxScrollTop);
      });
      it('lock the minimap scroll top to 1', function() {
        editor.setScrollTop(editor.displayBuffer.getMaxScrollTop());
        return expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
      });
      return describe('when getScrollTop() and maxScrollTop both equal 0', function() {
        beforeEach(function() {
          editor.setText(smallSample);
          editor.setHeight(40);
          return atom.config.set('editor.scrollPastEnd', true);
        });
        return it('getTextEditorScrollRatio() should return 0', function() {
          var maxScrollTop;
          editor.setScrollTop(0);
          maxScrollTop = editor.displayBuffer.getMaxScrollTop() - (editor.getHeight() - 3 * editor.displayBuffer.getLineHeightInPixels());
          expect(maxScrollTop).toEqual(0);
          return expect(minimap.getTextEditorScrollRatio()).toEqual(0);
        });
      });
    });
    describe('when soft wrap is enabled', function() {
      beforeEach(function() {
        atom.config.set('editor.softWrap', true);
        atom.config.set('editor.softWrapAtPreferredLineLength', true);
        return atom.config.set('editor.preferredLineLength', 2);
      });
      return it('measures the minimap using screen lines', function() {
        editor.setText(smallSample);
        expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
        editor.setText(largeSample);
        return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      });
    });
    describe('when there is no scrolling needed to display the whole minimap', function() {
      it('returns 0 when computing the minimap scroll', function() {
        return expect(minimap.getScrollTop()).toEqual(0);
      });
      return it('returns 0 when measuring the available minimap scroll', function() {
        editor.setText(smallSample);
        expect(minimap.getMaxScrollTop()).toEqual(0);
        return expect(minimap.canScroll()).toBeFalsy();
      });
    });
    describe('when the editor is scrolled', function() {
      var editorHeight, editorScrollRatio, largeLineCount, _ref1;
      _ref1 = [], largeLineCount = _ref1[0], editorHeight = _ref1[1], editorScrollRatio = _ref1[2];
      beforeEach(function() {
        spyOn(editor.displayBuffer, 'getScrollWidth').andReturn(10000);
        editor.setText(largeSample);
        editor.setScrollTop(1000);
        editor.setScrollLeft(200);
        largeLineCount = editor.getScreenLineCount();
        editorHeight = largeLineCount * editor.getLineHeightInPixels();
        return editorScrollRatio = editor.getScrollTop() / editor.displayBuffer.getMaxScrollTop();
      });
      it('scales the editor scroll based on the minimap scale factor', function() {
        expect(minimap.getTextEditorScaledScrollTop()).toEqual(500);
        return expect(minimap.getTextEditorScaledScrollLeft()).toEqual(200 * minimap.getHorizontalScaleFactor());
      });
      it('computes the offset to apply based on the editor scroll top', function() {
        return expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());
      });
      it('computes the first visible row in the minimap', function() {
        return expect(minimap.getFirstVisibleScreenRow()).toEqual(Math.floor(99));
      });
      it('computes the last visible row in the minimap', function() {
        return expect(minimap.getLastVisibleScreenRow()).toEqual(110);
      });
      return describe('down to the bottom', function() {
        beforeEach(function() {
          editor.setScrollTop(editor.displayBuffer.getMaxScrollTop());
          return editorScrollRatio = editor.getScrollTop() / editor.displayBuffer.getMaxScrollTop();
        });
        it('computes an offset that scrolls the minimap to the bottom edge', function() {
          return expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
        });
        it('computes the first visible row in the minimap', function() {
          return expect(minimap.getFirstVisibleScreenRow()).toEqual(largeLineCount - 10);
        });
        return it('computes the last visible row in the minimap', function() {
          return expect(minimap.getLastVisibleScreenRow()).toEqual(largeLineCount);
        });
      });
    });
    describe('destroying the model', function() {
      it('emits a did-destroy event', function() {
        var spy;
        spy = jasmine.createSpy('destroy');
        minimap.onDidDestroy(spy);
        minimap.destroy();
        return expect(spy).toHaveBeenCalled();
      });
      return it('returns true when asked if destroyed', function() {
        minimap.destroy();
        return expect(minimap.isDestroyed()).toBeTruthy();
      });
    });
    describe('destroying the text editor', function() {
      return it('destroys the model', function() {
        spyOn(minimap, 'destroy');
        editor.destroy();
        return expect(minimap.destroy).toHaveBeenCalled();
      });
    });
    describe('::decorateMarker', function() {
      var changeSpy, decoration, marker, _ref1;
      _ref1 = [], marker = _ref1[0], decoration = _ref1[1], changeSpy = _ref1[2];
      beforeEach(function() {
        editor.setText(largeSample);
        changeSpy = jasmine.createSpy('didChange');
        minimap.onDidChange(changeSpy);
        marker = minimap.markBufferRange([[0, 6], [1, 11]]);
        return decoration = minimap.decorateMarker(marker, {
          type: 'highlight',
          "class": 'dummy'
        });
      });
      it('creates a decoration for the given marker', function() {
        return expect(minimap.decorationsByMarkerId[marker.id]).toBeDefined();
      });
      it('creates a change corresponding to the marker range', function() {
        expect(changeSpy).toHaveBeenCalled();
        expect(changeSpy.calls[0].args[0].start).toEqual(0);
        return expect(changeSpy.calls[0].args[0].end).toEqual(1);
      });
      describe('when the marker range changes', function() {
        beforeEach(function() {
          var markerChangeSpy;
          markerChangeSpy = jasmine.createSpy('marker-did-change');
          marker.onDidChange(markerChangeSpy);
          marker.setBufferRange([[0, 6], [3, 11]]);
          return waitsFor(function() {
            return markerChangeSpy.calls.length > 0;
          });
        });
        return it('creates a change only for the dif between the two ranges', function() {
          expect(changeSpy).toHaveBeenCalled();
          expect(changeSpy.calls[1].args[0].start).toEqual(1);
          return expect(changeSpy.calls[1].args[0].end).toEqual(3);
        });
      });
      describe('destroying the marker', function() {
        beforeEach(function() {
          return marker.destroy();
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      describe('destroying the decoration', function() {
        beforeEach(function() {
          return decoration.destroy();
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      describe('destroying all the decorations for the marker', function() {
        beforeEach(function() {
          return minimap.removeAllDecorationsForMarker(marker);
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      return describe('destroying the minimap', function() {
        beforeEach(function() {
          return minimap.destroy();
        });
        it('removes all the previously added decorations', function() {
          expect(minimap.decorationsById).toEqual({});
          return expect(minimap.decorationsByMarkerId).toEqual({});
        });
        return it('prevents the creation of new decorations', function() {
          marker = editor.markBufferRange([[0, 6], [0, 11]]);
          decoration = minimap.decorateMarker(marker, {
            type: 'highlight',
            "class": 'dummy'
          });
          return expect(decoration).toBeUndefined();
        });
      });
    });
    return describe('::decorationsByTypeThenRows', function() {
      var decorations;
      decorations = [][0];
      beforeEach(function() {
        var createDecoration;
        editor.setText(largeSample);
        createDecoration = function(type, range) {
          var decoration, marker;
          marker = minimap.markBufferRange(range);
          return decoration = minimap.decorateMarker(marker, {
            type: type
          });
        };
        createDecoration('highlight', [[6, 0], [11, 0]]);
        createDecoration('highlight', [[7, 0], [8, 0]]);
        createDecoration('highlight-over', [[1, 0], [2, 0]]);
        createDecoration('line', [[3, 0], [4, 0]]);
        createDecoration('line', [[12, 0], [12, 0]]);
        createDecoration('highlight-under', [[0, 0], [10, 1]]);
        return decorations = minimap.decorationsByTypeThenRows(0, 12);
      });
      it('returns an object whose keys are the decorations types', function() {
        return expect(Object.keys(decorations).sort()).toEqual(['highlight-over', 'highlight-under', 'line']);
      });
      it('stores decorations by rows within each type objects', function() {
        expect(Object.keys(decorations['highlight-over']).sort()).toEqual('1 2 6 7 8 9 10 11'.split(' ').sort());
        expect(Object.keys(decorations['line']).sort()).toEqual('3 4 12'.split(' ').sort());
        return expect(Object.keys(decorations['highlight-under']).sort()).toEqual('0 1 2 3 4 5 6 7 8 9 10'.split(' ').sort());
      });
      return it('stores the decorations spanning a row in the corresponding row array', function() {
        expect(decorations['highlight-over']['7'].length).toEqual(2);
        expect(decorations['line']['3'].length).toEqual(1);
        return expect(decorations['highlight-under']['5'].length).toEqual(1);
      });
    });
  });

}).call(this);
