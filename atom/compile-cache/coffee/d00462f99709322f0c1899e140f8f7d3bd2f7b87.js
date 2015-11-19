(function() {
  var Navigator;

  Navigator = (function() {
    function Navigator(separatorMarker) {
      var _ref;
      this.separatorMarker = separatorMarker;
      _ref = [null, null, null], this.conflict = _ref[0], this.previous = _ref[1], this.next = _ref[2];
    }

    Navigator.prototype.linkToPrevious = function(c) {
      this.previous = c;
      if (c != null) {
        return c.navigator.next = this.conflict;
      }
    };

    Navigator.prototype.nextUnresolved = function() {
      var current;
      current = this.next;
      while ((current != null) && current.isResolved()) {
        current = current.navigator.next;
      }
      return current;
    };

    Navigator.prototype.previousUnresolved = function() {
      var current;
      current = this.previous;
      while ((current != null) && current.isResolved()) {
        current = current.navigator.previous;
      }
      return current;
    };

    Navigator.prototype.markers = function() {
      return [this.separatorMarker];
    };

    return Navigator;

  })();

  module.exports = {
    Navigator: Navigator
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9uYXZpZ2F0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFNBQUE7O0FBQUEsRUFBTTtBQUVTLElBQUEsbUJBQUUsZUFBRixHQUFBO0FBQ1gsVUFBQSxJQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsa0JBQUEsZUFDYixDQUFBO0FBQUEsTUFBQSxPQUFnQyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUFoQyxFQUFDLElBQUMsQ0FBQSxrQkFBRixFQUFZLElBQUMsQ0FBQSxrQkFBYixFQUF1QixJQUFDLENBQUEsY0FBeEIsQ0FEVztJQUFBLENBQWI7O0FBQUEsd0JBR0EsY0FBQSxHQUFnQixTQUFDLENBQUQsR0FBQTtBQUNkLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFaLENBQUE7QUFDQSxNQUFBLElBQWdDLFNBQWhDO2VBQUEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFaLEdBQW1CLElBQUMsQ0FBQSxTQUFwQjtPQUZjO0lBQUEsQ0FIaEIsQ0FBQTs7QUFBQSx3QkFPQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxJQUFYLENBQUE7QUFDQSxhQUFNLGlCQUFBLElBQWEsT0FBTyxDQUFDLFVBQVIsQ0FBQSxDQUFuQixHQUFBO0FBQ0UsUUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUE1QixDQURGO01BQUEsQ0FEQTthQUdBLFFBSmM7SUFBQSxDQVBoQixDQUFBOztBQUFBLHdCQWFBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTtBQUNsQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsUUFBWCxDQUFBO0FBQ0EsYUFBTSxpQkFBQSxJQUFhLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBbkIsR0FBQTtBQUNFLFFBQUEsT0FBQSxHQUFVLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBNUIsQ0FERjtNQUFBLENBREE7YUFHQSxRQUprQjtJQUFBLENBYnBCLENBQUE7O0FBQUEsd0JBbUJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxDQUFDLElBQUMsQ0FBQSxlQUFGLEVBQUg7SUFBQSxDQW5CVCxDQUFBOztxQkFBQTs7TUFGRixDQUFBOztBQUFBLEVBdUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFYO0dBeEJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/navigator.coffee
