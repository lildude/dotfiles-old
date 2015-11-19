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
    it("check is valid html image tag", function() {
      var fixture;
      fixture = "<img alt=\"alt\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\">";
      return expect(utils.isImageTag(fixture)).toBe(true);
    });
    it("check parse valid html image tag", function() {
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
    it("check parse valid html image tag with title", function() {
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
      return expect(utils.isReferenceLink(fixture)).toBe(true);
    });
    it("check is text valid reference link with id", function() {
      var fixture;
      fixture = "[text][id with space]";
      return expect(utils.isReferenceLink(fixture)).toBe(true);
    });
    xit("parse valid reference link text without id", function() {
      var content, fixture;
      content = "Transform your plain [text][] into static websites and blogs.\n\n[text]: http://www.jekyll.com\n\nMarkdown (or Textile), Liquid, HTML & CSS go in.";
      fixture = "[text][]";
      return expect(utils.parseReferenceLink(fixture, content)).toEqual({
        id: "text",
        text: "text",
        url: "http://www.jekyll.com",
        title: ""
      });
    });
    xit("parse valid reference link text with id", function() {
      var content, fixture;
      content = "Transform your plain [text][id] into static websites and blogs.\n\n[id]: http://jekyll.com \"Jekyll Website\"\n\nMarkdown (or Textile), Liquid, HTML & CSS go in.";
      fixture = "[text][id]";
      return expect(utils.parseReferenceLink(fixture, content)).toEqual({
        id: "id",
        text: "text",
        url: "http://jekyll.com",
        title: "Jekyll Website"
      });
    });
    it("check is text invalid reference definition", function() {
      var fixture;
      fixture = "[text] http";
      return expect(utils.isReferenceDefinition(fixture)).toBe(false);
    });
    it("check is text valid reference definition", function() {
      var fixture;
      fixture = "[text text]: http";
      return expect(utils.isReferenceDefinition(fixture)).toBe(true);
    });
    it("check is text valid reference definition with title", function() {
      var fixture;
      fixture = "  [text]: http 'title not in double quote'";
      return expect(utils.isReferenceDefinition(fixture)).toBe(true);
    });
    xit("parse valid reference definition text without id", function() {
      var content, fixture;
      content = "Transform your plain [text][] into static websites and blogs.\n\n[text]: http://www.jekyll.com\n\nMarkdown (or Textile), Liquid, HTML & CSS go in.";
      fixture = "[text]: http://www.jekyll.com";
      return expect(utils.parseReferenceDefinition(fixture, content)).toEqual({
        id: "text",
        text: "text",
        url: "http://www.jekyll.com",
        title: ""
      });
    });
    xit("parse valid reference definition text with id", function() {
      var content, fixture;
      content = "Transform your plain [text][id] into static websites and blogs.\n\n[id]: http://jekyll.com \"Jekyll Website\"\n\nMarkdown (or Textile), Liquid, HTML & CSS go in.";
      fixture = "[id]: http://jekyll.com \"Jekyll Website\"";
      return expect(utils.parseReferenceDefinition(fixture, content)).toEqual({
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
      fixture = "----|";
      expect(utils.isTableSeparator(fixture)).toBe(false);
      fixture = "|--|";
      expect(utils.isTableSeparator(fixture)).toBe(true);
      fixture = "--|--";
      expect(utils.isTableSeparator(fixture)).toBe(true);
      fixture = "---- |------ | ---";
      return expect(utils.isTableSeparator(fixture)).toBe(true);
    });
    it("check is table separator with extra pipes", function() {
      var fixture;
      fixture = "|-----";
      expect(utils.isTableSeparator(fixture)).toBe(false);
      fixture = "|--|--";
      expect(utils.isTableSeparator(fixture)).toBe(true);
      fixture = "|---- |------ | ---|";
      return expect(utils.isTableSeparator(fixture)).toBe(true);
    });
    it("check is table separator with format", function() {
      var fixture;
      fixture = ":--  |::---";
      expect(utils.isTableSeparator(fixture)).toBe(false);
      fixture = "|:---: |";
      expect(utils.isTableSeparator(fixture)).toBe(true);
      fixture = ":--|--:";
      expect(utils.isTableSeparator(fixture)).toBe(true);
      fixture = "|:---: |:----- | --: |";
      return expect(utils.isTableSeparator(fixture)).toBe(true);
    });
    it("parse table separator", function() {
      var fixture;
      fixture = "|----|";
      expect(utils.parseTableSeparator(fixture)).toEqual({
        separator: true,
        extraPipes: true,
        alignments: ["empty"],
        columns: ["----"],
        columnWidths: [4]
      });
      fixture = "--|--";
      expect(utils.parseTableSeparator(fixture)).toEqual({
        separator: true,
        extraPipes: false,
        alignments: ["empty", "empty"],
        columns: ["--", "--"],
        columnWidths: [2, 2]
      });
      fixture = "---- |------ | ---";
      return expect(utils.parseTableSeparator(fixture)).toEqual({
        separator: true,
        extraPipes: false,
        alignments: ["empty", "empty", "empty"],
        columns: ["----", "------", "---"],
        columnWidths: [4, 6, 3]
      });
    });
    it("parse table separator with extra pipes", function() {
      var fixture;
      fixture = "|--|--";
      expect(utils.parseTableSeparator(fixture)).toEqual({
        separator: true,
        extraPipes: true,
        alignments: ["empty", "empty"],
        columns: ["--", "--"],
        columnWidths: [2, 2]
      });
      fixture = "|---- |------ | ---|";
      return expect(utils.parseTableSeparator(fixture)).toEqual({
        separator: true,
        extraPipes: true,
        alignments: ["empty", "empty", "empty"],
        columns: ["----", "------", "---"],
        columnWidths: [4, 6, 3]
      });
    });
    it("parse table separator with format", function() {
      var fixture;
      fixture = ":--|--:";
      expect(utils.parseTableSeparator(fixture)).toEqual({
        separator: true,
        extraPipes: false,
        alignments: ["left", "right"],
        columns: [":--", "--:"],
        columnWidths: [3, 3]
      });
      fixture = "|:---: |:----- | --: |";
      return expect(utils.parseTableSeparator(fixture)).toEqual({
        separator: true,
        extraPipes: true,
        alignments: ["center", "left", "right"],
        columns: [":---:", ":-----", "--:"],
        columnWidths: [5, 6, 3]
      });
    });
    it("check table separator is a table row", function() {
      var fixture;
      fixture = ":--  |:---";
      return expect(utils.isTableRow(fixture)).toBe(true);
    });
    it("check is table row", function() {
      var fixture;
      fixture = "| empty content |";
      expect(utils.isTableRow(fixture)).toBe(true);
      fixture = "abc|feg";
      expect(utils.isTableRow(fixture)).toBe(true);
      fixture = "|   abc |efg | |";
      return expect(utils.isTableRow(fixture)).toBe(true);
    });
    it("parse table separator by table row ", function() {
      var fixture;
      fixture = "|:---: |:----- | --: |";
      return expect(utils.parseTableRow(fixture)).toEqual({
        separator: true,
        extraPipes: true,
        alignments: ["center", "left", "right"],
        columns: [":---:", ":-----", "--:"],
        columnWidths: [5, 6, 3]
      });
    });
    it("parse table row ", function() {
      var fixture;
      fixture = "| 中文 |";
      expect(utils.parseTableRow(fixture)).toEqual({
        separator: false,
        extraPipes: true,
        columns: ["中文"],
        columnWidths: [4]
      });
      fixture = "abc|feg";
      expect(utils.parseTableRow(fixture)).toEqual({
        separator: false,
        extraPipes: false,
        columns: ["abc", "feg"],
        columnWidths: [3, 3]
      });
      fixture = "|   abc |efg | |";
      return expect(utils.parseTableRow(fixture)).toEqual({
        separator: false,
        extraPipes: true,
        columns: ["abc", "efg", ""],
        columnWidths: [3, 3, 0]
      });
    });
    it("create table separator", function() {
      var row;
      row = utils.createTableSeparator({
        numOfColumns: 3,
        extraPipes: false,
        columnWidth: 3,
        alignment: "empty"
      });
      expect(row).toEqual("---|---|---");
      row = utils.createTableSeparator({
        numOfColumns: 2,
        extraPipes: true,
        columnWidth: 3,
        alignment: "empty"
      });
      expect(row).toEqual("|---|---|");
      row = utils.createTableSeparator({
        numOfColumns: 1,
        extraPipes: true,
        columnWidth: 3,
        alignment: "left"
      });
      expect(row).toEqual("|:--|");
      row = utils.createTableSeparator({
        numOfColumns: 3,
        extraPipes: true,
        columnWidths: [4, 5, 5],
        alignment: "left"
      });
      expect(row).toEqual("|:---|:----|:----|");
      row = utils.createTableSeparator({
        numOfColumns: 4,
        extraPipes: false,
        columnWidth: 5,
        alignment: "left",
        alignments: ["empty", "right", "center"]
      });
      return expect(row).toEqual("-----|----:|:---:|:----");
    });
    it("create empty table row", function() {
      var row;
      row = utils.createTableRow([], {
        numOfColumns: 3,
        columnWidth: 3,
        alignment: "empty"
      });
      expect(row).toEqual("   |   |   ");
      row = utils.createTableRow([], {
        numOfColumns: 3,
        extraPipes: true,
        columnWidths: [3, 4, 5],
        alignment: "empty"
      });
      return expect(row).toEqual("|   |    |     |");
    });
    it("create table row", function() {
      var row;
      row = utils.createTableRow(["中文", "English"], {
        numOfColumns: 2,
        extraPipes: true,
        columnWidths: [6, 9]
      });
      expect(row).toEqual("| 中文 | English |");
      row = utils.createTableRow(["中文", "English"], {
        numOfColumns: 2,
        columnWidths: [9, 11],
        alignments: ["right", "center"]
      });
      return expect(row).toEqual("    中文 |  English  ");
    });
    it("create an empty table", function() {
      var options, rows;
      rows = [];
      options = {
        numOfColumns: 3,
        columnWidths: [5, 3, 5],
        alignments: ["left", "center", "right"]
      };
      rows.push(utils.createTableRow([], options));
      rows.push(utils.createTableSeparator(options));
      rows.push(utils.createTableRow([], options));
      return expect(rows).toEqual(["     |   |     ", ":----|:-:|----:", "     |   |     "]);
    });
    it("create an empty table with extra pipes", function() {
      var options, rows;
      rows = [];
      options = {
        numOfColumns: 3,
        extraPipes: true,
        columnWidth: 3,
        alignment: "empty"
      };
      rows.push(utils.createTableRow([], options));
      rows.push(utils.createTableSeparator(options));
      rows.push(utils.createTableRow([], options));
      return expect(rows).toEqual(["|   |   |   |", "|---|---|---|", "|   |   |   |"]);
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
    it("generate template with data missing", function() {
      var fixture;
      fixture = "<a href='<url>' title='<title>'><img></a>";
      return expect(utils.template(fixture, {
        url: "//",
        title: ''
      })).toEqual("<a href='//' title=''><img></a>");
    });
    it("get the package path", function() {
      return expect(utils.getPackagePath()).toEqual(atom.packages.resolvePackagePath("markdown-writer"));
    });
    return it("get the package path to file", function() {
      var root;
      root = atom.packages.resolvePackagePath("markdown-writer");
      return expect(utils.getPackagePath("CHEATSHEET.md")).toEqual("" + root + "/CHEATSHEET.md");
    });
  });

}).call(this);
