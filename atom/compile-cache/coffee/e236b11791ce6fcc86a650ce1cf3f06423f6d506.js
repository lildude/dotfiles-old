(function() {
  var FrontMatter;

  FrontMatter = require("../../lib/helpers/front-matter");

  describe("FrontMatter", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("editor without front matter", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
      it("is empty when editor is empty", function() {
        var frontMatter;
        frontMatter = new FrontMatter(editor);
        return expect(frontMatter.isEmpty).toBe(true);
      });
      it("is empty when editor has no front matter", function() {
        var frontMatter;
        editor.setText("some random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        return expect(frontMatter.isEmpty).toBe(true);
      });
      return it("is empty when editor has invalid front matter", function() {
        var frontMatter;
        editor.setText("---\n---\n\nsome random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        return expect(frontMatter.isEmpty).toBe(true);
      });
    });
    describe("editor with jekyll front matter", function() {
      var editor, frontMatter, _ref;
      _ref = [], editor = _ref[0], frontMatter = _ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has fields", function() {
        expect(frontMatter.has("title")).toBe(true);
        expect(frontMatter.has("date")).toBe(true);
        expect(frontMatter.has("categories")).toBe(true);
        return expect(frontMatter.has("tags")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Jekyll)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      it("set field value", function() {
        frontMatter.set("title", "Markdown Writer");
        return expect(frontMatter.get("title")).toBe("Markdown Writer");
      });
      it("normalize field to an array", function() {
        expect(frontMatter.normalizeField("field")).toEqual([]);
        expect(frontMatter.normalizeField("categories")).toEqual(["Markdown"]);
        return expect(frontMatter.normalizeField("tags")).toEqual(["Writer", "Jekyll"]);
      });
      it("get content text with leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n");
      });
      return it("save the content to editor", function() {
        frontMatter.save();
        return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
      });
    });
    return describe("editor with hexo front matter", function() {
      var editor, frontMatter, _ref;
      _ref = [], editor = _ref[0], frontMatter = _ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("title: Markdown Writer (Hexo)\ndate: 2015-08-12 23:19\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has field title/date", function() {
        expect(frontMatter.has("title")).toBe(true);
        return expect(frontMatter.has("date")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Hexo)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      return it("get content text without leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("title: Markdown Writer (Hexo)\ndate: '2015-08-12 23:19'\n---\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvaGVscGVycy9mcm9udC1tYXR0ZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0NBQVIsQ0FBZCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLHVCQUFwQixFQUFIO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsRUFEQTtNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFLQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFlBQUEsV0FBQTtBQUFBLFFBQUEsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxNQUFaLENBQWxCLENBQUE7ZUFDQSxNQUFBLENBQU8sV0FBVyxDQUFDLE9BQW5CLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsSUFBakMsRUFGa0M7TUFBQSxDQUFwQyxDQUxBLENBQUE7QUFBQSxNQVNBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsWUFBQSxXQUFBO0FBQUEsUUFBQSxNQUFN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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/helpers/front-matter-spec.coffee
