(function() {
  var TextStyleView;

  TextStyleView = require("../lib/style-text");

  describe("StyleText", function() {
    it("check a style is added", function() {
      var fixture, view;
      view = new TextStyleView("bold");
      fixture = "**bold**";
      return expect(view.isStyleOn(fixture)).toBe(true);
    });
    it("check any bold style is in string", function() {
      var fixture, view;
      view = new TextStyleView("bold");
      fixture = "hello **bold** world";
      return expect(view.isStyleOn(fixture)).toBe(true);
    });
    it("check any italic is in string", function() {
      var fixture, view;
      view = new TextStyleView("italic");
      fixture = "_italic_ yah _text_";
      return expect(view.isStyleOn(fixture)).toBe(true);
    });
    it("check any strike is in string", function() {
      var fixture, view;
      view = new TextStyleView("strikethrough");
      fixture = "**bold** one ~~strike~~ two _italic_";
      return expect(view.isStyleOn(fixture)).toBe(true);
    });
    it("check a style is not added", function() {
      var fixture, view;
      view = new TextStyleView("bold");
      fixture = "_not bold_";
      return expect(view.isStyleOn(fixture)).toBe(false);
    });
    it("remove a style from text", function() {
      var fixture, view;
      view = new TextStyleView("italic");
      fixture = "_italic text_";
      return expect(view.removeStyle(fixture)).toEqual("italic text");
    });
    it("remove bold style from text", function() {
      var fixture, view;
      view = new TextStyleView("bold");
      fixture = "**bold text** in a string";
      return expect(view.removeStyle(fixture)).toEqual("bold text in a string");
    });
    it("remove italic styles from text", function() {
      var fixture, view;
      view = new TextStyleView("italic");
      fixture = "_italic_ yah _text_ loh _more_";
      return expect(view.removeStyle(fixture)).toEqual("italic yah text loh more");
    });
    return it("add a style to text", function() {
      var fixture, view;
      view = new TextStyleView("bold");
      fixture = "bold text";
      return expect(view.addStyle(fixture)).toEqual("**bold text**");
    });
  });

}).call(this);
