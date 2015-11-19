(function() {
  var Linter, LinterRubocop, findFile, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  findFile = require("" + linterPath + "/lib/util");

  LinterRubocop = (function(_super) {
    __extends(LinterRubocop, _super);

    LinterRubocop.syntax = ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec'];

    LinterRubocop.prototype.cmd = 'rubocop --format emacs';

    LinterRubocop.prototype.linterName = 'rubocop';

    LinterRubocop.prototype.regex = '.+?:(?<line>\\d+):(?<col>\\d+): ' + '((?<warning>[RCW])|(?<error>[EF])): ' + '(?<message>.+)';

    function LinterRubocop(editor) {
      var config;
      LinterRubocop.__super__.constructor.call(this, editor);
      if (editor.getGrammar().scopeName === 'source.ruby.rails') {
        this.cmd += " -R";
      }
      config = findFile(this.cwd, '.rubocop.yml');
      if (config) {
        this.cmd += " --config " + config;
      }
      atom.config.observe('linter-rubocop.rubocopExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-rubocop.rubocopExecutablePath');
        };
      })(this));
    }

    LinterRubocop.prototype.destroy = function() {
      return atom.config.unobserve('linter-rubocop.rubocopExecutablePath');
    };

    return LinterRubocop;

  })(Linter);

  module.exports = LinterRubocop;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXRELENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLEVBQUEsR0FBRSxVQUFGLEdBQWMsYUFBdEIsQ0FEVCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxFQUFBLEdBQUUsVUFBRixHQUFjLFdBQXRCLENBRlgsQ0FBQTs7QUFBQSxFQUlNO0FBR0osb0NBQUEsQ0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxNQUFELEdBQVMsQ0FBQyxhQUFELEVBQWdCLG1CQUFoQixFQUFxQyxtQkFBckMsQ0FBVCxDQUFBOztBQUFBLDRCQUlBLEdBQUEsR0FBSyx3QkFKTCxDQUFBOztBQUFBLDRCQU1BLFVBQUEsR0FBWSxTQU5aLENBQUE7O0FBQUEsNEJBU0EsS0FBQSxHQUNFLGtDQUFBLEdBQ0Esc0NBREEsR0FFQSxnQkFaRixDQUFBOztBQWNhLElBQUEsdUJBQUMsTUFBRCxHQUFBO0FBQ1gsVUFBQSxNQUFBO0FBQUEsTUFBQSwrQ0FBTSxNQUFOLENBQUEsQ0FBQTtBQUVBLE1BQUEsSUFBRyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBcEIsS0FBaUMsbUJBQXBDO0FBQ0UsUUFBQSxJQUFDLENBQUEsR0FBRCxJQUFRLEtBQVIsQ0FERjtPQUZBO0FBQUEsTUFLQSxNQUFBLEdBQVMsUUFBQSxDQUFTLElBQUMsQ0FBQSxHQUFWLEVBQWUsY0FBZixDQUxULENBQUE7QUFNQSxNQUFBLElBQUcsTUFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLEdBQUQsSUFBUyxZQUFBLEdBQVcsTUFBcEIsQ0FERjtPQU5BO0FBQUEsTUFTQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0NBQXBCLEVBQTRELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzFELEtBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsRUFEd0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RCxDQVRBLENBRFc7SUFBQSxDQWRiOztBQUFBLDRCQTJCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXNCLHNDQUF0QixFQURPO0lBQUEsQ0EzQlQsQ0FBQTs7eUJBQUE7O0tBSDBCLE9BSjVCLENBQUE7O0FBQUEsRUFxQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFyQ2pCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/linter-rubocop/lib/linter-rubocop.coffee