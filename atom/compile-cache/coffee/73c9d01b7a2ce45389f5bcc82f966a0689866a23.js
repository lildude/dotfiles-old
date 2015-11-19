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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdXRpbHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsS0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUixDQUFSLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsSUFBQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBUCxDQUFBO2FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxVQUFOLENBQUEsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLEVBQUEsR0FBRyxJQUFJLENBQUMsSUFBUixHQUFhLEdBQWIsR0FBZ0IsSUFBSSxDQUFDLEtBQXJCLEdBQTJCLEdBQTNCLEdBQThCLElBQUksQ0FBQyxHQUF0RSxFQUYyQjtJQUFBLENBQTdCLENBQUEsQ0FBQTtBQUFBLElBSUEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtBQUN6QixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxjQUFWLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsT0FBTixDQUFjLE9BQWQsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLElBQXBDLENBREEsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLGFBRlYsQ0FBQTthQUdBLE1BQUEsQ0FBTyxLQUFLLENBQUMsT0FBTixDQUFjLE9BQWQsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLEtBQXBDLEVBSnlCO0lBQUEsQ0FBM0IsQ0FKQSxDQUFBO0FBQUEsSUFVQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLGNBQVYsQ0FBQTthQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBTixDQUFpQixPQUFqQixDQUFQLENBQWlDLENBQUMsT0FBbEMsQ0FDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLE1BQUw7QUFBQSxRQUFhLEdBQUEsRUFBSyxLQUFsQjtBQUFBLFFBQXlCLEtBQUEsRUFBTyxFQUFoQztPQURGLEVBRnNCO0lBQUEsQ0FBeEIsQ0FWQSxDQUFBO0FBQUEsSUFlQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLHNGQUFWLENBQUE7YUFHQSxNQUFBLENBQU8sS0FBSyxDQUFDLFVBQU4sQ0FBaUIsT0FBakIsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLElBQXZDLEVBSmtDO0lBQUEsQ0FBcEMsQ0FmQSxDQUFBO0FBQUEsSUFxQkEsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxzRkFBVixDQUFBO2FBR0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLENBQVAsQ0FBb0MsQ0FBQyxPQUFyQyxDQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUssS0FBTDtBQUFBLFFBQVksR0FBQSxFQUFLLFNBQWpCO0FBQUEsUUFDQSxPQUFBLEVBQU8sYUFEUDtBQUFBLFFBQ3NCLE1BQUEsRUFBUSxLQUQ5QjtBQUFBLFFBQ3FDLEtBQUEsRUFBTyxLQUQ1QztPQURGLEVBSnFDO0lBQUEsQ0FBdkMsQ0FyQkEsQ0FBQTtBQUFBLElBNkJBLEVBQUEsQ0FBRyw2Q0FBSCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsdUZBQVYsQ0FBQTthQUdBLE1BQUEsQ0FBTyxLQUFLLENBQUMsYUFBTixDQUFvQixPQUFwQixDQUFQLENBQW9DLENBQUMsT0FBckMsQ0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxRQUFXLEdBQUEsRUFBSyxTQUFoQjtBQUFBLFFBQ0EsT0FBQSxFQUFPLGFBRFA7QUFBQSxRQUNzQixNQUFBLEVBQVEsS0FEOUI7QUFBQSxRQUNxQyxLQUFBLEVBQU8sS0FENUM7T0FERixFQUpnRDtJQUFBLENBQWxELENBN0JBLENBQUE7QUFBQSxJQXFDQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLGNBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxZQUFOLENBQW1CLE9BQW5CLENBQVAsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxLQUF6QyxDQURBLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxVQUZWLENBQUE7QUFBQSxNQUdBLE1BQUEsQ0FBTyxLQUFLLENBQUMsWUFBTixDQUFtQixPQUFuQixDQUFQLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsS0FBekMsQ0FIQSxDQUFBO0FBQUEsTUFJQSxPQUFBLEdBQVUsVUFKVixDQUFBO2FBS0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxZQUFOLENBQW1CLE9BQW5CLENBQVAsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxLQUF6QyxFQU5zQztJQUFBLENBQXhDLENBckNBLENBQUE7QUFBQSxJQTZDQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBQ3BDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLGFBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxZQUFOLENBQW1CLE9BQW5CLENBQVAsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxJQUF6QyxDQURBLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxtQkFGVixDQUFBO0FBQUEsTUFHQSxNQUFBLENBQU8sS0FBSyxDQUFDLFlBQU4sQ0FBbUIsT0FBbkIsQ0FBUCxDQUFtQyxDQUFDLElBQXBDLENBQXlDLElBQXpDLENBSEEsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLHFCQUpWLENBQUE7YUFLQSxNQUFBLENBQU8sS0FBSyxDQUFDLFlBQU4sQ0FBbUIsT0FBbkIsQ0FBUCxDQUFtQyxDQUFDLElBQXBDLENBQXlDLElBQXpDLEVBTm9DO0lBQUEsQ0FBdEMsQ0E3Q0EsQ0FBQTtBQUFBLElBcURBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsYUFBVixDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGVBQU4sQ0FBc0IsT0FBdEIsQ0FBUCxDQUFzQyxDQUFDLE9BQXZDLENBQ0U7QUFBQSxRQUFDLElBQUEsRUFBTSxNQUFQO0FBQUEsUUFBZSxHQUFBLEVBQUssS0FBcEI7QUFBQSxRQUEyQixLQUFBLEVBQU8sRUFBbEM7T0FERixDQURBLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxtQkFIVixDQUFBO0FBQUEsTUFJQSxNQUFBLENBQU8sS0FBSyxDQUFDLGVBQU4sQ0FBc0IsT0FBdEIsQ0FBUCxDQUFzQyxDQUFDLE9BQXZDLENBQ0U7QUFBQSxRQUFDLElBQUEsRUFBTSxNQUFQO0FBQUEsUUFBZSxHQUFBLEVBQUssS0FBcEI7QUFBQSxRQUEyQixLQUFBLEVBQU8sT0FBbEM7T0FERixDQUpBLENBQUE7QUFBQSxNQU1BLE9BQUEsR0FBVSxxQkFOVixDQUFBO2FBT0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxlQUFOLENBQXNCLE9BQXRCLENBQVAsQ0FBc0MsQ0FBQyxPQUF2QyxDQUNFO0FBQUEsUUFBQyxJQUFBLEVBQU0sTUFBUDtBQUFBLFFBQWUsR0FBQSxFQUFLLEtBQXBCO0FBQUEsUUFBMkIsS0FBQSxFQUFPLE9BQWxDO09BREYsRUFSaUM7SUFBQSxDQUFuQyxDQXJEQSxDQUFBO0FBQUEsSUFnRUEsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxjQUFWLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsZUFBTixDQUFzQixPQUF0QixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsS0FBNUMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsYUFGVixDQUFBO2FBR0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxlQUFOLENBQXNCLE9BQXRCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxLQUE1QyxFQUp5QztJQUFBLENBQTNDLENBaEVBLENBQUE7QUFBQSxJQXNFQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFVBQVYsQ0FBQTthQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsZUFBTixDQUFzQixPQUF0QixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsSUFBNUMsRUFGdUM7SUFBQSxDQUF6QyxDQXRFQSxDQUFBO0FBQUEsSUEwRUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSx1QkFBVixDQUFBO2FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxlQUFOLENBQXNCLE9BQXRCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxJQUE1QyxFQUYrQztJQUFBLENBQWpELENBMUVBLENBQUE7QUFBQSxJQStFQSxHQUFBLENBQUksNENBQUosRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFVBQUEsZ0JBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxvSkFBVixDQUFBO0FBQUEsTUFPQSxPQUFBLEdBQVUsVUFQVixDQUFBO2FBUUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxrQkFBTixDQUF5QixPQUF6QixFQUFrQyxPQUFsQyxDQUFQLENBQWtELENBQUMsT0FBbkQsQ0FDRTtBQUFBLFFBQUEsRUFBQSxFQUFJLE1BQUo7QUFBQSxRQUFZLElBQUEsRUFBTSxNQUFsQjtBQUFBLFFBQTBCLEdBQUEsRUFBSyx1QkFBL0I7QUFBQSxRQUF3RCxLQUFBLEVBQU8sRUFBL0Q7T0FERixFQVRnRDtJQUFBLENBQWxELENBL0VBLENBQUE7QUFBQSxJQTRGQSxHQUFBLENBQUkseUNBQUosRUFBK0MsU0FBQSxHQUFBO0FBQzdDLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxtS0FBVixDQUFBO0FBQUEsTUFPQSxPQUFBLEdBQVUsWUFQVixDQUFBO2FBUUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxrQkFBTixDQUF5QixPQUF6QixFQUFrQyxPQUFsQyxDQUFQLENBQWtELENBQUMsT0FBbkQsQ0FDRTtBQUFBLFFBQUEsRUFBQSxFQUFJLElBQUo7QUFBQSxRQUFVLElBQUEsRUFBTSxNQUFoQjtBQUFBLFFBQXdCLEdBQUEsRUFBSyxtQkFBN0I7QUFBQSxRQUFrRCxLQUFBLEVBQU8sZ0JBQXpEO09BREYsRUFUNkM7SUFBQSxDQUEvQyxDQTVGQSxDQUFBO0FBQUEsSUF3R0EsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxhQUFWLENBQUE7YUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLHFCQUFOLENBQTRCLE9BQTVCLENBQVAsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFrRCxLQUFsRCxFQUYrQztJQUFBLENBQWpELENBeEdBLENBQUE7QUFBQSxJQTRHQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQSxHQUFBO0FBQzdDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLG1CQUFWLENBQUE7YUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLHFCQUFOLENBQTRCLE9BQTVCLENBQVAsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFrRCxJQUFsRCxFQUY2QztJQUFBLENBQS9DLENBNUdBLENBQUE7QUFBQSxJQWdIQSxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLDRDQUFWLENBQUE7YUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLHFCQUFOLENBQTRCLE9BQTVCLENBQVAsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFrRCxJQUFsRCxFQUZ3RDtJQUFBLENBQTFELENBaEhBLENBQUE7QUFBQSxJQXFIQSxHQUFBLENBQUksa0RBQUosRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFVBQUEsZ0JBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxvSkFBVixDQUFBO0FBQUEsTUFPQSxPQUFBLEdBQVUsK0JBUFYsQ0FBQTthQVFBLE1BQUEsQ0FBTyxLQUFLLENBQUMsd0JBQU4sQ0FBK0IsT0FBL0IsRUFBd0MsT0FBeEMsQ0FBUCxDQUF3RCxDQUFDLE9BQXpELENBQ0U7QUFBQSxRQUFBLEVBQUEsRUFBSSxNQUFKO0FBQUEsUUFBWSxJQUFBLEVBQU0sTUFBbEI7QUFBQSxRQUEwQixHQUFBLEVBQUssdUJBQS9CO0FBQUEsUUFBd0QsS0FBQSxFQUFPLEVBQS9EO09BREYsRUFUc0Q7SUFBQSxDQUF4RCxDQXJIQSxDQUFBO0FBQUEsSUFrSUEsR0FBQSxDQUFJLCtDQUFKLEVBQXFELFNBQUEsR0FBQTtBQUNuRCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsbUtBQVYsQ0FBQTtBQUFBLE1BT0EsT0FBQSxHQUFVLDRDQVBWLENBQUE7YUFRQSxNQUFBLENBQU8sS0FBSyxDQUFDLHdCQUFOLENBQStCLE9BQS9CLEVBQXdDLE9BQXhDLENBQVAsQ0FBd0QsQ0FBQyxPQUF6RCxDQUNFO0FBQUEsUUFBQSxFQUFBLEVBQUksSUFBSjtBQUFBLFFBQVUsSUFBQSxFQUFNLE1BQWhCO0FBQUEsUUFBd0IsR0FBQSxFQUFLLG1CQUE3QjtBQUFBLFFBQWtELEtBQUEsRUFBTyxnQkFBekQ7T0FERixFQVRtRDtJQUFBLENBQXJELENBbElBLENBQUE7QUFBQSxJQThJQSxFQUFBLENBQUcsY0FBSCxFQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsdUNBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxLQUFOLENBQVksT0FBWixDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsMkJBRlYsQ0FBQTthQUdBLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBTixDQUFZLE9BQVosQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLEVBSmlCO0lBQUEsQ0FBbkIsQ0E5SUEsQ0FBQTtBQUFBLElBb0pBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDN0IsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBVixDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGdCQUFOLENBQXVCLE9BQXZCLENBQVAsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxLQUE3QyxDQURBLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxNQUhWLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsT0FBdkIsQ0FBUCxDQUF1QyxDQUFDLElBQXhDLENBQTZDLElBQTdDLENBSkEsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLE9BTFYsQ0FBQTtBQUFBLE1BTUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxnQkFBTixDQUF1QixPQUF2QixDQUFQLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsSUFBN0MsQ0FOQSxDQUFBO0FBQUEsTUFPQSxPQUFBLEdBQVUsb0JBUFYsQ0FBQTthQVFBLE1BQUEsQ0FBTyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsT0FBdkIsQ0FBUCxDQUF1QyxDQUFDLElBQXhDLENBQTZDLElBQTdDLEVBVDZCO0lBQUEsQ0FBL0IsQ0FwSkEsQ0FBQTtBQUFBLElBK0pBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsUUFBVixDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGdCQUFOLENBQXVCLE9BQXZCLENBQVAsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxLQUE3QyxDQURBLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxRQUhWLENBQUE7QUFBQSxNQUlBLE1BQUEsQ0FBTyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsT0FBdkIsQ0FBUCxDQUF1QyxDQUFDLElBQXhDLENBQTZDLElBQTdDLENBSkEsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLHNCQUxWLENBQUE7YUFNQSxNQUFBLENBQU8sS0FBSyxDQUFDLGdCQUFOLENBQXVCLE9BQXZCLENBQVAsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxJQUE3QyxFQVA4QztJQUFBLENBQWhELENBL0pBLENBQUE7QUFBQSxJQXdLQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLGFBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxnQkFBTixDQUF1QixPQUF2QixDQUFQLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsS0FBN0MsQ0FEQSxDQUFBO0FBQUEsTUFHQSxPQUFBLEdBQVUsVUFIVixDQUFBO0FBQUEsTUFJQSxNQUFBLENBQU8sS0FBSyxDQUFDLGdCQUFOLENBQXVCLE9BQXZCLENBQVAsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxJQUE3QyxDQUpBLENBQUE7QUFBQSxNQUtBLE9BQUEsR0FBVSxTQUxWLENBQUE7QUFBQSxNQU1BLE1BQUEsQ0FBTyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsT0FBdkIsQ0FBUCxDQUF1QyxDQUFDLElBQXhDLENBQTZDLElBQTdDLENBTkEsQ0FBQTtBQUFBLE1BT0EsT0FBQSxHQUFVLHdCQVBWLENBQUE7YUFRQSxNQUFBLENBQU8sS0FBSyxDQUFDLGdCQUFOLENBQXVCLE9BQXZCLENBQVAsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxJQUE3QyxFQVR5QztJQUFBLENBQTNDLENBeEtBLENBQUE7QUFBQSxJQW1MQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFFBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxtQkFBTixDQUEwQixPQUExQixDQUFQLENBQTBDLENBQUMsT0FBM0MsQ0FBbUQ7QUFBQSxRQUNqRCxTQUFBLEVBQVcsSUFEc0M7QUFBQSxRQUVqRCxVQUFBLEVBQVksSUFGcUM7QUFBQSxRQUdqRCxVQUFBLEVBQVksQ0FBQyxPQUFELENBSHFDO0FBQUEsUUFJakQsT0FBQSxFQUFTLENBQUMsTUFBRCxDQUp3QztBQUFBLFFBS2pELFlBQUEsRUFBYyxDQUFDLENBQUQsQ0FMbUM7T0FBbkQsQ0FEQSxDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsT0FSVixDQUFBO0FBQUEsTUFTQSxNQUFBLENBQU8sS0FBSyxDQUFDLG1CQUFOLENBQTBCLE9BQTFCLENBQVAsQ0FBMEMsQ0FBQyxPQUEzQyxDQUFtRDtBQUFBLFFBQ2pELFNBQUEsRUFBVyxJQURzQztBQUFBLFFBRWpELFVBQUEsRUFBWSxLQUZxQztBQUFBLFFBR2pELFVBQUEsRUFBWSxDQUFDLE9BQUQsRUFBVSxPQUFWLENBSHFDO0FBQUEsUUFJakQsT0FBQSxFQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FKd0M7QUFBQSxRQUtqRCxZQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUxtQztPQUFuRCxDQVRBLENBQUE7QUFBQSxNQWdCQSxPQUFBLEdBQVUsb0JBaEJWLENBQUE7YUFpQkEsTUFBQSxDQUFPLEtBQUssQ0FBQyxtQkFBTixDQUEwQixPQUExQixDQUFQLENBQTBDLENBQUMsT0FBM0MsQ0FBbUQ7QUFBQSxRQUNqRCxTQUFBLEVBQVcsSUFEc0M7QUFBQSxRQUVqRCxVQUFBLEVBQVksS0FGcUM7QUFBQSxRQUdqRCxVQUFBLEVBQVksQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixPQUFuQixDQUhxQztBQUFBLFFBSWpELE9BQUEsRUFBUyxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLEtBQW5CLENBSndDO0FBQUEsUUFLakQsWUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBTG1DO09BQW5ELEVBbEIwQjtJQUFBLENBQTVCLENBbkxBLENBQUE7QUFBQSxJQTRNQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO0FBQzNDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFFBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxtQkFBTixDQUEwQixPQUExQixDQUFQLENBQTBDLENBQUMsT0FBM0MsQ0FBbUQ7QUFBQSxRQUNqRCxTQUFBLEVBQVcsSUFEc0M7QUFBQSxRQUVqRCxVQUFBLEVBQVksSUFGcUM7QUFBQSxRQUdqRCxVQUFBLEVBQVksQ0FBQyxPQUFELEVBQVUsT0FBVixDQUhxQztBQUFBLFFBSWpELE9BQUEsRUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQLENBSndDO0FBQUEsUUFLakQsWUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FMbUM7T0FBbkQsQ0FEQSxDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsc0JBUlYsQ0FBQTthQVNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsbUJBQU4sQ0FBMEIsT0FBMUIsQ0FBUCxDQUEwQyxDQUFDLE9BQTNDLENBQW1EO0FBQUEsUUFDakQsU0FBQSxFQUFXLElBRHNDO0FBQUEsUUFFakQsVUFBQSxFQUFZLElBRnFDO0FBQUEsUUFHakQsVUFBQSxFQUFZLENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsT0FBbkIsQ0FIcUM7QUFBQSxRQUlqRCxPQUFBLEVBQVMsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixLQUFuQixDQUp3QztBQUFBLFFBS2pELFlBQUEsRUFBYyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUxtQztPQUFuRCxFQVYyQztJQUFBLENBQTdDLENBNU1BLENBQUE7QUFBQSxJQTZOQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFNBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxtQkFBTixDQUEwQixPQUExQixDQUFQLENBQTBDLENBQUMsT0FBM0MsQ0FBbUQ7QUFBQSxRQUNqRCxTQUFBLEVBQVcsSUFEc0M7QUFBQSxRQUVqRCxVQUFBLEVBQVksS0FGcUM7QUFBQSxRQUdqRCxVQUFBLEVBQVksQ0FBQyxNQUFELEVBQVMsT0FBVCxDQUhxQztBQUFBLFFBSWpELE9BQUEsRUFBUyxDQUFDLEtBQUQsRUFBUSxLQUFSLENBSndDO0FBQUEsUUFLakQsWUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FMbUM7T0FBbkQsQ0FEQSxDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsd0JBUlYsQ0FBQTthQVNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsbUJBQU4sQ0FBMEIsT0FBMUIsQ0FBUCxDQUEwQyxDQUFDLE9BQTNDLENBQW1EO0FBQUEsUUFDakQsU0FBQSxFQUFXLElBRHNDO0FBQUEsUUFFakQsVUFBQSxFQUFZLElBRnFDO0FBQUEsUUFHakQsVUFBQSxFQUFZLENBQUMsUUFBRCxFQUFXLE1BQVgsRUFBbUIsT0FBbkIsQ0FIcUM7QUFBQSxRQUlqRCxPQUFBLEVBQVMsQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixLQUFwQixDQUp3QztBQUFBLFFBS2pELFlBQUEsRUFBYyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUxtQztPQUFuRCxFQVZzQztJQUFBLENBQXhDLENBN05BLENBQUE7QUFBQSxJQThPQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFlBQVYsQ0FBQTthQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBTixDQUFpQixPQUFqQixDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkMsRUFGeUM7SUFBQSxDQUEzQyxDQTlPQSxDQUFBO0FBQUEsSUFrUEEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxtQkFBVixDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFVBQU4sQ0FBaUIsT0FBakIsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLElBQXZDLENBREEsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLFNBRlYsQ0FBQTtBQUFBLE1BR0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxVQUFOLENBQWlCLE9BQWpCLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QyxDQUhBLENBQUE7QUFBQSxNQUlBLE9BQUEsR0FBVSxrQkFKVixDQUFBO2FBS0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxVQUFOLENBQWlCLE9BQWpCLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QyxFQU51QjtJQUFBLENBQXpCLENBbFBBLENBQUE7QUFBQSxJQTBQQSxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLHdCQUFWLENBQUE7YUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsT0FBcEIsQ0FBUCxDQUFvQyxDQUFDLE9BQXJDLENBQTZDO0FBQUEsUUFDM0MsU0FBQSxFQUFXLElBRGdDO0FBQUEsUUFFM0MsVUFBQSxFQUFZLElBRitCO0FBQUEsUUFHM0MsVUFBQSxFQUFZLENBQUMsUUFBRCxFQUFXLE1BQVgsRUFBbUIsT0FBbkIsQ0FIK0I7QUFBQSxRQUkzQyxPQUFBLEVBQVMsQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixLQUFwQixDQUprQztBQUFBLFFBSzNDLFlBQUEsRUFBYyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUw2QjtPQUE3QyxFQUZ3QztJQUFBLENBQTFDLENBMVBBLENBQUE7QUFBQSxJQW1RQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLFFBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLENBQVAsQ0FBb0MsQ0FBQyxPQUFyQyxDQUE2QztBQUFBLFFBQzNDLFNBQUEsRUFBVyxLQURnQztBQUFBLFFBRTNDLFVBQUEsRUFBWSxJQUYrQjtBQUFBLFFBRzNDLE9BQUEsRUFBUyxDQUFDLElBQUQsQ0FIa0M7QUFBQSxRQUkzQyxZQUFBLEVBQWMsQ0FBQyxDQUFELENBSjZCO09BQTdDLENBREEsQ0FBQTtBQUFBLE1BT0EsT0FBQSxHQUFVLFNBUFYsQ0FBQTtBQUFBLE1BUUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLENBQVAsQ0FBb0MsQ0FBQyxPQUFyQyxDQUE2QztBQUFBLFFBQzNDLFNBQUEsRUFBVyxLQURnQztBQUFBLFFBRTNDLFVBQUEsRUFBWSxLQUYrQjtBQUFBLFFBRzNDLE9BQUEsRUFBUyxDQUFDLEtBQUQsRUFBUSxLQUFSLENBSGtDO0FBQUEsUUFJM0MsWUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FKNkI7T0FBN0MsQ0FSQSxDQUFBO0FBQUEsTUFjQSxPQUFBLEdBQVUsa0JBZFYsQ0FBQTthQWVBLE1BQUEsQ0FBTyxLQUFLLENBQUMsYUFBTixDQUFvQixPQUFwQixDQUFQLENBQW9DLENBQUMsT0FBckMsQ0FBNkM7QUFBQSxRQUMzQyxTQUFBLEVBQVcsS0FEZ0M7QUFBQSxRQUUzQyxVQUFBLEVBQVksSUFGK0I7QUFBQSxRQUczQyxPQUFBLEVBQVMsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEVBQWYsQ0FIa0M7QUFBQSxRQUkzQyxZQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FKNkI7T0FBN0MsRUFoQnFCO0lBQUEsQ0FBdkIsQ0FuUUEsQ0FBQTtBQUFBLElBeVJBLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLG9CQUFOLENBQ0o7QUFBQSxRQUFBLFlBQUEsRUFBYyxDQUFkO0FBQUEsUUFBaUIsVUFBQSxFQUFZLEtBQTdCO0FBQUEsUUFBb0MsV0FBQSxFQUFhLENBQWpEO0FBQUEsUUFBb0QsU0FBQSxFQUFXLE9BQS9EO09BREksQ0FBTixDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsT0FBWixDQUFvQixhQUFwQixDQUZBLENBQUE7QUFBQSxNQUlBLEdBQUEsR0FBTSxLQUFLLENBQUMsb0JBQU4sQ0FDSjtBQUFBLFFBQUEsWUFBQSxFQUFjLENBQWQ7QUFBQSxRQUFpQixVQUFBLEVBQVksSUFBN0I7QUFBQSxRQUFtQyxXQUFBLEVBQWEsQ0FBaEQ7QUFBQSxRQUFtRCxTQUFBLEVBQVcsT0FBOUQ7T0FESSxDQUpOLENBQUE7QUFBQSxNQU1BLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLFdBQXBCLENBTkEsQ0FBQTtBQUFBLE1BUUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxvQkFBTixDQUNKO0FBQUEsUUFBQSxZQUFBLEVBQWMsQ0FBZDtBQUFBLFFBQWlCLFVBQUEsRUFBWSxJQUE3QjtBQUFBLFFBQW1DLFdBQUEsRUFBYSxDQUFoRDtBQUFBLFFBQW1ELFNBQUEsRUFBVyxNQUE5RDtPQURJLENBUk4sQ0FBQTtBQUFBLE1BVUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsT0FBcEIsQ0FWQSxDQUFBO0FBQUEsTUFZQSxHQUFBLEdBQU0sS0FBSyxDQUFDLG9CQUFOLENBQ0o7QUFBQSxRQUFBLFlBQUEsRUFBYyxDQUFkO0FBQUEsUUFBaUIsVUFBQSxFQUFZLElBQTdCO0FBQUEsUUFBbUMsWUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWpEO0FBQUEsUUFDQSxTQUFBLEVBQVcsTUFEWDtPQURJLENBWk4sQ0FBQTtBQUFBLE1BZUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0Isb0JBQXBCLENBZkEsQ0FBQTtBQUFBLE1BaUJBLEdBQUEsR0FBTSxLQUFLLENBQUMsb0JBQU4sQ0FDSjtBQUFBLFFBQUEsWUFBQSxFQUFjLENBQWQ7QUFBQSxRQUFpQixVQUFBLEVBQVksS0FBN0I7QUFBQSxRQUFvQyxXQUFBLEVBQWEsQ0FBakQ7QUFBQSxRQUNBLFNBQUEsRUFBVyxNQURYO0FBQUEsUUFDbUIsVUFBQSxFQUFZLENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsUUFBbkIsQ0FEL0I7T0FESSxDQWpCTixDQUFBO2FBb0JBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLHlCQUFwQixFQXJCMkI7SUFBQSxDQUE3QixDQXpSQSxDQUFBO0FBQUEsSUFnVEEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUNKO0FBQUEsUUFBQSxZQUFBLEVBQWMsQ0FBZDtBQUFBLFFBQWlCLFdBQUEsRUFBYSxDQUE5QjtBQUFBLFFBQWlDLFNBQUEsRUFBVyxPQUE1QztPQURJLENBQU4sQ0FBQTtBQUFBLE1BRUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsYUFBcEIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxHQUFBLEdBQU0sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsRUFBckIsRUFDSjtBQUFBLFFBQUEsWUFBQSxFQUFjLENBQWQ7QUFBQSxRQUFpQixVQUFBLEVBQVksSUFBN0I7QUFBQSxRQUFtQyxZQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBakQ7QUFBQSxRQUNBLFNBQUEsRUFBVyxPQURYO09BREksQ0FKTixDQUFBO2FBT0EsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLE9BQVosQ0FBb0Isa0JBQXBCLEVBUjJCO0lBQUEsQ0FBN0IsQ0FoVEEsQ0FBQTtBQUFBLElBMFRBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFDckIsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsQ0FBQyxJQUFELEVBQU8sU0FBUCxDQUFyQixFQUNKO0FBQUEsUUFBQSxZQUFBLEVBQWMsQ0FBZDtBQUFBLFFBQWlCLFVBQUEsRUFBWSxJQUE3QjtBQUFBLFFBQW1DLFlBQUEsRUFBYyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpEO09BREksQ0FBTixDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsT0FBWixDQUFvQixrQkFBcEIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxHQUFBLEdBQU0sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsQ0FBQyxJQUFELEVBQU8sU0FBUCxDQUFyQixFQUNKO0FBQUEsUUFBQSxZQUFBLEVBQWMsQ0FBZDtBQUFBLFFBQWlCLFlBQUEsRUFBYyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CO0FBQUEsUUFBd0MsVUFBQSxFQUFZLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FBcEQ7T0FESSxDQUpOLENBQUE7YUFNQSxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsT0FBWixDQUFvQixxQkFBcEIsRUFQcUI7SUFBQSxDQUF2QixDQTFUQSxDQUFBO0FBQUEsSUFtVUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLGFBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxFQUFQLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FDRTtBQUFBLFFBQUEsWUFBQSxFQUFjLENBQWQ7QUFBQSxRQUFpQixZQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FBL0I7QUFBQSxRQUNBLFVBQUEsRUFBWSxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLE9BQW5CLENBRFo7T0FIRixDQUFBO0FBQUEsTUFNQSxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQUssQ0FBQyxjQUFOLENBQXFCLEVBQXJCLEVBQXlCLE9BQXpCLENBQVYsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQUssQ0FBQyxvQkFBTixDQUEyQixPQUEzQixDQUFWLENBUEEsQ0FBQTtBQUFBLE1BUUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixPQUF6QixDQUFWLENBUkEsQ0FBQTthQVVBLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxPQUFiLENBQXFCLENBQ25CLGlCQURtQixFQUVuQixpQkFGbUIsRUFHbkIsaUJBSG1CLENBQXJCLEVBWDBCO0lBQUEsQ0FBNUIsQ0FuVUEsQ0FBQTtBQUFBLElBb1ZBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsVUFBQSxhQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sRUFBUCxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLFlBQUEsRUFBYyxDQUFkO0FBQUEsUUFBaUIsVUFBQSxFQUFZLElBQTdCO0FBQUEsUUFDQSxXQUFBLEVBQWEsQ0FEYjtBQUFBLFFBQ2dCLFNBQUEsRUFBVyxPQUQzQjtPQUhGLENBQUE7QUFBQSxNQU1BLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsRUFBckIsRUFBeUIsT0FBekIsQ0FBVixDQU5BLENBQUE7QUFBQSxNQU9BLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLG9CQUFOLENBQTJCLE9BQTNCLENBQVYsQ0FQQSxDQUFBO0FBQUEsTUFRQSxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQUssQ0FBQyxjQUFOLENBQXFCLEVBQXJCLEVBQXlCLE9BQXpCLENBQVYsQ0FSQSxDQUFBO2FBVUEsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLE9BQWIsQ0FBcUIsQ0FDbkIsZUFEbUIsRUFFbkIsZUFGbUIsRUFHbkIsZUFIbUIsQ0FBckIsRUFYMkM7SUFBQSxDQUE3QyxDQXBWQSxDQUFBO0FBQUEsSUFxV0EsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUEsR0FBQTtBQUNwQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxjQUFWLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsU0FBTixDQUFnQixPQUFoQixDQUFQLENBQWdDLENBQUMsT0FBakMsQ0FBeUMsYUFBekMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsYUFGVixDQUFBO0FBQUEsTUFHQSxNQUFBLENBQU8sS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBUCxDQUFnQyxDQUFDLE9BQWpDLENBQXlDLGFBQXpDLENBSEEsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLGtCQUpWLENBQUE7YUFLQSxNQUFBLENBQU8sS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBUCxDQUFnQyxDQUFDLE9BQWpDLENBQXlDLGFBQXpDLEVBTm9CO0lBQUEsQ0FBdEIsQ0FyV0EsQ0FBQTtBQUFBLElBNldBLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxhQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sYUFBUCxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsMEJBRFYsQ0FBQTtBQUFBLE1BRUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxZQUFOLENBQW1CLElBQW5CLENBQVAsQ0FBZ0MsQ0FBQyxPQUFqQyxDQUF5QyxJQUF6QyxDQUZBLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxxQ0FIVixDQUFBO0FBQUEsTUFJQSxNQUFBLENBQU8sS0FBSyxDQUFDLFlBQU4sQ0FBbUIsT0FBbkIsQ0FBUCxDQUFtQyxDQUFDLE9BQXBDLENBQTRDLElBQTVDLENBSkEsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLHFDQUxWLENBQUE7YUFNQSxNQUFBLENBQU8sS0FBSyxDQUFDLFlBQU4sQ0FBbUIsT0FBbkIsQ0FBUCxDQUFtQyxDQUFDLE9BQXBDLENBQTRDLElBQTVDLEVBUG1CO0lBQUEsQ0FBckIsQ0E3V0EsQ0FBQTtBQUFBLElBc1hBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7YUFDM0MsTUFBQSxDQUFPLEtBQUssQ0FBQyxXQUFOLENBQWtCLFNBQWxCLENBQVAsQ0FBb0MsQ0FBQyxPQUFyQyxDQUE2QyxTQUE3QyxFQUQyQztJQUFBLENBQTdDLENBdFhBLENBQUE7QUFBQSxJQXlYQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFVBQUEsWUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBUCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsdUJBQWxCLENBRFQsQ0FBQTthQUVBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxPQUFmLENBQXdCLFNBQUEsR0FBUyxJQUFJLENBQUMsSUFBZCxHQUFtQixHQUFuQixHQUFzQixJQUFJLENBQUMsS0FBbkQsRUFIeUM7SUFBQSxDQUEzQyxDQXpYQSxDQUFBO0FBQUEsSUE4WEEsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtBQUN0QixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxzQ0FBVixDQUFBO2FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFOLENBQWUsT0FBZixFQUF3QjtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUFnQixJQUFBLEVBQU0saUJBQXRCO09BQXhCLENBQVAsQ0FDRSxDQUFDLE9BREgsQ0FDVyw2Q0FEWCxFQUZzQjtJQUFBLENBQXhCLENBOVhBLENBQUE7QUFBQSxJQW1ZQSxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLDJDQUFWLENBQUE7YUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFFBQU4sQ0FBZSxPQUFmLEVBQXdCO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBTDtBQUFBLFFBQVcsS0FBQSxFQUFPLEVBQWxCO09BQXhCLENBQVAsQ0FDRSxDQUFDLE9BREgsQ0FDVyxpQ0FEWCxFQUZ3QztJQUFBLENBQTFDLENBbllBLENBQUE7QUFBQSxJQXdZQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2FBQ3pCLE1BQUEsQ0FBTyxLQUFLLENBQUMsY0FBTixDQUFBLENBQVAsQ0FBOEIsQ0FBQyxPQUEvQixDQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsaUJBQWpDLENBREYsRUFEeUI7SUFBQSxDQUEzQixDQXhZQSxDQUFBO1dBNFlBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxpQkFBakMsQ0FBUCxDQUFBO2FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLGVBQXJCLENBQVAsQ0FBNkMsQ0FBQyxPQUE5QyxDQUNFLEVBQUEsR0FBRyxJQUFILEdBQVEsZ0JBRFYsRUFGaUM7SUFBQSxDQUFuQyxFQTdZZ0I7RUFBQSxDQUFsQixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/utils-spec.coffee
