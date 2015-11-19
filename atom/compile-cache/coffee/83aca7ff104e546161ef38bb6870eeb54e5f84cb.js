(function() {
  var MdWriter;

  MdWriter = require("../lib/main");

  describe("MarkdownWriter", function() {
    var activationPromise, getMarkdownWriter, workspaceElement;
    workspaceElement = null;
    activationPromise = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage("markdown-writer");
    });
    xdescribe("when the md-writer:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(getMarkdownWriter().length).toBe(0);
        atom.commands.dispatch(workspaceElement, "markdown-writer:new-draft");
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(getMarkdownWriter().length).toBe(1);
        });
      });
    });
    return getMarkdownWriter = function() {
      return workspaceElement.getElementsByClassName(".markdown-writer");
    };
  });

}).call(this);
