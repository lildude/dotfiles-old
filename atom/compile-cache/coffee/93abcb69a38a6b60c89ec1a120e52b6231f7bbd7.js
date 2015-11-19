(function() {
  var ManagePostTagsView;

  ManagePostTagsView = require("../lib/manage-post-tags-view");

  describe("FrontMatterView", function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return this.view = new ManagePostTagsView({});
    });
    it("rank tags", function() {
      var fixture, tags;
      fixture = "ab ab cd ab ef gh ef";
      tags = ["ab", "cd", "ef", "ij"].map(function(t) {
        return {
          name: t
        };
      });
      this.view.rankTags(tags, fixture);
      return expect(tags).toEqual([
        {
          name: "ab",
          count: 3
        }, {
          name: "ef",
          count: 2
        }, {
          name: "cd",
          count: 1
        }, {
          name: "ij",
          count: 0
        }
      ]);
    });
    return it("rank tags with regex escaped", function() {
      var fixture, tags;
      fixture = "c++ c.c^abc $10.0 +abc";
      tags = ["c++", "\\", "^", "$", "+abc"].map(function(t) {
        return {
          name: t
        };
      });
      this.view.rankTags(tags, fixture);
      return expect(tags).toEqual([
        {
          name: "c++",
          count: 1
        }, {
          name: "^",
          count: 1
        }, {
          name: "$",
          count: 1
        }, {
          name: "+abc",
          count: 1
        }, {
          name: "\\",
          count: 0
        }
      ]);
    });
  });

}).call(this);
