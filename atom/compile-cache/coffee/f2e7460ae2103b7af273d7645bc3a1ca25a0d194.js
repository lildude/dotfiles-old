(function() {
  var cmds;

  cmds = require("../lib/commands");

  describe("commands", function() {
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
    it("parse table into vals", function() {
      var expected, fixture;
      fixture = "h1   | h21\n-----|----\nt123 | t2";
      expected = {
        table: [["h1", "h21"], ["t123", "t2"]],
        maxes: [4, 3]
      };
      return expect(cmds._parseTable(fixture.split("\n"))).toEqual(expected);
    });
    it("parse table with empty cell into vals", function() {
      var expected, fixture;
      fixture = "h1   | h2-1\n-----|----\n | t2";
      expected = {
        table: [["h1", "h2-1"], ["", "t2"]],
        maxes: [2, 4]
      };
      return expect(cmds._parseTable(fixture.split("\n"))).toEqual(expected);
    });
    it("create table row text", function() {
      var maxes, vals;
      vals = ["h1", "h2", "x y z"];
      maxes = [3, 2, 5];
      return expect(cmds._createTableRow(vals, maxes, " | ")).toEqual("h1  | h2 | x y z");
    });
    return it("create table text", function() {
      var maxes, vals;
      vals = [["h1", "h21"], ["t123", "t2"]];
      maxes = [4, 3];
      return expect(cmds._createTable({
        table: vals,
        maxes: maxes
      })).toEqual("h1   | h21\n-----|----\nt123 | t2");
    });
  });

}).call(this);
