(function() {
  var NewPostView;

  NewPostView = require("../lib/new-post-view");

  describe("NewPostView", function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return this.view = new NewPostView({});
    });
    it("get filename in hexo format", function() {
      atom.config.set("markdown-writer.newPostFileName", "{title}{extension}");
      atom.config.set("markdown-writer.fileExtension", ".markdown");
      this.view.titleEditor.setText("Hexo format");
      this.view.dateEditor.setText("2014-11-19");
      return expect(this.view.getFileName()).toEqual("hexo-format.markdown");
    });
    it("generate front matter", function() {
      var frontMatter;
      frontMatter = {
        layout: "test",
        title: "the actual title",
        date: "2014-11-19"
      };
      return expect(this.view.generateFrontMatter(frontMatter)).toEqual("---\nlayout: test\ntitle: \"the actual title\"\ndate: \"2014-11-19\"\n---");
    });
    return it("generate front matter from setting", function() {
      var frontMatter;
      frontMatter = {
        layout: "test",
        title: "the actual title",
        date: "2014-11-19"
      };
      atom.config.set("markdown-writer.frontMatter", "title: <title>");
      return expect(this.view.generateFrontMatter(frontMatter)).toEqual("title: the actual title");
    });
  });

}).call(this);
