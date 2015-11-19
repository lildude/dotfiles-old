(function() {
  var FrontMatter;

  FrontMatter = require("../lib/front-matter");

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvZnJvbnQtbWF0dGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQix1QkFBcEIsRUFBSDtNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBREE7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BS0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxZQUFBLFdBQUE7QUFBQSxRQUFBLFdBQUEsR0FBa0IsSUFBQSxXQUFBLENBQVksTUFBWixDQUFsQixDQUFBO2VBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxPQUFuQixDQUEyQixDQUFDLElBQTVCLENBQWlDLElBQWpDLEVBRmtDO01BQUEsQ0FBcEMsQ0FMQSxDQUFBO0FBQUEsTUFTQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQSxHQUFBO0FBQzdDLFlBQUEsV0FBQTtBQUFBLFFBQUEsTUFBTSxDQUFDLE9B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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/front-matter-spec.coffee
