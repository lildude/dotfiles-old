(function() {
  describe("sorting lines", function() {
    var activationPromise, editor, editorView, sortLineCaseInsensitive, sortLines, sortLinesReversed, uniqueLines, _ref;
    _ref = [], activationPromise = _ref[0], editor = _ref[1], editorView = _ref[2];
    sortLines = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    sortLinesReversed = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:reverse-sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    uniqueLines = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:unique");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    sortLineCaseInsensitive = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:case-insensitive-sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage('sort-lines');
      });
    });
    describe("when no lines are selected", function() {
      it("sorts all lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Helium\nHydrogen\nLithium");
        });
      });
      return it("sorts all lines, ignoring the trailing new line", function() {
        editor.setText("Hydrogen\nHelium\nLithium\n");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Helium\nHydrogen\nLithium\n");
        });
      });
    });
    describe("when entire lines are selected", function() {
      return it("sorts the selected lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium\nBeryllium\nBoron");
        editor.setSelectedBufferRange([[1, 0], [4, 0]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium\nHelium\nLithium\nBoron");
        });
      });
    });
    describe("when partial lines are selected", function() {
      return it("sorts the selected lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium\nBeryllium\nBoron");
        editor.setSelectedBufferRange([[1, 3], [3, 2]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium\nHelium\nLithium\nBoron");
        });
      });
    });
    describe("when there are multiple selection ranges", function() {
      return it("sorts the lines in each selection range", function() {
        editor.setText("Hydrogen\nHelium    # selection 1\nBeryllium # selection 1\nCarbon\nFluorine  # selection 2\nAluminum  # selection 2\nGallium\nEuropium");
        editor.addSelectionForBufferRange([[1, 0], [3, 0]]);
        editor.addSelectionForBufferRange([[4, 0], [6, 0]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium # selection 1\nHelium    # selection 1\nCarbon\nAluminum  # selection 2\nFluorine  # selection 2\nGallium\nEuropium");
        });
      });
    });
    describe("reversed sorting", function() {
      return it("sorts all lines in reverse order", function() {
        editor.setText("Hydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesReversed(function() {
          return expect(editor.getText()).toBe("Lithium\nHydrogen\nHelium");
        });
      });
    });
    describe("uniqueing", function() {
      return it("uniques all lines but does not change order", function() {
        editor.setText("Hydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return uniqueLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nHelium\nLithium");
        });
      });
    });
    return describe("case-insensitive sorting", function() {
      return it("sorts all lines, ignoring case", function() {
        editor.setText("Hydrogen\nlithium\nhelium\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLineCaseInsensitive(function() {
          return expect(editor.getText()).toBe("helium\nHelium\nHydrogen\nlithium\nLithium");
        });
      });
    });
  });

}).call(this);
