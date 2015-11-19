(function() {
  var InsertLinkView;

  InsertLinkView = require("../lib/insert-link-view");

  describe("InsertLinkView", function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return this.view = new InsertLinkView({});
    });
    xit("update search by query", function() {
      return this.view.updateSearch("not-exists");
    });
    xit("get saved link path", function() {
      return expect(this.view.getSavedLinksPath()).toMatch(atom.getConfigDirPath());
    });
    return xit("get configured saved link path", function() {
      var path;
      path = "path/to/link.cson";
      atom.config.set("markdown-writer.siteLinkPath", path);
      return expect(this.view.getSavedLinksPath()).toEqual(path);
    });
  });

}).call(this);
