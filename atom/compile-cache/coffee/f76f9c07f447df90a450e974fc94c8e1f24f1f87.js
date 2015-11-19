(function() {
  var Conflict, NavigationView, util;

  NavigationView = require('../../lib/view/navigation-view').NavigationView;

  Conflict = require('../../lib/conflict').Conflict;

  util = require('../util');

  describe('NavigationView', function() {
    var conflict, conflicts, editor, editorView, view, _ref;
    _ref = [], view = _ref[0], editorView = _ref[1], editor = _ref[2], conflicts = _ref[3], conflict = _ref[4];
    beforeEach(function() {
      return util.openPath("triple-2way-diff.txt", function(v) {
        editorView = v;
        editor = editorView.getModel();
        conflicts = Conflict.all({}, editor);
        conflict = conflicts[1];
        return view = new NavigationView(conflict.navigator, editor);
      });
    });
    it('deletes the separator line on resolution', function() {
      var c, text, _i, _len;
      for (_i = 0, _len = conflicts.length; _i < _len; _i++) {
        c = conflicts[_i];
        c.ours.resolve();
      }
      text = editor.getText();
      return expect(text).not.toContain("My middle changes\n=======\nYour middle changes");
    });
    it('scrolls to the next diff', function() {
      var p;
      spyOn(editor, "setCursorBufferPosition");
      view.down();
      p = conflicts[2].ours.marker.getTailBufferPosition();
      return expect(editor.setCursorBufferPosition).toHaveBeenCalledWith(p);
    });
    return it('scrolls to the previous diff', function() {
      var p;
      spyOn(editor, "setCursorBufferPosition");
      view.up();
      p = conflicts[0].ours.marker.getTailBufferPosition();
      return expect(editor.setCursorBufferPosition).toHaveBeenCalledWith(p);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL3NwZWMvdmlldy9uYXZpZ2F0aW9uLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLGdDQUFSLEVBQWxCLGNBQUQsQ0FBQTs7QUFBQSxFQUVDLFdBQVksT0FBQSxDQUFRLG9CQUFSLEVBQVosUUFGRCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxtREFBQTtBQUFBLElBQUEsT0FBa0QsRUFBbEQsRUFBQyxjQUFELEVBQU8sb0JBQVAsRUFBbUIsZ0JBQW5CLEVBQTJCLG1CQUEzQixFQUFzQyxrQkFBdEMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULElBQUksQ0FBQyxRQUFMLENBQWMsc0JBQWQsRUFBc0MsU0FBQyxDQUFELEdBQUE7QUFDcEMsUUFBQSxVQUFBLEdBQWEsQ0FBYixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsVUFBVSxDQUFDLFFBQVgsQ0FBQSxDQURULENBQUE7QUFBQSxRQUVBLFNBQUEsR0FBWSxRQUFRLENBQUMsR0FBVCxDQUFhLEVBQWIsRUFBaUIsTUFBakIsQ0FGWixDQUFBO0FBQUEsUUFHQSxRQUFBLEdBQVcsU0FBVSxDQUFBLENBQUEsQ0FIckIsQ0FBQTtlQUtBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxRQUFRLENBQUMsU0FBeEIsRUFBbUMsTUFBbkMsRUFOeUI7TUFBQSxDQUF0QyxFQURTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVdBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsVUFBQSxpQkFBQTtBQUFBLFdBQUEsZ0RBQUE7MEJBQUE7QUFBQSxRQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFBLENBQUEsQ0FBQTtBQUFBLE9BQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBRFAsQ0FBQTthQUVBLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxHQUFHLENBQUMsU0FBakIsQ0FBMkIsaURBQTNCLEVBSDZDO0lBQUEsQ0FBL0MsQ0FYQSxDQUFBO0FBQUEsSUFnQkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLENBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxNQUFOLEVBQWMseUJBQWQsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsSUFBTCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsQ0FBQSxHQUFJLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUF6QixDQUFBLENBRkosQ0FBQTthQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQWQsQ0FBc0MsQ0FBQyxvQkFBdkMsQ0FBNEQsQ0FBNUQsRUFKNkI7SUFBQSxDQUEvQixDQWhCQSxDQUFBO1dBc0JBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsVUFBQSxDQUFBO0FBQUEsTUFBQSxLQUFBLENBQU0sTUFBTixFQUFjLHlCQUFkLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLEVBQUwsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLENBQUEsR0FBSSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBekIsQ0FBQSxDQUZKLENBQUE7YUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFkLENBQXNDLENBQUMsb0JBQXZDLENBQTRELENBQTVELEVBSmlDO0lBQUEsQ0FBbkMsRUF2QnlCO0VBQUEsQ0FBM0IsQ0FMQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/spec/view/navigation-view-spec.coffee
