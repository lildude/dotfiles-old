(function() {
  var $, Reporter, grim;

  $ = require('jquery');

  Reporter = require('../lib/reporter');

  grim = require('grim');

  describe("Metrics", function() {
    var workspaceElement;
    workspaceElement = [][0];
    beforeEach(function() {
      var storage;
      workspaceElement = atom.views.getView(atom.workspace);
      spyOn(Reporter, 'request');
      storage = {};
      spyOn(localStorage, 'setItem').andCallFake(function(key, value) {
        return storage[key] = value;
      });
      spyOn(localStorage, 'getItem').andCallFake(function(key) {
        return storage[key];
      });
      return Reporter.commandCount = void 0;
    });
    afterEach(function() {
      return atom.packages.deactivatePackage('metrics');
    });
    it("reports events", function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('metrics');
      });
      waitsFor(function() {
        return Reporter.request.callCount === 2;
      });
      runs(function() {
        Reporter.request.reset();
        return atom.packages.deactivatePackage('metrics');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('metrics');
      });
      waitsFor(function() {
        return Reporter.request.callCount === 3;
      });
      return runs(function() {
        var url;
        url = Reporter.request.calls[0].args[0];
        return expect(url).toBeDefined();
      });
    });
    describe("sending commands", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics');
        });
        return waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
      });
      it("reports commands dispatched via atom.commands", function() {
        var command, url;
        command = 'some-package:a-command';
        atom.commands.dispatch(workspaceElement, command, null);
        expect(Reporter.commandCount[command]).toBe(1);
        url = Reporter.request.mostRecentCall.args[0];
        expect(url).toContain("ec=command");
        expect(url).toContain("ea=some-package");
        expect(url).toContain("el=some-package%3Aa-command");
        expect(url).toContain("ev=1");
        atom.commands.dispatch(workspaceElement, command, null);
        expect(Reporter.commandCount[command]).toBe(2);
        url = Reporter.request.mostRecentCall.args[0];
        return expect(url).toContain("ev=2");
      });
      it("does not report editor: and core: commands", function() {
        Reporter.request.reset();
        atom.commands.dispatch(workspaceElement, 'core:move-up', null);
        expect(Reporter.request).not.toHaveBeenCalled();
        atom.commands.dispatch(workspaceElement, 'editor:move-to-end-of-line', null);
        return expect(Reporter.request).not.toHaveBeenCalled();
      });
      it("does not report non-namespaced commands", function() {
        Reporter.request.reset();
        atom.commands.dispatch(workspaceElement, 'dragover', null);
        return expect(Reporter.request).not.toHaveBeenCalled();
      });
      it("does not report vim-mode:* movement commands", function() {
        Reporter.request.reset();
        atom.commands.dispatch(workspaceElement, 'vim-mode:move-up', null);
        atom.commands.dispatch(workspaceElement, 'vim-mode:move-down', null);
        atom.commands.dispatch(workspaceElement, 'vim-mode:move-left', null);
        atom.commands.dispatch(workspaceElement, 'vim-mode:move-right', null);
        return expect(Reporter.request).not.toHaveBeenCalled();
      });
      return it("does not report commands triggered via jquery", function() {
        Reporter.request.reset();
        $(workspaceElement).trigger('some-package:a-command');
        return expect(Reporter.request).not.toHaveBeenCalled();
      });
    });
    describe("reporting exceptions", function() {
      beforeEach(function() {
        spyOn(atom, 'openDevTools');
        spyOn(atom, 'executeJavaScriptInDevTools');
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics');
        });
        return waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
      });
      it("reports an exception with the correct type", function() {
        var message, url;
        message = "Uncaught TypeError: Cannot call method 'getScreenRow' of undefined";
        window.onerror(message, 'abc', 2, 3, {
          ok: true
        });
        url = Reporter.request.mostRecentCall.args[0];
        expect(url).toContain("t=exception");
        return expect(url).toContain("exd=TypeError");
      });
      describe("when the message has no clear type", function() {
        return it("reports an exception with the correct type", function() {
          var message, url;
          message = "";
          window.onerror(message, 2, 3, {
            ok: true
          });
          url = Reporter.request.mostRecentCall.args[0];
          expect(url).toContain("t=exception");
          return expect(url).toContain("exd=Unknown");
        });
      });
      return describe("when there are paths in the exception", function() {
        it("strips unix paths surrounded in quotes", function() {
          var message, url;
          message = "Error: ENOENT, unlink '/Users/someguy/path/file.js'";
          window.onerror(message, 2, 3, {
            ok: true
          });
          url = Reporter.request.mostRecentCall.args[0];
          return expect(decodeURIComponent(url)).toContain("exd=Error: ENOENT, unlink <path>");
        });
        it("strips unix paths without quotes", function() {
          var message, url;
          message = "Uncaught Error: spawn /Users/someguy.omg/path/file-09238_ABC-Final-Final.js ENOENT";
          window.onerror(message, 2, 3, {
            ok: true
          });
          url = Reporter.request.mostRecentCall.args[0];
          return expect(decodeURIComponent(url)).toContain("exd=Error: spawn <path> ENOENT");
        });
        it("strips windows paths without quotes", function() {
          var message, url;
          message = "Uncaught Error: spawn c:\\someguy.omg\\path\\file-09238_ABC-Fin%%$#()al-Final.js ENOENT";
          window.onerror(message, 2, 3, {
            ok: true
          });
          url = Reporter.request.mostRecentCall.args[0];
          return expect(decodeURIComponent(url)).toContain("exd=Error: spawn <path> ENOENT");
        });
        return it("strips windows paths surrounded in quotes", function() {
          var message, url;
          message = "Uncaught Error: EACCES 'c:\\someguy.omg\\path\\file-09238_ABC-Fin%%$#()al-Final.js'";
          window.onerror(message, 2, 3, {
            ok: true
          });
          url = Reporter.request.mostRecentCall.args[0];
          return expect(decodeURIComponent(url)).toContain("exd=Error: EACCES <path>");
        });
      });
    });
    describe("reporting deprecations", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics');
        });
        return waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
      });
      it("reports a deprecation with metadata specified", function() {
        Reporter.request.reset();
        jasmine.snapshotDeprecations();
        grim.deprecate('bad things are bad', {
          packageName: 'somepackage'
        });
        jasmine.restoreDeprecationsSnapshot();
        waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
        return runs(function() {
          var url;
          url = Reporter.request.mostRecentCall.args[0];
          expect(url).toContain("t=event");
          expect(url).toContain("ec=deprecation");
          expect(url).toContain("ea=somepackage");
          return expect(url).toContain("el=unknown");
        });
      });
      return it("reports a deprecation without metadata specified", function() {
        var deprecation, stack;
        Reporter.request.reset();
        jasmine.snapshotDeprecations();
        stack = [
          {
            fileName: '/Applications/Atom.app/pathwatcher.js',
            functionName: 'foo',
            location: '/Applications/Atom.app/pathwatcher.js:10:5'
          }, {
            fileName: '/Users/me/.atom/packages/metrics/lib/metrics.js',
            functionName: 'bar',
            location: '/Users/me/.atom/packages/metrics/lib/metrics.js:161:5'
          }
        ];
        deprecation = {
          message: "bad things are bad",
          stacks: [stack]
        };
        grim.addSerializedDeprecation(deprecation);
        spyOn(atom.packages.getLoadedPackage('metrics').mainModule, 'getPackagePathsByPackageName').andReturn({
          metrics: '/Users/me/.atom/packages/metrics'
        });
        jasmine.restoreDeprecationsSnapshot();
        waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
        return runs(function() {
          var url;
          url = Reporter.request.mostRecentCall.args[0];
          expect(url).toContain("t=event");
          expect(url).toContain("ec=deprecation");
          expect(url).toContain("ea=metrics");
          return expect(url).toMatch("el=[0-9]+\.[0-9]+\.[0-9]+");
        });
      });
    });
    describe("when deactivated", function() {
      return it("stops reporting pane items", function() {
        spyOn(Reporter, 'sendPaneItem');
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics');
        });
        waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
        waitsForPromise(function() {
          return atom.workspace.open('file1.txt');
        });
        runs(function() {
          expect(Reporter.sendPaneItem.callCount).toBe(1);
          Reporter.sendPaneItem.reset();
          return atom.packages.deactivatePackage('metrics');
        });
        waitsForPromise(function() {
          return atom.workspace.open('file2.txt');
        });
        return runs(function() {
          return expect(Reporter.sendPaneItem.callCount).toBe(0);
        });
      });
    });
    return describe("the metrics-reporter service", function() {
      var reporterService;
      reporterService = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics').then(function(pack) {
            return reporterService = pack.mainModule.provideReporter();
          });
        });
        waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
        return runs(function() {
          return Reporter.request.reset();
        });
      });
      describe("::sendEvent", function() {
        return it("makes a request", function() {
          reporterService.sendEvent('cat', 'action', 'label');
          return expect(Reporter.request).toHaveBeenCalled();
        });
      });
      describe("::sendTiming", function() {
        return it("makes a request", function() {
          reporterService.sendEvent('cat', 'name');
          return expect(Reporter.request).toHaveBeenCalled();
        });
      });
      return describe("::sendException", function() {
        return it("makes a request", function() {
          reporterService.sendException('desc');
          return expect(Reporter.request).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);
