(function() {
  var FormatText;

  FormatText = require("../../lib/commands/format-text");

  describe("FormatText", function() {
    var editor, formatText, _ref;
    _ref = [], editor = _ref[0], formatText = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe("correctOrderListNumbers", function() {
      beforeEach(function() {
        return formatText = new FormatText("correct-order-list-numbers");
      });
      it("does nothing if it is not an order list", function() {
        editor.setText("text is a long paragraph\ntext is a long paragraph");
        editor.setCursorBufferPosition([0, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text is a long paragraph\ntext is a long paragraph");
      });
      return it("correct order list numbers", function() {
        editor.setText("text before\n\n3. aaa\n9. bbb\n0. ccc\n  9. aaa\n    - aaa\n  1. bbb\n  1. ccc\n    0. aaa\n      7. aaa\n        - aaa\n        - bbb\n    9. bbb\n  4. ddd\n7. ddd\n7. eee\n\ntext after");
        editor.setCursorBufferPosition([5, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text before\n\n1. aaa\n2. bbb\n3. ccc\n  1. aaa\n    - aaa\n  2. bbb\n  3. ccc\n    1. aaa\n      1. aaa\n        - aaa\n        - bbb\n    2. bbb\n  4. ddd\n4. ddd\n5. eee\n\ntext after");
      });
    });
    return describe("formatTable", function() {
      beforeEach(function() {
        return formatText = new FormatText("format-table");
      });
      it("does nothing if it is not a table", function() {
        editor.setText("text is a long paragraph\ntext is a long paragraph");
        editor.setCursorBufferPosition([0, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text is a long paragraph\ntext is a long paragraph");
      });
      it("format table without alignment", function() {
        var expected;
        editor.setText("text before\n\nh1| h21|h1233|h343\n-|-\n|||\nt123           | t2\n |t12|\n\ntext after");
        expected = "text before\n\nh1   | h21 | h1233 | h343\n-----|-----|-------|-----\n     |     |       |\nt123 | t2  |       |\n     | t12 |       |\n\ntext after";
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe(expected);
      });
      return it("format table with alignment", function() {
        var expected;
        editor.setText("text before\n\n|h1-3   | h2-1|h3-2|\n|:-|:-:|--:|:-:|\n| | t2\n|t1| |t3\n|t     |t|    t\n\ntext after");
        expected = "text before\n\n| h1-3 | h2-1 | h3-2 |   |\n|:-----|:----:|-----:|:-:|\n|      |  t2  |      |   |\n| t1   |      |   t3 |   |\n| t    |  t   |    t |   |\n\ntext after";
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe(expected);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvZm9ybWF0LXRleHQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0NBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEsd0JBQUE7QUFBQSxJQUFBLE9BQXVCLEVBQXZCLEVBQUMsZ0JBQUQsRUFBUyxvQkFBVCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEIsRUFBSDtNQUFBLENBQWhCLENBQUEsQ0FBQTthQUNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBQVo7TUFBQSxDQUFMLEVBRlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBTUEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFBRyxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLDRCQUFYLEVBQXBCO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUVBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBLEdBQUE7QUFDNUMsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLG9EQUFmLENBQUEsQ0FBQTtBQUFBLFFBSUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FKQSxDQUFB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/spec/commands/format-text-spec.coffee
