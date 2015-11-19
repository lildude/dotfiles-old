(function() {
  var NotationalVelocity, WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  NotationalVelocity = require('../lib/notational-velocity');

  describe("NotationalVelocity", function() {
    var activationPromise, defaultDirectory;
    defaultDirectory = atom.config.get('notational-velocity.directory');
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      activationPromise = atom.packages.activatePackage('notational-velocity');
      return atom.config.set('notational-velocity.directory', 'testdata');
    });
    afterEach(function() {
      return atom.config.set('notational-velocity.directory', defaultDirectory);
    });
    return describe("when the notational-velocity:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.notational-velocity')).not.toExist();
        atom.commands.dispatch(atom.workspaceView.element, 'notational-velocity:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.notational-velocity')).toExist();
          return atom.commands.dispatch(atom.workspaceView.element, 'notational-velocity:toggle');
        });
      });
    });
  });

}).call(this);
