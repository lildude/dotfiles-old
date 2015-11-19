(function() {
  var config;

  config = require("../lib/config");

  describe("config", function() {
    it("get default value", function() {
      return expect(config.get("fileExtension")).toEqual(".markdown");
    });
    it("get engine value", function() {
      config.set("siteEngine", "jekyll");
      expect(config.getEngine("codeblock.before")).not.toBeNull();
      expect(config.getEngine("imageTag")).not.toBeDefined();
      config.set("siteEngine", "not-exists");
      return expect(config.getEngine("imageTag")).not.toBeDefined();
    });
    it("get default value from engine or user config", function() {
      config.set("siteEngine", "jekyll");
      expect(config.get("codeblock.before")).toEqual(config.getEngine("codeblock.before"));
      config.set("codeblock.before", "changed");
      return expect(config.get("codeblock.before")).toEqual("changed");
    });
    it("get modified value", function() {
      atom.config.set("markdown-writer.test", "special");
      return expect(config.get("test")).toEqual("special");
    });
    return it("set key and value", function() {
      config.set("test", "value");
      return expect(atom.config.get("markdown-writer.test")).toEqual("value");
    });
  });

}).call(this);
