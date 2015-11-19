(function() {
  var NewDraftView, NewFileView, NewPostView;

  NewFileView = require("../lib/new-file-view");

  NewDraftView = require("../lib/new-draft-view");

  NewPostView = require("../lib/new-post-view");

  describe("NewFileView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    describe("NewFileView", function() {
      var editor, newFileView, _ref;
      _ref = [], editor = _ref[0], newFileView = _ref[1];
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
      var editor, newDraftView, _ref;
      _ref = [], editor = _ref[0], newDraftView = _ref[1];
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
      var editor, newPostView, _ref;
      _ref = [], editor = _ref[0], newPostView = _ref[1];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvbmV3LWZpbGUtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsc0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSx1QkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHNCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEIsRUFBSDtNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEseUJBQUE7QUFBQSxNQUFBLE9BQXdCLEVBQXhCLEVBQUMsZ0JBQUQsRUFBUyxxQkFBVCxDQUFBO0FBQUEsTUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxFQUFaLEVBRFQ7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BS0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO2VBQ3ZCLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLEVBQW1ELHlCQUFuRCxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxN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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/new-file-view-spec.coffee
