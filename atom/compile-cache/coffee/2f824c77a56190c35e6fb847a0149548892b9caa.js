(function() {
  var Emitter;

  Emitter = require('atom').Emitter;

  module.exports = {
    openPath: function(path, callback) {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open(path);
      });
      return runs(function() {
        return callback(atom.views.getView(atom.workspace.getActivePaneItem()));
      });
    },
    rowRangeFrom: function(marker) {
      return [marker.getTailBufferPosition().row, marker.getHeadBufferPosition().row];
    },
    pkgEmitter: function() {
      var emitter;
      emitter = new Emitter;
      return {
        onDidResolveConflict: function(callback) {
          return emitter.on('did-resolve-conflict', callback);
        },
        didResolveConflict: function(event) {
          return emitter.emit('did-resolve-conflict', event);
        },
        onDidStageFile: function(callback) {
          return emitter.on('did-stage-file', callback);
        },
        didStageFile: function(event) {
          return emitter.emit('did-stage-file', event);
        },
        onDidQuitConflictResolution: function(callback) {
          return emitter.on('did-quit-conflict-resolution', callback);
        },
        didQuitConflictResolution: function() {
          return emitter.emit('did-quit-conflict-resolution');
        },
        onDidCompleteConflictResolution: function(callback) {
          return emitter.on('did-complete-conflict-resolution', callback);
        },
        didCompleteConflictResolution: function() {
          return emitter.emit('did-complete-conflict-resolution');
        },
        dispose: function() {
          return emitter.dispose();
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL3NwZWMvdXRpbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxHQUFBO0FBQ1IsVUFBQSxnQkFBQTtBQUFBLE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FEQSxDQUFBO0FBQUEsTUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQixFQUFIO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO2FBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUNILFFBQUEsQ0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQW5CLENBQVQsRUFERztNQUFBLENBQUwsRUFOUTtJQUFBLENBQVY7QUFBQSxJQVNBLFlBQUEsRUFBYyxTQUFDLE1BQUQsR0FBQTthQUNaLENBQUMsTUFBTSxDQUFDLHFCQUFQLENBQUEsQ0FBOEIsQ0FBQyxHQUFoQyxFQUFxQyxNQUFNLENBQUMscUJBQVAsQ0FBQSxDQUE4QixDQUFDLEdBQXBFLEVBRFk7SUFBQSxDQVRkO0FBQUEsSUFZQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsR0FBQSxDQUFBLE9BQVYsQ0FBQTtBQUVBLGFBQU87QUFBQSxRQUNMLG9CQUFBLEVBQXNCLFNBQUMsUUFBRCxHQUFBO2lCQUFjLE9BQU8sQ0FBQyxFQUFSLENBQVcsc0JBQVgsRUFBbUMsUUFBbkMsRUFBZDtRQUFBLENBRGpCO0FBQUEsUUFFTCxrQkFBQSxFQUFvQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxPQUFPLENBQUMsSUFBUixDQUFhLHNCQUFiLEVBQXFDLEtBQXJDLEVBQVg7UUFBQSxDQUZmO0FBQUEsUUFHTCxjQUFBLEVBQWdCLFNBQUMsUUFBRCxHQUFBO2lCQUFjLE9BQU8sQ0FBQyxFQUFSLENBQVcsZ0JBQVgsRUFBNkIsUUFBN0IsRUFBZDtRQUFBLENBSFg7QUFBQSxRQUlMLFlBQUEsRUFBYyxTQUFDLEtBQUQsR0FBQTtpQkFBVyxPQUFPLENBQUMsSUFBUixDQUFhLGdCQUFiLEVBQStCLEtBQS9CLEVBQVg7UUFBQSxDQUpUO0FBQUEsUUFLTCwyQkFBQSxFQUE2QixTQUFDLFFBQUQsR0FBQTtpQkFBYyxPQUFPLENBQUMsRUFBUixDQUFXLDhCQUFYLEVBQTJDLFFBQTNDLEVBQWQ7UUFBQSxDQUx4QjtBQUFBLFFBTUwseUJBQUEsRUFBMkIsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxJQUFSLENBQWEsOEJBQWIsRUFBSDtRQUFBLENBTnRCO0FBQUEsUUFPTCwrQkFBQSxFQUFpQyxTQUFDLFFBQUQsR0FBQTtpQkFBYyxPQUFPLENBQUMsRUFBUixDQUFXLGtDQUFYLEVBQStDLFFBQS9DLEVBQWQ7UUFBQSxDQVA1QjtBQUFBLFFBUUwsNkJBQUEsRUFBK0IsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0NBQWIsRUFBSDtRQUFBLENBUjFCO0FBQUEsUUFTTCxPQUFBLEVBQVMsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxPQUFSLENBQUEsRUFBSDtRQUFBLENBVEo7T0FBUCxDQUhVO0lBQUEsQ0FaWjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/spec/util.coffee
