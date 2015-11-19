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
    return it("create correct table", function() {
      var table;
      table = this.view.createTable(2, 2);
      expect(table).toEqual(["   |   ", "---|---", "   |   "].join("\n"));
      table = this.view.createTable(3, 3);
      return expect(table).toEqual(["   |   |   ", "---|---|---", "   |   |   ", "   |   |   "].join("\n"));
    });
  });

}).call(this);
