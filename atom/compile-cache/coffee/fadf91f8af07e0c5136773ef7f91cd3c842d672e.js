(function() {
  var InsertTableView;

  InsertTableView = require("../../lib/views/insert-table-view");

  describe("InsertTableView", function() {
    var insertTableView;
    insertTableView = null;
    beforeEach(function() {
      return insertTableView = new InsertTableView({});
    });
    it("validates table rows/columns", function() {
      expect(insertTableView.isValidRange(1, 1)).toBe(false);
      return expect(insertTableView.isValidRange(2, 2)).toBe(true);
    });
    describe("tableExtraPipes disabled", function() {
      it("create correct (2,2) table", function() {
        var table;
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["  |  ", "--|--", "  |  "].join("\n"));
      });
      return it("create correct (3,4) table", function() {
        var table;
        table = insertTableView.createTable(3, 4);
        return expect(table).toEqual(["  |   |   |  ", "--|---|---|--", "  |   |   |  ", "  |   |   |  "].join("\n"));
      });
    });
    describe("tableExtraPipes enabled", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.tableExtraPipes", true);
      });
      it("create correct (2,2) table", function() {
        var table;
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|---|---|", "|   |   |"].join("\n"));
      });
      return it("create correct (3,4) table", function() {
        var table;
        table = insertTableView.createTable(3, 4);
        return expect(table).toEqual(["|   |   |   |   |", "|---|---|---|---|", "|   |   |   |   |", "|   |   |   |   |"].join("\n"));
      });
    });
    return describe("tableAlignment has set", function() {
      it("create correct (2,2) table (center)", function() {
        var table;
        atom.config.set("markdown-writer.tableAlignment", "center");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["  |  ", "::|::", "  |  "].join("\n"));
      });
      it("create correct (2,2) table (left)", function() {
        var table;
        atom.config.set("markdown-writer.tableExtraPipes", true);
        atom.config.set("markdown-writer.tableAlignment", "left");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|:--|:--|", "|   |   |"].join("\n"));
      });
      return it("create correct (2,2) table (right)", function() {
        var table;
        atom.config.set("markdown-writer.tableExtraPipes", true);
        atom.config.set("markdown-writer.tableAlignment", "right");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|--:|--:|", "|   |   |"].join("\n"));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdmlld3MvaW5zZXJ0LXRhYmxlLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZUFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG1DQUFSLENBQWxCLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsZUFBQTtBQUFBLElBQUEsZUFBQSxHQUFrQixJQUFsQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQUcsZUFBQSxHQUFzQixJQUFBLGVBQUEsQ0FBZ0IsRUFBaEIsRUFBekI7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBSUEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxNQUFBLE1BQUEsQ0FBTyxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsQ0FBUCxDQUEwQyxDQUFDLElBQTNDLENBQWdELEtBQWhELENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsQ0FBUCxDQUEwQyxDQUFDLElBQTNDLENBQWdELElBQWhELEVBRmlDO0lBQUEsQ0FBbkMsQ0FKQSxDQUFBO0FBQUEsSUFRQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLE1BQUEsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtBQUMvQixZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxlQUFlLENBQUMsV0FBaEIsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBUixDQUFBO2VBQ0EsTUFBQSxDQUFPLEtB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/views/insert-table-view-spec.coffee
