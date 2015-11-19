(function() {
  var utils;

  utils = require("../lib/utils");

  describe("utils", function() {
    it("get date dashed string", function() {
      var date;
      date = utils.getDate();
      return expect(utils.getDateStr()).toEqual("" + date.year + "-" + date.month + "-" + date.day);
    });
    it("check is valid image", function() {
      var fixture;
      fixture = "![text](url)";
      expect(utils.isImage(fixture)).toBe(true);
      fixture = "[text](url)";
      return expect(utils.isImage(fixture)).toBe(false);
    });
    it("parse valid image", function() {
      var fixture;
      fixture = "![text](url)";
      return expect(utils.parseImage(fixture)).toEqual({
        alt: "text",
        src: "url",
        title: ""
      });
    });
    it("check is valid raw image", function() {
      var fixture;
      fixture = "<img alt=\"alt\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\">";
      return expect(utils.isImageTag(fixture)).toBe(true);
    });
    it("check parse valid raw image", function() {
      var fixture;
      fixture = "<img alt=\"alt\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\">";
      return expect(utils.parseImageTag(fixture)).toEqual({
        alt: "alt",
        src: "src.png",
        "class": "aligncenter",
        height: "304",
        width: "520"
      });
    });
    it("check parse valid raw image 2", function() {
      var fixture;
      fixture = "<img title=\"\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\" />";
      return expect(utils.parseImageTag(fixture)).toEqual({
        title: "",
        src: "src.png",
        "class": "aligncenter",
        height: "304",
        width: "520"
      });
    });
    it("check is text invalid inline link", function() {
      var fixture;
      fixture = "![text](url)";
      expect(utils.isInlineLink(fixture)).toBe(false);
      fixture = "[text]()";
      expect(utils.isInlineLink(fixture)).toBe(false);
      fixture = "[text][]";
      return expect(utils.isInlineLink(fixture)).toBe(false);
    });
    it("check is text valid inline link", function() {
      var fixture;
      fixture = "[text](url)";
      expect(utils.isInlineLink(fixture)).toBe(true);
      fixture = "[text](url title)";
      expect(utils.isInlineLink(fixture)).toBe(true);
      fixture = "[text](url 'title')";
      return expect(utils.isInlineLink(fixture)).toBe(true);
    });
    it("parse valid inline link text", function() {
      var fixture;
      fixture = "[text](url)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: ""
      });
      fixture = "[text](url title)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: "title"
      });
      fixture = "[text](url 'title')";
      return expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: "title"
      });
    });
    it("check is text invalid reference link", function() {
      var fixture;
      fixture = "![text](url)";
      expect(utils.isReferenceLink(fixture)).toBe(false);
      fixture = "[text](has)";
      return expect(utils.isReferenceLink(fixture)).toBe(false);
    });
    it("check is text valid reference link", function() {
      var fixture;
      fixture = "[text][]";
      expect(utils.isReferenceLink(fixture)).toBe(true);
      fixture = "[text][url title]";
      return expect(utils.isReferenceLink(fixture)).toBe(true);
    });
    it("check is text valid reference definition", function() {
      var fixture;
      fixture = "[text]: http";
      return expect(utils.isReferenceDefinition(fixture)).toBe(true);
    });
    it("parse valid reference link text", function() {
      var content, contentWithTitle, fixture;
      content = "Transform your plain [text][]\ninto static websites and blogs.\n[text]: http://www.jekyll.com";
      contentWithTitle = "Transform your plain [text][id]\ninto static websites and blogs.\n\n[id]: http://jekyll.com \"Jekyll Website\"\n\nMarkdown (or Textile), Liquid, HTML & CSS go in.";
      fixture = "[text][]";
      expect(utils.parseReferenceLink(fixture, content)).toEqual({
        id: "text",
        text: "text",
        url: "http://www.jekyll.com",
        title: ""
      });
      fixture = "[text][id]";
      return expect(utils.parseReferenceLink(fixture, contentWithTitle)).toEqual({
        id: "id",
        text: "text",
        url: "http://jekyll.com",
        title: "Jekyll Website"
      });
    });
    it("test not has front matter", function() {
      var fixture;
      fixture = "title\n---\nhello world\n";
      return expect(utils.hasFrontMatter(fixture)).toBe(false);
    });
    it("test has front matter", function() {
      var fixture;
      fixture = "---\nkey1: val1\nkey2: val2\n---\n";
      expect(utils.hasFrontMatter(fixture)).toBe(true);
      fixture = "key1: val1\nkey2: val2\n---\n";
      return expect(utils.hasFrontMatter(fixture)).toBe(true);
    });
    it("get front matter as js object (jekyll)", function() {
      var fixture, result;
      fixture = "---\nkey1: val1\nkey2: val2\n---\n";
      result = utils.getFrontMatter(fixture);
      return expect(result).toEqual({
        key1: "val1",
        key2: "val2"
      });
    });
    it("get front matter as js object (hexo)", function() {
      var fixture, result;
      fixture = "key1: val1\nkey2: val2\n---\n";
      result = utils.getFrontMatter(fixture);
      return expect(result).toEqual({
        key1: "val1",
        key2: "val2"
      });
    });
    it("get front matter as empty object", function() {
      var fixture, result;
      fixture = "---\n\n\n---\n";
      result = utils.getFrontMatter(fixture);
      expect(result).toEqual({});
      fixture = "\n\n\n---\n";
      result = utils.getFrontMatter(fixture);
      expect(result).toEqual({});
      fixture = "this is content\nwith no front matters\n";
      result = utils.getFrontMatter(fixture);
      return expect(result).toEqual({});
    });
    it("replace front matter", function() {
      var expected, result;
      expected = "---\nkey1: val1\nkey2:\n  - v1\n  - v2\n---\n";
      result = utils.getFrontMatterText({
        key1: "val1",
        key2: ["v1", "v2"]
      });
      return expect(result).toEqual(expected);
    });
    it("check is url", function() {
      var fixture;
      fixture = "https://github.com/zhuochun/md-writer";
      expect(utils.isUrl(fixture)).toBe(true);
      fixture = "/Users/zhuochun/md-writer";
      return expect(utils.isUrl(fixture)).toBe(false);
    });
    it("check is table separator", function() {
      var fixture;
      fixture = "--|------|---";
      expect(utils.isTableSeparator(fixture)).toBe(true);
      fixture = "---- |------ | ---";
      expect(utils.isTableSeparator(fixture)).toBe(true);
      fixture = "------ | --------|--------";
      return expect(utils.isTableSeparator(fixture)).toBe(true);
    });
    it("replace front matter (no leading fence)", function() {
      var expected, result;
      expected = "key1: val1\nkey2:\n  - v1\n  - v2\n---\n";
      result = utils.getFrontMatterText({
        key1: "val1",
        key2: ["v1", "v2"]
      }, true);
      return expect(result).toEqual(expected);
    });
    it("dasherize title", function() {
      var fixture;
      fixture = "hello world!";
      expect(utils.dasherize(fixture)).toEqual("hello-world");
      fixture = "hello-world";
      expect(utils.dasherize(fixture)).toEqual("hello-world");
      fixture = " hello     World";
      return expect(utils.dasherize(fixture)).toEqual("hello-world");
    });
    it("get title slug", function() {
      var fixture, slug;
      slug = "hello-world";
      fixture = "abc/hello-world.markdown";
      expect(utils.getTitleSlug(slug)).toEqual(slug);
      fixture = "abc/2014-02-12-hello-world.markdown";
      expect(utils.getTitleSlug(fixture)).toEqual(slug);
      fixture = "abc/02-12-2014-hello-world.markdown";
      return expect(utils.getTitleSlug(fixture)).toEqual(slug);
    });
    it("generate posts directory without token", function() {
      return expect(utils.dirTemplate("_posts/")).toEqual("_posts/");
    });
    it("generate posts directory with tokens", function() {
      var date, result;
      date = utils.getDate();
      result = utils.dirTemplate("_posts/{year}/{month}");
      return expect(result).toEqual("_posts/" + date.year + "/" + date.month);
    });
    it("generate template", function() {
      var fixture;
      fixture = "<a href=''>hello <title>! <from></a>";
      return expect(utils.template(fixture, {
        title: "world",
        from: "markdown-writer"
      })).toEqual("<a href=''>hello world! markdown-writer</a>");
    });
    return it("generate template with data missing", function() {
      var fixture;
      fixture = "<a href='<url>' title='<title>'><img></a>";
      return expect(utils.template(fixture, {
        url: "//",
        title: ''
      })).toEqual("<a href='//' title=''><img></a>");
    });
  });

}).call(this);
