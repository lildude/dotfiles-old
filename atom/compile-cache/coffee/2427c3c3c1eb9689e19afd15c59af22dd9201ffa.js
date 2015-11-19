(function() {
  var LineStyleView;

  LineStyleView = require("../lib/style-line");

  describe("StyleLine", function() {
    it("check heading 1 exists", function() {
      var fixture, view;
      view = new LineStyleView("h1");
      fixture = "# heading 1";
      return expect(view.isStyleOn(fixture)).toBe(true);
    });
    it("check heading 1 not exists", function() {
      var fixture, view;
      view = new LineStyleView("h1");
      fixture = "## heading 1";
      return expect(view.isStyleOn(fixture)).toBe(false);
    });
    it("check ul exists", function() {
      var fixture, view;
      view = new LineStyleView("ul");
      fixture = "* unordered list";
      expect(view.isStyleOn(fixture)).toBe(true);
      fixture = "- unordered list";
      expect(view.isStyleOn(fixture)).toBe(true);
      fixture = "0. unordered list";
      return expect(view.isStyleOn(fixture)).toBe(true);
    });
    it("check ul not exists", function() {
      var fixture, view;
      view = new LineStyleView("ul");
      fixture = "a unordered list";
      return expect(view.isStyleOn(fixture)).toBe(false);
    });
    it("applies heading 1 styles", function() {
      var fixture, view;
      atom.config.set("markdown-writer.lineStyles.h1", {
        before: "# ",
        after: " #"
      });
      view = new LineStyleView("h1");
      fixture = "## heading 1 ##";
      return expect(view.addStyle(fixture)).toBe("# heading 1 #");
    });
    it("applies heading 2 styles", function() {
      var fixture, view;
      view = new LineStyleView("h2");
      fixture = "# heading 2";
      return expect(view.addStyle(fixture)).toBe("## heading 2");
    });
    it("applies blockquote styles", function() {
      var fixture, view;
      view = new LineStyleView("blockquote");
      fixture = "blockquote";
      return expect(view.addStyle(fixture)).toBe("> blockquote");
    });
    it("applies heading 1 styles", function() {
      var fixture, view;
      atom.config.set("markdown-writer.lineStyles.h1", {
        before: "# ",
        after: " #"
      });
      view = new LineStyleView("h1");
      fixture = "# heading 1 #";
      return expect(view.removeStyle(fixture)).toBe("heading 1");
    });
    it("remove heading 3 styles", function() {
      var fixture, view;
      view = new LineStyleView("h3");
      fixture = "### heading 3";
      return expect(view.removeStyle(fixture)).toBe("heading 3");
    });
    return it("remove ol styles", function() {
      var fixture, view;
      view = new LineStyleView("ol");
      fixture = "123. ordered list";
      return expect(view.removeStyle(fixture)).toBe("ordered list");
    });
  });

}).call(this);
