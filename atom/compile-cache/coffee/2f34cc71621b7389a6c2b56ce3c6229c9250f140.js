(function() {
  var toggleQuotes;

  toggleQuotes = require('../lib/toggle-quotes').toggleQuotes;

  describe("ToggleQuotes", function() {
    beforeEach(function() {
      return atom.config.set('toggle-quotes.quoteCharacters', '\'"');
    });
    describe("toggleQuotes(editor) js", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-javascript');
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-json');
        });
        waitsForPromise(function() {
          return atom.workspace.open();
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("console.log(\"Hello World\");\nconsole.log('Hello World');\nconsole.log(\"Hello 'World'\");\nconsole.log('Hello \"World\"');\nconsole.log('');");
          return editor.setGrammar(atom.grammars.selectGrammar('test.js'));
        });
      });
      describe("when the cursor is not inside a quoted string", function() {
        return it("does nothing", function() {
          return expect(function() {
            return toggleQuotes(editor);
          }).not.toThrow();
        });
      });
      describe("when the cursor is inside an empty single quoted string", function() {
        return it("switches the quotes to double", function() {
          editor.setCursorBufferPosition([4, 13]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(4)).toBe('console.log("");');
          return expect(editor.getCursorBufferPosition()).toEqual([4, 13]);
        });
      });
      describe("when the cursor is inside a double quoted string", function() {
        describe("when using default config", function() {
          return it("switches the double quotes to single quotes", function() {
            editor.setCursorBufferPosition([0, 16]);
            toggleQuotes(editor);
            expect(editor.lineTextForBufferRow(0)).toBe("console.log('Hello World');");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 16]);
          });
        });
        return describe("when using custom config of backticks", function() {
          return it("switches the double quotes to backticks", function() {
            atom.config.set('toggle-quotes.quoteCharacters', '\'"`');
            editor.setCursorBufferPosition([0, 16]);
            toggleQuotes(editor);
            expect(editor.lineTextForBufferRow(0)).toBe("console.log(`Hello World`);");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 16]);
          });
        });
      });
      describe("when the cursor is inside a single quoted string", function() {
        return it("switches the quotes to double", function() {
          editor.setCursorBufferPosition([1, 16]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(1)).toBe('console.log("Hello World");');
          return expect(editor.getCursorBufferPosition()).toEqual([1, 16]);
        });
      });
      describe("when the cursor is inside a single-quoted string that is nested within a double quoted string", function() {
        return it("switches the outer quotes to single and escapes the inner quotes", function() {
          editor.setCursorBufferPosition([2, 22]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(2)).toBe("console.log('Hello \\'World\\'');");
          expect(editor.getCursorBufferPosition()).toEqual([2, 22]);
          toggleQuotes(editor);
          return expect(editor.lineTextForBufferRow(2)).toBe('console.log("Hello \'World\'");');
        });
      });
      describe("when the cursor is inside a double-quoted string that is nested within a single quoted string", function() {
        return it("switches the outer quotes to double and escapes the inner quotes", function() {
          editor.setCursorBufferPosition([3, 22]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(3)).toBe('console.log("Hello \\"World\\"");');
          expect(editor.getCursorBufferPosition()).toEqual([3, 22]);
          toggleQuotes(editor);
          return expect(editor.lineTextForBufferRow(3)).toBe("console.log('Hello \"World\"');");
        });
      });
      describe("when the cursor is inside multiple quoted strings", function() {
        return it("switches the quotes of both quoted strings separately and leaves the cursors where they were, and does so atomically", function() {
          editor.setCursorBufferPosition([0, 16]);
          editor.addCursorAtBufferPosition([1, 16]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(0)).toBe("console.log('Hello World');");
          expect(editor.lineTextForBufferRow(1)).toBe('console.log("Hello World");');
          expect(editor.getCursors()[0].getBufferPosition()).toEqual([0, 16]);
          expect(editor.getCursors()[1].getBufferPosition()).toEqual([1, 16]);
          editor.undo();
          expect(editor.lineTextForBufferRow(0)).toBe('console.log("Hello World");');
          expect(editor.lineTextForBufferRow(1)).toBe("console.log('Hello World');");
          expect(editor.getCursors()[0].getBufferPosition()).toEqual([0, 16]);
          return expect(editor.getCursors()[1].getBufferPosition()).toEqual([1, 16]);
        });
      });
      return describe("when the cursor is on an invalid region", function() {
        describe("when it is quoted", function() {
          return it("toggles the quotes", function() {
            editor.setGrammar(atom.grammars.selectGrammar('test.json'));
            editor.setText("{'invalid': true}");
            editor.setCursorBufferPosition([0, 4]);
            toggleQuotes(editor);
            return expect(editor.getText()).toBe('{"invalid": true}');
          });
        });
        return describe("when it is not quoted", function() {
          return it("does not toggle the quotes", function() {
            editor.setGrammar(atom.grammars.selectGrammar('test.json'));
            editor.setText("{invalid: true}");
            editor.setCursorBufferPosition([0, 4]);
            toggleQuotes(editor);
            return expect(editor.getText()).toBe('{invalid: true}');
          });
        });
      });
    });
    describe("toggleQuotes(editor) python", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-python');
        });
        waitsForPromise(function() {
          return atom.workspace.open();
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("print(u\"Hello World\")\nprint(r'')");
          return editor.setGrammar(atom.grammars.selectGrammar('test.py'));
        });
      });
      describe("when cursor is inside a double quoted unicode string", function() {
        return it("switches quotes to single excluding unicode character", function() {
          editor.setCursorBufferPosition([0, 16]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(0)).toBe("print(u'Hello World')");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 16]);
        });
      });
      return describe("when cursor is inside an empty single quoted raw string", function() {
        return it("switches quotes to double", function() {
          editor.setCursorBufferPosition([1, 8]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(1)).toBe('print(r"")');
          return expect(editor.getCursorBufferPosition()).toEqual([1, 8]);
        });
      });
    });
    return it("activates when a command is triggered", function() {
      var activatePromise;
      activatePromise = atom.packages.activatePackage('toggle-quotes');
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      runs(function() {
        var editor;
        editor = atom.workspace.getActiveTextEditor();
        return atom.commands.dispatch(atom.views.getView(editor), 'toggle-quotes:toggle');
      });
      return waitsForPromise(function() {
        return activatePromise;
      });
    });
  });

}).call(this);
