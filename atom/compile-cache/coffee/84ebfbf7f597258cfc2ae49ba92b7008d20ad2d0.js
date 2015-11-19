(function() {
  var cmds;

  cmds = require("../lib/commands");

  describe("commands", function() {
    it("correct top level order list numbers", function() {
      var expected, fixture;
      fixture = ["3. abc", "9. efg", "0. hij", "  1. k l m", "7. opq", "rst"];
      expected = ["3. abc", "4. efg", "5. hij", "  1. k l m", "6. opq", "rst"];
      return expect(cmds._correctOrderNumbers(fixture)).toEqual(expected);
    });
    it("correct sub-level order list numbers", function() {
      var expected, fixture;
      fixture = ["  1. abc", "    efg", "  9. hij", "    1. klm", "  9. opq"];
      expected = ["  1. abc", "    efg", "  2. hij", "    1. klm", "  3. opq"];
      return expect(cmds._correctOrderNumbers(fixture)).toEqual(expected);
    });
    it("find the first column in table row", function() {
      var fixture;
      fixture = "hd 1 | hd 2 | hd 3";
      expect(cmds._findNextTableCellIdx(fixture, 0)).toEqual(4);
      expect(cmds._findNextTableCellIdx(fixture, 6)).toEqual(11);
      return expect(cmds._findNextTableCellIdx(fixture, 13)).toEqual(19);
    });
    it("find the first non empty line index", function() {
      var fixture;
      fixture = ["", ""];
      expect(cmds._indexOfFirstNonEmptyLine(fixture)).toEqual(-1);
      fixture = ["abc"];
      expect(cmds._indexOfFirstNonEmptyLine(fixture)).toEqual(0);
      fixture = ["", "abc"];
      return expect(cmds._indexOfFirstNonEmptyLine(fixture)).toEqual(1);
    });
    it("parse table to rows + options", function() {
      var expected, fixture;
      fixture = "h1   | h21\n-----|----\nt123 | t2";
      expected = {
        rows: [["h1", "h21"], ["t123", "t2"]],
        options: {
          numOfColumns: 2,
          extraPipes: false,
          columnWidths: [5, 4],
          alignment: "empty",
          alignments: ["empty", "empty"]
        }
      };
      return expect(cmds._parseTable(fixture.split("\n"))).toEqual(expected);
    });
    it("parse table with empty cell to rows + options", function() {
      var expected, fixture;
      fixture = "|h1   | h2-1|h3-2\n|:-|:-:|--:\n| | t2";
      expected = {
        rows: [["h1", "h2-1", "h3-2"], ["", "t2"]],
        options: {
          numOfColumns: 3,
          extraPipes: true,
          columnWidths: [4, 6, 6],
          alignment: "empty",
          alignments: ["left", "center", "right"]
        }
      };
      return expect(cmds._parseTable(fixture.split("\n"))).toEqual(expected);
    });
    it("create table text", function() {
      var options, rows;
      rows = [["h1", "h2"], ["t123", "t2"]];
      options = {
        numOfColumns: 2,
        extraPipes: false,
        columnWidths: [5, 3],
        alignment: "empty",
        alignments: ["empty", "empty"]
      };
      return expect(cmds._createTable(rows, options)).toEqual("h1   | h2\n-----|---\nt123 | t2");
    });
    return it("create table text with empty cells", function() {
      var options, rows;
      rows = [["h1", "h2-1", "h3-2"], ["", "t2"]];
      options = {
        numOfColumns: 3,
        extraPipes: true,
        columnWidths: [4, 6, 6],
        alignment: "empty",
        alignments: ["left", "center", "right"]
      };
      return expect(cmds._createTable(rows, options)).toEqual("| h1 | h2-1 | h3-2 |\n|:---|:----:|-----:|\n|    |  t2  |      |");
    });
  });

}).call(this);
