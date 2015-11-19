(function() {
  var NewDraftView, NewFileView, NewPostView;

  NewFileView = require("../../lib/views/new-file-view");

  NewDraftView = require("../../lib/views/new-draft-view");

  NewPostView = require("../../lib/views/new-post-view");

  describe("NewFileView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    describe("NewFileView", function() {
      var newFileView;
      newFileView = null;
      beforeEach(function() {
        return newFileView = new NewFileView({});
      });
      describe('.getFileName', function() {
        return it("get filename in hexo format", function() {
          atom.config.set("markdown-writer.newFileFileName", "file-{title}{extension}");
          atom.config.set("markdown-writer.fileExtension", ".md");
          newFileView.titleEditor.setText("Hexo format");
          newFileView.dateEditor.setText("2014-11-19");
          return expect(newFileView.getFileName()).toBe("file-hexo-format.md");
        });
      });
      return describe('.generateFrontMatter', function() {
        it("generate correctly", function() {
          var frontMatter;
          frontMatter = {
            layout: "test",
            title: "the actual title",
            date: "2014-11-19"
          };
          return expect(newFileView.generateFrontMatter(frontMatter)).toBe("---\nlayout: test\ntitle: \"the actual title\"\ndate: \"2014-11-19\"\n---");
        });
        return it("generate based on setting", function() {
          var frontMatter;
          frontMatter = {
            layout: "test",
            title: "the actual title",
            date: "2014-11-19"
          };
          atom.config.set("markdown-writer.frontMatter", "title: <title>");
          return expect(newFileView.generateFrontMatter(frontMatter)).toBe("title: the actual title");
        });
      });
    });
    describe("NewDraftView", function() {
      var newDraftView;
      newDraftView = null;
      beforeEach(function() {
        return newDraftView = new NewDraftView({});
      });
      describe("class methods", function() {
        return it("override correctly", function() {
          expect(NewDraftView.fileType).toBe("Draft");
          expect(NewDraftView.pathConfig).toBe("siteDraftsDir");
          return expect(NewDraftView.fileNameConfig).toBe("newDraftFileName");
        });
      });
      describe(".display", function() {
        return it('display correct message', function() {
          newDraftView.display();
          newDraftView.dateEditor.setText("2015-08-23");
          newDraftView.titleEditor.setText("Draft Title");
          return expect(newDraftView.message.text()).toBe("Site Directory: /config/your/local/directory/in/settings/\nCreate Draft At: _drafts/draft-title.markdown");
        });
      });
      return describe(".getFrontMatter", function() {
        return it("get the correct front matter", function() {
          var frontMatter;
          newDraftView.dateEditor.setText("2015-08-23");
          newDraftView.titleEditor.setText("Draft Title");
          frontMatter = newDraftView.getFrontMatter();
          expect(frontMatter.layout).toBe("post");
          expect(frontMatter.published).toBe(false);
          expect(frontMatter.title).toBe("Draft Title");
          return expect(frontMatter.slug).toBe("draft-title");
        });
      });
    });
    return describe("NewPostView", function() {
      var newPostView;
      newPostView = null;
      beforeEach(function() {
        return newPostView = new NewPostView({});
      });
      describe("class methods", function() {
        return it("override correctly", function() {
          expect(NewPostView.fileType).toBe("Post");
          expect(NewPostView.pathConfig).toBe("sitePostsDir");
          return expect(NewPostView.fileNameConfig).toBe("newPostFileName");
        });
      });
      describe(".display", function() {
        return it('display correct message', function() {
          newPostView.display();
          newPostView.dateEditor.setText("2015-08-23");
          newPostView.titleEditor.setText("Post's Title");
          return expect(newPostView.message.text()).toBe("Site Directory: /config/your/local/directory/in/settings/\nCreate Post At: _posts/2015/2015-08-23-posts-title.markdown");
        });
      });
      return describe(".getFrontMatter", function() {
        return it("get the correct front matter", function() {
          var frontMatter;
          newPostView.dateEditor.setText("2015-08-24");
          newPostView.titleEditor.setText("Post's Title: Subtitle");
          frontMatter = newPostView.getFrontMatter();
          expect(frontMatter.layout).toBe("post");
          expect(frontMatter.published).toBe(true);
          expect(frontMatter.title).toBe("Post's Title: Subtitle");
          return expect(frontMatter.slug).toBe("posts-title-subtitle");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdmlld3MvbmV3LWZpbGUtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsK0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQ0FBUixDQURmLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLCtCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEIsRUFBSDtNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsV0FBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLElBQWQsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULFdBQUEsR0FBa0IsSUFBQSxXQUFBLENBQVksRUFBWixFQURUO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQUtBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtlQUN2QixFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixFQUFtRCx5QkFBbkQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVos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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/views/new-file-view-spec.coffee
