(function() {
  var WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  describe("pretty json", function() {
    var editor, editorView, minify, prettify, sortedPrettify, _ref;
    _ref = [], editor = _ref[0], editorView = _ref[1];
    prettify = function(callback) {
      editorView.trigger("pretty-json:prettify");
      return runs(callback);
    };
    minify = function(callback) {
      editorView.trigger("pretty-json:minify");
      return runs(callback);
    };
    sortedPrettify = function(callback) {
      editorView.trigger("pretty-json:sort-and-prettify");
      return runs(callback);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('pretty-json');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-json');
      });
      atom.workspaceView = new WorkspaceView;
      atom.workspaceView.openSync();
      editorView = atom.workspaceView.getActiveView();
      return editor = editorView.getEditor();
    });
    describe("when no text is selected", function() {
      return it("doesn't change anything", function() {
        editor.setText("Start\n{ \"a\": \"b\", \"c\": \"d\" }\nEnd");
        return prettify(function() {
          return expect(editor.getText()).toBe("Start\n{ \"a\": \"b\", \"c\": \"d\" }\nEnd");
        });
      });
    });
    describe("when a valid json text is selected", function() {
      return it("formats it correctly", function() {
        editor.setText("Start\n{ \"a\": \"b\", \"c\": \"d\" }\nEnd");
        editor.setSelectedBufferRange([[1, 0], [1, 22]]);
        return prettify(function() {
          return expect(editor.getText()).toBe("Start\n{\n  \"a\": \"b\",\n  \"c\": \"d\"\n}\nEnd");
        });
      });
    });
    describe("when an invalid json text is selected", function() {
      return it("doesn't change anything", function() {
        editor.setText("Start\n{]\nEnd");
        editor.setSelectedBufferRange([[1, 0], [1, 2]]);
        return prettify(function() {
          return expect(editor.getText()).toBe("Start\n{]\nEnd");
        });
      });
    });
    describe("JSON file", function() {
      beforeEach(function() {
        return editor.setGrammar(atom.syntax.selectGrammar('test.json'));
      });
      describe("with invalid JSON", function() {
        return it("doesn't change anything", function() {
          editor.setText("{]");
          return prettify(function() {
            return expect(editor.getText()).toBe("{]");
          });
        });
      });
      describe("with valid JSON", function() {
        return it("formats the whole file correctly", function() {
          editor.setText("{ \"a\": \"b\", \"c\": \"d\" }");
          return prettify(function() {
            return expect(editor.getText()).toBe("{\n  \"a\": \"b\",\n  \"c\": \"d\"\n}");
          });
        });
      });
      return describe("Sort and prettify", function() {
        beforeEach(function() {
          return editor.setGrammar(atom.syntax.selectGrammar('test.json'));
        });
        describe("with invalid JSON", function() {
          return it("doesn't change anything", function() {
            editor.setText("{]");
            return sortedPrettify(function() {
              return expect(editor.getText()).toBe("{]");
            });
          });
        });
        return describe("with valid JSON", function() {
          return it("formats the whole file correctly", function() {
            editor.setText("{ \"c\": \"d\", \"a\": \"b\" }");
            return sortedPrettify(function() {
              return expect(editor.getText()).toBe("{\n  \"a\": \"b\",\n  \"c\": \"d\"\n}");
            });
          });
        });
      });
    });
    describe("Minify JSON file", function() {
      beforeEach(function() {
        return editor.setGrammar(atom.syntax.selectGrammar('test.json'));
      });
      it("Returns same string from invalid JSON", function() {
        editor.setText("{\n  [\n}");
        return minify(function() {
          return expect(editor.getText()).toBe("{\n  [\n}");
        });
      });
      return it("Minifies valid JSON", function() {
        editor.setText("{\n  \"a\": \"b\",\n  \"c\": \"d\",\n  \"num\": 123\n}");
        return minify(function() {
          return expect(editor.getText()).toBe("{\"a\":\"b\",\"c\":\"d\",\"num\":123}");
        });
      });
    });
    return describe("Minify selected JSON", function() {
      return it("Minifies JSON data", function() {
        editor.setText("Start\n{\n  \"a\": \"b\",\n  \"c\": \"d\",\n  \"num\": 123\n}\nEnd");
        editor.setSelectedBufferRange([[1, 0], [5, 1]]);
        return minify(function() {
          return expect(editor.getText()).toBe("Start\n{\"a\":\"b\",\"c\":\"d\",\"num\":123}\nEnd");
        });
      });
    });
  });

}).call(this);
