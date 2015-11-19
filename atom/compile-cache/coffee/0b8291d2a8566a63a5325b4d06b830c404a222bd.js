(function() {
  var BufferedProcess, CompositeDisposable, MinimapPluginGeneratorElement, TextEditor, fs, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  fs = require('fs-plus');

  path = require('path');

  _ref = require('atom'), TextEditor = _ref.TextEditor, BufferedProcess = _ref.BufferedProcess;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = MinimapPluginGeneratorElement = (function(_super) {
    __extends(MinimapPluginGeneratorElement, _super);

    function MinimapPluginGeneratorElement() {
      return MinimapPluginGeneratorElement.__super__.constructor.apply(this, arguments);
    }

    MinimapPluginGeneratorElement.prototype.previouslyFocusedElement = null;

    MinimapPluginGeneratorElement.prototype.mode = null;

    MinimapPluginGeneratorElement.prototype.createdCallback = function() {
      this.classList.add('minimap-plugin-generator');
      this.classList.add('overlay');
      this.classList.add('from-top');
      this.editor = new TextEditor({
        mini: true
      });
      this.editorElement = atom.views.getView(this.editor);
      this.error = document.createElement('div');
      this.error.classList.add('error');
      this.message = document.createElement('div');
      this.message.classList.add('message');
      this.appendChild(this.editorElement);
      this.appendChild(this.error);
      return this.appendChild(this.message);
    };

    MinimapPluginGeneratorElement.prototype.attachedCallback = function() {
      this.previouslyFocusedElement = document.activeElement;
      this.message.textContent = "Enter plugin path";
      this.setPathText("my-minimap-plugin");
      return this.editorElement.focus();
    };

    MinimapPluginGeneratorElement.prototype.attach = function() {
      return atom.views.getView(atom.workspace).appendChild(this);
    };

    MinimapPluginGeneratorElement.prototype.setPathText = function(placeholderName, rangeToSelect) {
      var endOfDirectoryIndex, packagesDirectory, pathLength;
      if (rangeToSelect == null) {
        rangeToSelect = [0, placeholderName.length];
      }
      packagesDirectory = this.getPackagesDirectory();
      this.editor.setText(path.join(packagesDirectory, placeholderName));
      pathLength = this.editor.getText().length;
      endOfDirectoryIndex = pathLength - placeholderName.length;
      return this.editor.setSelectedBufferRange([[0, endOfDirectoryIndex + rangeToSelect[0]], [0, endOfDirectoryIndex + rangeToSelect[1]]]);
    };

    MinimapPluginGeneratorElement.prototype.detach = function() {
      var _ref1;
      if (this.parentNode == null) {
        return;
      }
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return this.parentNode.removeChild(this);
    };

    MinimapPluginGeneratorElement.prototype.confirm = function() {
      if (this.validPackagePath()) {
        this.removeChild(this.editorElement);
        this.message.innerHTML = "<span class='loading loading-spinner-tiny inline-block'></span>\nGenerate plugin at <span class=\"text-primary\">" + (this.getPackagePath()) + "</span>";
        return this.createPackageFiles((function(_this) {
          return function() {
            var packagePath;
            packagePath = _this.getPackagePath();
            atom.open({
              pathsToOpen: [packagePath],
              devMode: atom.config.get('minimap.createPluginInDevMode')
            });
            _this.message.innerHTML = "<span class=\"text-success\">Plugin successfully generated, opening it now...</span>";
            return setTimeout(function() {
              return _this.detach();
            }, 2000);
          };
        })(this));
      }
    };

    MinimapPluginGeneratorElement.prototype.getPackagePath = function() {
      var packageName, packagePath;
      packagePath = this.editor.getText();
      packageName = _.dasherize(path.basename(packagePath));
      return path.join(path.dirname(packagePath), packageName);
    };

    MinimapPluginGeneratorElement.prototype.getPackagesDirectory = function() {
      return atom.config.get('core.projectHome') || process.env.ATOM_REPOS_HOME || path.join(fs.getHomeDirectory(), 'github');
    };

    MinimapPluginGeneratorElement.prototype.validPackagePath = function() {
      if (fs.existsSync(this.getPackagePath())) {
        this.error.textContent = "Path already exists at '" + (this.getPackagePath()) + "'";
        this.error.style.display = 'block';
        return false;
      } else {
        return true;
      }
    };

    MinimapPluginGeneratorElement.prototype.initPackage = function(packagePath, callback) {
      var templatePath;
      templatePath = path.resolve(__dirname, path.join('..', 'templates', "plugin-" + this.template));
      return this.runCommand(atom.packages.getApmPath(), ['init', "-p", "" + packagePath, "--template", templatePath], callback);
    };

    MinimapPluginGeneratorElement.prototype.linkPackage = function(packagePath, callback) {
      var args;
      args = ['link'];
      if (atom.config.get('minimap.createPluginInDevMode')) {
        args.push('--dev');
      }
      args.push(packagePath.toString());
      return this.runCommand(atom.packages.getApmPath(), args, callback);
    };

    MinimapPluginGeneratorElement.prototype.installPackage = function(packagePath, callback) {
      var args;
      args = ['install'];
      return this.runCommand(atom.packages.getApmPath(), args, callback, {
        cwd: packagePath
      });
    };

    MinimapPluginGeneratorElement.prototype.isStoredInDotAtom = function(packagePath) {
      var devPackagesPath, packagesPath;
      packagesPath = path.join(atom.getConfigDirPath(), 'packages', path.sep);
      if (packagePath.indexOf(packagesPath) === 0) {
        return true;
      }
      devPackagesPath = path.join(atom.getConfigDirPath(), 'dev', 'packages', path.sep);
      return packagePath.indexOf(devPackagesPath) === 0;
    };

    MinimapPluginGeneratorElement.prototype.createPackageFiles = function(callback) {
      var packagePath, packagesDirectory;
      packagePath = this.getPackagePath();
      packagesDirectory = this.getPackagesDirectory();
      if (this.isStoredInDotAtom(packagePath)) {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.installPackage(packagePath, callback);
          };
        })(this));
      } else {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.linkPackage(packagePath, function() {
              return _this.installPackage(packagePath, callback);
            });
          };
        })(this));
      }
    };

    MinimapPluginGeneratorElement.prototype.runCommand = function(command, args, exit, options) {
      if (options == null) {
        options = {};
      }
      return new BufferedProcess({
        command: command,
        args: args,
        exit: exit,
        options: options
      });
    };

    return MinimapPluginGeneratorElement;

  })(HTMLElement);

  module.exports = MinimapPluginGeneratorElement = document.registerElement('minimap-plugin-generator', {
    prototype: MinimapPluginGeneratorElement.prototype
  });

  atom.commands.add('minimap-plugin-generator', {
    'core:confirm': function() {
      return this.confirm();
    },
    'core:cancel': function() {
      return this.detach();
    }
  });

}).call(this);
