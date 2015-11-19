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
    describe("reporting release channel", function() {
      beforeEach(function() {
        return localStorage.setItem('metrics.userId', 'a');
      });
      it("reports the dev release channel", function() {
        spyOn(atom, 'getVersion').andReturn('1.0.2-dev-dedbeef');
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics');
        });
        waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
        return runs(function() {
          var url;
          url = Reporter.request.mostRecentCall.args[0];
          return expect(url).toContain("aiid=dev");
        });
      });
      it("reports the beta release channel", function() {
        spyOn(atom, 'getVersion').andReturn('1.0.2-beta1');
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics');
        });
        waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
        return runs(function() {
          var url;
          url = Reporter.request.mostRecentCall.args[0];
          return expect(url).toContain("aiid=beta");
        });
      });
      return it("reports the stable release channel", function() {
        spyOn(atom, 'getVersion').andReturn('1.0.2');
        waitsForPromise(function() {
          return atom.packages.activatePackage('metrics');
        });
        waitsFor(function() {
          return Reporter.request.callCount > 0;
        });
        return runs(function() {
          var url;
          url = Reporter.request.mostRecentCall.args[0];
          return expect(url).toContain("aiid=stable");
        });
      });
    });
    describe("reporting commands", function() {
      describe("when the user is NOT chosen to send commands", function() {
        beforeEach(function() {
          localStorage.setItem('metrics.userId', 'a');
          waitsForPromise(function() {
            return atom.packages.activatePackage('metrics');
          });
          waitsFor(function() {
            return Reporter.request.callCount > 0;
          });
          return runs(function() {
            var Metrics;
            Metrics = atom.packages.getLoadedPackage('metrics').mainModule;
            return expect(Metrics.shouldWatchEvents()).toBe(false);
          });
        });
        return it("does not watch for commands", function() {
          var command;
          command = 'some-package:a-command';
          atom.commands.dispatch(workspaceElement, command, null);
          return expect(Reporter.commandCount).toBeUndefined();
        });
      });
      return describe("when the user is chosen to send commands", function() {
        beforeEach(function() {
          localStorage.setItem('metrics.userId', 'd');
          waitsForPromise(function() {
            return atom.packages.activatePackage('metrics');
          });
          waitsFor(function() {
            return Reporter.request.callCount > 0;
          });
          return runs(function() {
            var Metrics;
            Metrics = atom.packages.getLoadedPackage('metrics').mainModule;
            return expect(Metrics.shouldWatchEvents()).toBe(true);
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
          expect(url).toContain("ea=somepackage%40unknown");
          return expect(url).toContain("el=bad%20things%20are%20bad");
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
          expect(url).toMatch("ea=metrics%40[0-9]+\.[0-9]+\.[0-9]+");
          return expect(url).toContain("el=bad%20things%20are%20bad");
        });
      });
    });
    describe("reporting pane items", function() {
      describe("when the user is NOT chosen to send events", function() {
        beforeEach(function() {
          localStorage.setItem('metrics.userId', 'a');
          spyOn(Reporter, 'sendPaneItem');
          waitsForPromise(function() {
            return atom.packages.activatePackage('metrics');
          });
          return waitsFor(function() {
            return Reporter.request.callCount > 0;
          });
        });
        return it("will not report pane items", function() {
          waitsForPromise(function() {
            return atom.workspace.open('file1.txt');
          });
          return runs(function() {
            return expect(Reporter.sendPaneItem.callCount).toBe(0);
          });
        });
      });
      return describe("when the user is NOT chosen to send events", function() {
        beforeEach(function() {
          localStorage.setItem('metrics.userId', 'd');
          spyOn(Reporter, 'sendPaneItem');
          waitsForPromise(function() {
            return atom.packages.activatePackage('metrics');
          });
          return waitsFor(function() {
            return Reporter.request.callCount > 0;
          });
        });
        return it("will not report pane items", function() {
          waitsForPromise(function() {
            return atom.workspace.open('file1.txt');
          });
          return runs(function() {
            return expect(Reporter.sendPaneItem.callCount).toBe(1);
          });
        });
      });
    });
    describe("when deactivated", function() {
      return it("stops reporting pane items", function() {
        localStorage.setItem('metrics.userId', 'd');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWV0cmljcy9zcGVjL21ldHJpY3Mtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUJBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsZ0JBQUE7QUFBQSxJQUFDLG1CQUFvQixLQUFyQixDQUFBO0FBQUEsSUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUVBLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLFNBQWhCLENBRkEsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLEVBSlYsQ0FBQTtBQUFBLE1BS0EsS0FBQSxDQUFNLFlBQU4sRUFBb0IsU0FBcEIsQ0FBOEIsQ0FBQyxXQUEvQixDQUEyQyxTQUFDLEdBQUQsRUFBTSxLQUFOLEdBQUE7ZUFDekMsT0FBUSxDQUFBLEdBQUEsQ0FBUixHQUFlLE1BRDBCO01BQUEsQ0FBM0MsQ0FMQSxDQUFBO0FBQUEsTUFPQSxLQUFBLENBQU0sWUFBTixFQUFvQixTQUFwQixDQUE4QixDQUFDLFdBQS9CLENBQTJDLFNBQUMsR0FBRCxHQUFBO2VBQ3pDLE9BQVEsQ0FBQSxHQUFBLEVBRGlDO01BQUEsQ0FBM0MsQ0FQQSxDQUFBO2FBVUEsUUFBUSxDQUFD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

//# sourceURL=/Users/lildude/.atom/packages/metrics/spec/metrics-spec.coffee
