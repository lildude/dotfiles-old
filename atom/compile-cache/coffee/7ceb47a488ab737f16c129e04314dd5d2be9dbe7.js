(function() {
  var InsertLinkView;

  InsertLinkView = require("../lib/insert-link-view");

  describe("InsertLinkView", function() {
    var editor, insertLinkView, _ref;
    _ref = [], editor = _ref[0], insertLinkView = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        insertLinkView = new InsertLinkView({});
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".insertLink", function() {
      it("insert inline link", function() {
        var link;
        insertLinkView.editor = {
          setTextInBufferRange: function() {
            return {};
          }
        };
        spyOn(insertLinkView.editor, "setTextInBufferRange");
        link = {
          text: "text",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.editor.setTextInBufferRange).toHaveBeenCalledWith(void 0, "[text](http://)");
      });
      it("insert reference link", function() {
        var link;
        spyOn(insertLinkView, "insertReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.insertReferenceLink).toHaveBeenCalledWith(link);
      });
      return it("update reference link", function() {
        var link;
        insertLinkView.definitionRange = {};
        spyOn(insertLinkView, "updateReferenceLink");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.insertLink(link);
        return expect(insertLinkView.updateReferenceLink).toHaveBeenCalledWith(link);
      });
    });
    describe(".updateReferenceLink", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.referenceIndentLength", 2);
      });
      return it("insert reference and definition", function() {
        var link;
        insertLinkView.referenceId = "ABC123";
        insertLinkView.range = "Range";
        insertLinkView.definitionRange = "DRange";
        insertLinkView.editor = {
          setTextInBufferRange: function() {
            return {};
          }
        };
        spyOn(insertLinkView.editor, "setTextInBufferRange");
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.updateReferenceLink(link);
        expect(insertLinkView.editor.setTextInBufferRange.calls[0].args).toEqual(["Range", "[text][ABC123]"]);
        return expect(insertLinkView.editor.setTextInBufferRange.calls[1].args).toEqual(["DRange", '  [ABC123]: http:// "this is title"']);
      });
    });
    describe(".setLink", function() {
      return it("sets all the editors", function() {
        var link;
        link = {
          text: "text",
          title: "this is title",
          url: "http://"
        };
        insertLinkView.setLink(link);
        expect(insertLinkView.textEditor.getText()).toBe(link.text);
        expect(insertLinkView.titleEditor.getText()).toBe(link.title);
        return expect(insertLinkView.urlEditor.getText()).toBe(link.url);
      });
    });
    describe(".getSavedLink", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("return undefined if text does not exists", function() {
        return expect(insertLinkView.getSavedLink("notExists")).toEqual(void 0);
      });
      return it("return the link with text, title, url", function() {
        expect(insertLinkView.getSavedLink("oldStyle")).toEqual({
          "text": "oldStyle",
          "title": "this is title",
          "url": "http://"
        });
        return expect(insertLinkView.getSavedLink("newStyle")).toEqual({
          "text": "NewStyle",
          "title": "this is title",
          "url": "http://"
        });
      });
    });
    describe(".isInSavedLink", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("return false if the text does not exists", function() {
        return expect(insertLinkView.isInSavedLink({
          text: "notExists"
        })).toBe(false);
      });
      it("return false if the url does not match", function() {
        var link;
        link = {
          text: "oldStyle",
          title: "this is title",
          url: "anything"
        };
        return expect(insertLinkView.isInSavedLink(link)).toBe(false);
      });
      return it("return true", function() {
        var link;
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        return expect(insertLinkView.isInSavedLink(link)).toBe(true);
      });
    });
    describe(".updateToLinks", function() {
      beforeEach(function() {
        return insertLinkView.links = {
          "oldstyle": {
            "title": "this is title",
            "url": "http://"
          },
          "newstyle": {
            "text": "NewStyle",
            "title": "this is title",
            "url": "http://"
          }
        };
      });
      it("saves the new link if it does not exists before and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "New Link",
          title: "this is title",
          url: "http://new.link"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["new link"]).toEqual(link);
      });
      it("does not save the new link if checkbox is unchecked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", false);
        link = {
          text: "New Link",
          title: "this is title",
          url: "http://new.link"
        };
        return expect(insertLinkView.updateToLinks(link)).toBe(false);
      });
      it("saves the link if it is modified and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "NewStyle",
          title: "this is new title",
          url: "http://"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["newstyle"]).toEqual(link);
      });
      it("does not saves the link if it is not modified and checkbox checked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", true);
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        return expect(insertLinkView.updateToLinks(link)).toBe(false);
      });
      return it("removes the existed link if checkbox is unchecked", function() {
        var link;
        insertLinkView.saveCheckbox.prop("checked", false);
        link = {
          text: "NewStyle",
          title: "this is title",
          url: "http://"
        };
        expect(insertLinkView.updateToLinks(link)).toBe(true);
        return expect(insertLinkView.links["newstyle"]).toBe(void 0);
      });
    });
    return describe("integration", function() {
      beforeEach(function() {
        atom.config.set("markdown-writer.referenceIndentLength", 2);
        insertLinkView.fetchPosts = function() {
          return {};
        };
        return insertLinkView.loadSavedLinks = function(cb) {
          return cb();
        };
      });
      it("insert new link", function() {
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text](url)");
      });
      it("insert new link with text", function() {
        editor.setText("text");
        insertLinkView.display();
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text](url)");
      });
      it("insert new reference link", function() {
        insertLinkView.display();
        insertLinkView.textEditor.setText("text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text][" + insertLinkView.referenceId + "]\n\n  [" + insertLinkView.referenceId + "]: url \"title\"");
      });
      it("insert new reference link with text", function() {
        editor.setText("text");
        insertLinkView.display();
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[text][" + insertLinkView.referenceId + "]\n\n  [" + insertLinkView.referenceId + "]: url \"title\"");
      });
      it("update inline link", function() {
        editor.setText("[text](url)");
        editor.selectAll();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[new text](new url)");
      });
      it("update inline link to reference link", function() {
        editor.setText("[text](url)");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("title");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("[new text][" + insertLinkView.referenceId + "]\n\n  [" + insertLinkView.referenceId + "]: new url \"title\"");
      });
      it("update reference link to inline link", function() {
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.textEditor.setText("new text");
        insertLinkView.titleEditor.setText("");
        insertLinkView.urlEditor.setText("new url");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("[new text](new url)");
      });
      it("remove inline link", function() {
        editor.setText("[text](url)");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.urlEditor.setText("");
        insertLinkView.onConfirm();
        return expect(editor.getText()).toBe("text");
      });
      return it("remove reference link", function() {
        editor.setText("[text][ABC123]\n\n[ABC123]: url \"title\"");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        insertLinkView.display();
        expect(insertLinkView.textEditor.getText()).toEqual("text");
        expect(insertLinkView.titleEditor.getText()).toEqual("title");
        expect(insertLinkView.urlEditor.getText()).toEqual("url");
        insertLinkView.urlEditor.setText("");
        insertLinkView.onConfirm();
        return expect(editor.getText().trim()).toBe("text");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvaW5zZXJ0LWxpbmstdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEseUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSw0QkFBQTtBQUFBLElBQUEsT0FBMkIsRUFBM0IsRUFBQyxnQkFBRCxFQUFTLHdCQUFULENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQixFQUFIO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO2FBRUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsY0FBQSxHQUFxQixJQUFBLGNBQUEsQ0FBZSxFQUFmLENBQXJCLENBQUE7ZUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBRk47TUFBQSxDQUFMLEVBSFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBU0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixZQUFBLElBQUE7QUFBQSxRQUFBLGNBQWMsQ0FBQyxNQUFmLEdBQXdCO0FBQUEsVUFBRSxvQkFBQSxFQUFzQixTQUFBLEdBQUE7bUJBQUcsR0FBSDtVQUFBLENBQXhCO1NBQXhCLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxjQUFjLENBQUMsTUFBckIsRUFBNkIsc0JB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/insert-link-view-spec.coffee
