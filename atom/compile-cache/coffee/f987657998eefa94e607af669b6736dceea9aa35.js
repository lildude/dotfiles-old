(function() {
  var InsertTableView;

  InsertTableView = require("../lib/insert-table-view");

  describe("InsertTableView", function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return this.view = new InsertTableView({});
    });
    it("validates table rows/columns", function() {
      expect(this.view.isValidRange(1, 1)).toBe(false);
      return expect(this.view.isValidRange(2, 2)).toBe(true);
    });
    it("create correct table row", function() {
      var row;
      row = this.view.createTableRow(3, {
        beg: " |",
        mid: " |",
        end: " "
      });
      expect(row).toEqual(" | | ");
      row = this.view.createTableRow(3, {
        beg: "-|",
        mid: "-|",
        end: "-"
      });
      return expect(row).toEqual("-|-|-");
    });
    return it("create correct table", function() {
      var table;
      table = this.view.createTable(2, 2);
      expect(table).toEqual(" |\n-|-\n |");
      table = this.view.createTable(2, 3);
      return expect(table).toEqual(" | |\n-|-|-\n | |");
    });
  });

}).call(this);
