(function() {
  var Minimap, TextEditor;

  TextEditor = require('atom').TextEditor;

  Minimap = require('../lib/minimap');

  describe('Minimap package', function() {
    var editor, editorElement, minimap, minimapElement, minimapPackage, workspaceElement, _ref;
    _ref = [], editor = _ref[0], minimap = _ref[1], editorElement = _ref[2], minimapElement = _ref[3], workspaceElement = _ref[4], minimapPackage = _ref[5];
    beforeEach(function() {
      atom.config.set('minimap.autoToggle', true);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open('sample.coffee');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap').then(function(pkg) {
          return minimapPackage = pkg.mainModule;
        });
      });
      waitsFor(function() {
        return workspaceElement.querySelector('atom-text-editor');
      });
      runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
      return waitsFor(function() {
        return workspaceElement.querySelector('atom-text-editor::shadow atom-text-editor-minimap');
      });
    });
    it('registers the minimap views provider', function() {
      var textEditor;
      textEditor = new TextEditor({});
      minimap = new Minimap({
        textEditor: textEditor
      });
      minimapElement = atom.views.getView(minimap);
      return expect(minimapElement).toExist();
    });
    describe('when an editor is opened', function() {
      it('creates a minimap model for the editor', function() {
        return expect(minimapPackage.minimapForEditor(editor)).toBeDefined();
      });
      return it('attaches a minimap element to the editor view', function() {
        return expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).toExist();
      });
    });
    describe('::observeMinimaps', function() {
      var spy;
      spy = [][0];
      beforeEach(function() {
        spy = jasmine.createSpy('observeMinimaps');
        return minimapPackage.observeMinimaps(spy);
      });
      it('calls the callback with the existing minimaps', function() {
        return expect(spy).toHaveBeenCalled();
      });
      return it('calls the callback when a new editor is opened', function() {
        waitsForPromise(function() {
          return atom.workspace.open('other-sample.js');
        });
        return runs(function() {
          return expect(spy.calls.length).toEqual(2);
        });
      });
    });
    describe('::deactivate', function() {
      beforeEach(function() {
        return minimapPackage.deactivate();
      });
      it('destroys all the minimap models', function() {
        return expect(minimapPackage.editorsMinimaps).toBeUndefined();
      });
      return it('destroys all the minimap elements', function() {
        return expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).not.toExist();
      });
    });
    describe('service', function() {
      return it('returns the minimap main module', function() {
        return expect(minimapPackage.provideMinimapServiceV1()).toEqual(minimapPackage);
      });
    });
    return describe('plugins', function() {
      var plugin, registerHandler, unregisterHandler, _ref1;
      _ref1 = [], registerHandler = _ref1[0], unregisterHandler = _ref1[1], plugin = _ref1[2];
      beforeEach(function() {
        atom.config.set('minimap.displayPluginsControls', true);
        atom.config.set('minimap.plugins.dummy', void 0);
        plugin = {
          active: false,
          activatePlugin: function() {
            return this.active = true;
          },
          deactivatePlugin: function() {
            return this.active = false;
          },
          isActive: function() {
            return this.active;
          }
        };
        spyOn(plugin, 'activatePlugin').andCallThrough();
        spyOn(plugin, 'deactivatePlugin').andCallThrough();
        registerHandler = jasmine.createSpy('register handler');
        return unregisterHandler = jasmine.createSpy('unregister handler');
      });
      describe('when registered', function() {
        beforeEach(function() {
          minimapPackage.onDidAddPlugin(registerHandler);
          return minimapPackage.registerPlugin('dummy', plugin);
        });
        it('makes the plugin available in the minimap', function() {
          return expect(minimapPackage.plugins['dummy']).toBe(plugin);
        });
        it('emits an event', function() {
          return expect(registerHandler).toHaveBeenCalled();
        });
        it('creates a default config for the plugin', function() {
          return expect(minimapPackage.config.plugins.properties.dummy).toBeDefined();
        });
        it('sets the corresponding config', function() {
          return expect(atom.config.get('minimap.plugins.dummy')).toBeTruthy();
        });
        describe('triggering the corresponding plugin command', function() {
          beforeEach(function() {
            return atom.commands.dispatch(workspaceElement, 'minimap:toggle-dummy');
          });
          return it('receives a deactivation call', function() {
            return expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });
        describe('and then unregistered', function() {
          beforeEach(function() {
            return minimapPackage.unregisterPlugin('dummy');
          });
          it('has been unregistered', function() {
            return expect(minimapPackage.plugins['dummy']).toBeUndefined();
          });
          return describe('when the config is modified', function() {
            beforeEach(function() {
              return atom.config.set('minimap.plugins.dummy', false);
            });
            return it('does not activates the plugin', function() {
              return expect(plugin.deactivatePlugin).not.toHaveBeenCalled();
            });
          });
        });
        return describe('on minimap deactivation', function() {
          beforeEach(function() {
            expect(plugin.active).toBeTruthy();
            return minimapPackage.deactivate();
          });
          return it('deactivates all the plugins', function() {
            return expect(plugin.active).toBeFalsy();
          });
        });
      });
      describe('when the config for it is false', function() {
        beforeEach(function() {
          atom.config.set('minimap.plugins.dummy', false);
          return minimapPackage.registerPlugin('dummy', plugin);
        });
        return it('does not receive an activation call', function() {
          return expect(plugin.activatePlugin).not.toHaveBeenCalled();
        });
      });
      return describe('the registered plugin', function() {
        beforeEach(function() {
          return minimapPackage.registerPlugin('dummy', plugin);
        });
        it('receives an activation call', function() {
          return expect(plugin.activatePlugin).toHaveBeenCalled();
        });
        it('activates the plugin', function() {
          return expect(plugin.active).toBeTruthy();
        });
        return describe('when the config is modified after registration', function() {
          beforeEach(function() {
            return atom.config.set('minimap.plugins.dummy', false);
          });
          return it('receives a deactivation call', function() {
            return expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);
