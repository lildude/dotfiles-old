(function() {
  var BufferedProcess, Point, Q, TagGenerator, path, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, Point = _ref.Point;

  Q = require('q');

  path = require('path');

  module.exports = TagGenerator = (function() {
    function TagGenerator(path, scopeName) {
      this.path = path;
      this.scopeName = scopeName;
    }

    TagGenerator.prototype.parseTagLine = function(line) {
      var sections, tag;
      sections = line.split('\t');
      if (sections.length > 3) {
        tag = {
          position: new Point(parseInt(sections[2]) - 1),
          name: sections[0],
          type: sections[3],
          parent: null
        };
        if (sections.length > 4 && sections[4].search('signature:') === -1) {
          tag.parent = sections[4];
        }
        if (this.getLanguage() === 'Python' && tag.type === 'member') {
          tag.type = 'function';
        }
        return tag;
      } else {
        return null;
      }
    };

    TagGenerator.prototype.getLanguage = function() {
      var _ref1;
      if ((_ref1 = path.extname(this.path)) === '.cson' || _ref1 === '.gyp') {
        return 'Cson';
      }
      return {
        'source.c': 'C',
        'source.cpp': 'C++',
        'source.clojure': 'Lisp',
        'source.coffee': 'CoffeeScript',
        'source.css': 'Css',
        'source.css.less': 'Css',
        'source.css.scss': 'Css',
        'source.gfm': 'Markdown',
        'source.go': 'Go',
        'source.java': 'Java',
        'source.js': 'JavaScript',
        'source.js.jsx': 'JavaScript',
        'source.jsx': 'JavaScript',
        'source.json': 'Json',
        'source.makefile': 'Make',
        'source.objc': 'C',
        'source.objcpp': 'C++',
        'source.python': 'Python',
        'source.ruby': 'Ruby',
        'source.sass': 'Sass',
        'source.yaml': 'Yaml',
        'text.html': 'Html',
        'text.html.php': 'Php',
        'source.livecodescript': 'LiveCode',
        'source.c++': 'C++',
        'source.objc++': 'C++'
      }[this.scopeName];
    };

    TagGenerator.prototype.generate = function() {
      var args, command, defaultCtagsFile, deferred, exit, language, stderr, stdout, tags;
      deferred = Q.defer();
      tags = [];
      command = path.resolve(__dirname, '..', 'vendor', "ctags-" + process.platform);
      defaultCtagsFile = require.resolve('./.ctags');
      args = ["--options=" + defaultCtagsFile, '--fields=KsS'];
      if (atom.config.get('symbols-view.useEditorGrammarAsCtagsLanguage')) {
        if (language = this.getLanguage()) {
          args.push("--language-force=" + language);
        }
      }
      args.push('-nf', '-', this.path);
      stdout = (function(_this) {
        return function(lines) {
          var line, tag, _i, _len, _ref1, _results;
          _ref1 = lines.split('\n');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            line = _ref1[_i];
            if (tag = _this.parseTagLine(line.trim())) {
              _results.push(tags.push(tag));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      stderr = function(lines) {};
      exit = function() {
        return deferred.resolve(tags);
      };
      new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      return deferred.promise;
    };

    return TagGenerator;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvc3ltYm9scy10cmVlLXZpZXcvbGliL3RhZy1nZW5lcmF0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBOztBQUFBLEVBQUEsT0FBMkIsT0FBQSxDQUFRLE1BQVIsQ0FBM0IsRUFBQyx1QkFBQSxlQUFELEVBQWtCLGFBQUEsS0FBbEIsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQURKLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsc0JBQUUsSUFBRixFQUFTLFNBQVQsR0FBQTtBQUFxQixNQUFwQixJQUFDLENBQUEsT0FBQSxJQUFtQixDQUFBO0FBQUEsTUFBYixJQUFDLENBQUEsWUFBQSxTQUFZLENBQXJCO0lBQUEsQ0FBYjs7QUFBQSwyQkFFQSxZQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLGFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBWCxDQUFBO0FBQ0EsTUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQXJCO0FBQ0UsUUFBQSxHQUFBLEdBQU07QUFBQSxVQUNKLFFBQUEsRUFBYyxJQUFBLEtBQUEsQ0FBTSxRQUFBLENBQVMsUUFBUyxDQUFBLENBQUEsQ0FBbEIsQ0FBQSxHQUF3QixDQUE5QixDQURWO0FBQUEsVUFFSixJQUFBLEVBQU0sUUFBUyxDQUFBLENBQUEsQ0FGWDtBQUFBLFVBR0osSUFBQSxFQUFNLFFBQVMsQ0FBQSxDQUFBLENBSFg7QUFBQSxVQUlKLE1BQUEsRUFBUSxJQUpKO1NBQU4sQ0FBQTtBQU1BLFFB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

//# sourceURL=/Users/lildude/.atom/packages/symbols-tree-view/lib/tag-generator.coffee
