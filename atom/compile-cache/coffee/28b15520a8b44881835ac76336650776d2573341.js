(function() {
  var PublishDraft;

  PublishDraft = require("../../lib/commands/publish-draft");

  describe("PublishDraft", function() {
    var editor, publishDraft, _ref;
    _ref = [], editor = _ref[0], publishDraft = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".trigger", function() {
      return it("abort publish draft when not confirm publish", function() {
        publishDraft = new PublishDraft({});
        publishDraft.confirmPublish = function() {
          return {};
        };
        publishDraft.trigger();
        expect(publishDraft.draftPath).toMatch("fixtures/empty.markdown");
        return expect(publishDraft.postPath).toMatch(/\/\d{4}\/\d{4}-\d\d-\d\d-empty\.markdown/);
      });
    });
    describe(".getPostTile", function() {
      it("get title from front matter by config", function() {
        atom.config.set("markdown-writer.publishRenameBasedOnTitle", true);
        editor.setText("---\ntitle: Markdown Writer\n---");
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("markdown-writer");
      });
      it("get title from front matter if no draft path", function() {
        editor.setText("---\ntitle: Markdown Writer (New Post)\n---");
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("markdown-writer-new-post");
      });
      it("get title from draft path", function() {
        publishDraft = new PublishDraft({});
        publishDraft.draftPath = "test/name-of-post.md";
        return expect(publishDraft._getPostTitle()).toBe("name-of-post");
      });
      return it("get new-post when no front matter/draft path", function() {
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("new-post");
      });
    });
    return describe(".getPostExtension", function() {
      beforeEach(function() {
        return publishDraft = new PublishDraft({});
      });
      it("get draft path extname by config", function() {
        atom.config.set("markdown-writer.publishKeepFileExtname", true);
        publishDraft.draftPath = "test/name.md";
        return expect(publishDraft._getPostExtension()).toBe(".md");
      });
      return it("get default extname", function() {
        publishDraft.draftPath = "test/name.md";
        return expect(publishDraft._getPostExtension()).toBe(".markdown");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvcHVibGlzaC1kcmFmdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSwwQkFBQTtBQUFBLElBQUEsT0FBeUIsRUFBekIsRUFBQyxnQkFBRCxFQUFTLHNCQUFULENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQixFQUFIO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO2FBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsRUFBWjtNQUFBLENBQUwsRUFGUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFNQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7YUFDbkIsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxRQUFBLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsRUFBYixDQUFuQixDQUFBO0FBQUEsUUFDQSxZQUFZLENBQUMsY0FBYixHQUE4QixTQUFBLEdBQUE7aUJBQUcsR0FBSDtRQUFBLENBRDlCLENBQUE7QUFBQSxRQUdBLFlBQVksQ0FBQyxPQUFiLENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sWUFBWSxDQUFDLFNBQXBCLENBQThCLENBQUMsT0FB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/commands/publish-draft-spec.coffee
