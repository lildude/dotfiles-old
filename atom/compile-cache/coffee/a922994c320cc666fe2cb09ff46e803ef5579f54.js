(function() {
  var WhiteCursor;

  WhiteCursor = require('../lib/white-cursor');

  describe('White Cursor', function() {
    var workspaceElement;
    workspaceElement = [][0];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('white-cursor');
      });
    });
    describe('toggle command', function() {
      return it('toggles the white cursor', function() {
        workspaceElement.classList.remove('white-cursor');
        atom.commands.dispatch(workspaceElement, 'white-cursor:toggle');
        expect(workspaceElement).toMatchSelector('.white-cursor');
        atom.commands.dispatch(workspaceElement, 'white-cursor:toggle');
        return expect(workspaceElement).not.toMatchSelector('.white-cursor');
      });
    });
    describe('detect dark syntax', function() {
      beforeEach(function() {
        return atom.config.set('white-cursor.enabled', 'detect');
      });
      describe('the test infrastructure', function() {
        return it('does not have any themes by default', function() {
          var name, _i, _len, _ref, _results;
          _ref = workspaceElement.classList;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            name = _ref[_i];
            _results.push(expect(name).not.toMatch(/theme/));
          }
          return _results;
        });
      });
      it('adds the white-cursor class if a dark syntax theme is loaded', function() {
        workspaceElement.classList.add('theme-test-dark-syntax');
        atom.themes.emitter.emit('did-reload-all');
        return expect(workspaceElement).toMatchSelector('.white-cursor');
      });
      return it('removes the white-cursor class if a dark syntax theme is unloaded', function() {
        workspaceElement.classList.add('white-cursor');
        atom.themes.emitter.emit('did-reload-all');
        return expect(workspaceElement).not.toMatchSelector('.white-cursor');
      });
    });
    return describe('configuration', function() {
      it('enables the white cursor if configuration is set to always', function() {
        atom.config.set('white-cursor.enabled', 'always');
        workspaceElement.classList.remove('white-cursor');
        atom.themes.emitter.emit('did-reload-all');
        return expect(workspaceElement).toMatchSelector('.white-cursor');
      });
      it('disables the white cursor if configuration is set to never', function() {
        atom.config.set('white-cursor.enabled', 'never');
        workspaceElement.classList.add('theme-test-dark-syntax');
        atom.themes.emitter.emit('did-reload-all');
        return expect(workspaceElement).not.toMatchSelector('.white-cursor');
      });
      it('enables the white cursor if a theme matches the configuration', function() {
        atom.config.set('white-cursor', {
          enabled: 'detect',
          darkThemes: ['test-theme']
        });
        workspaceElement.classList.add('theme-test-theme');
        atom.themes.emitter.emit('did-reload-all');
        return expect(workspaceElement).toMatchSelector('.white-cursor');
      });
      it('disables the white cursor if never is set even if a theme matches configuration', function() {
        atom.config.set('white-cursor', {
          enabled: 'never',
          darkThemes: ['test-theme']
        });
        workspaceElement.classList.add('theme-test-theme');
        atom.themes.emitter.emit('did-reload-all');
        return expect(workspaceElement).not.toMatchSelector('.white-cursor');
      });
      it('updates if the enabled configuration option is changed', function() {
        atom.config.set('white-cursor.enabled', 'never');
        workspaceElement.classList.add('theme-test-dark-syntax');
        atom.themes.emitter.emit('did-reload-all');
        expect(workspaceElement).not.toMatchSelector('.white-cursor');
        atom.config.set('white-cursor.enabled', 'always');
        return expect(workspaceElement).toMatchSelector('.white-cursor');
      });
      return it('updates if the dark themes list is changed', function() {
        spyOn(WhiteCursor, 'update');
        atom.config.set('white-cursor.darkThemes', ['foo']);
        return expect(WhiteCursor.update).toHaveBeenCalled();
      });
    });
  });

}).call(this);
