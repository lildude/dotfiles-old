(function() {
  var BufferedProcess, CompositeDisposable, Linter, Point, Range, XRegExp, fs, log, path, warn, _, _ref, _ref1;

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point, BufferedProcess = _ref.BufferedProcess;

  _ = require('lodash');

  XRegExp = require('xregexp').XRegExp;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn;

  Linter = (function() {
    Linter.syntax = '';

    Linter.prototype.cmd = '';

    Linter.prototype.regex = '';

    Linter.prototype.regexFlags = '';

    Linter.prototype.cwd = null;

    Linter.prototype.defaultLevel = 'error';

    Linter.prototype.linterName = null;

    Linter.prototype.executablePath = null;

    Linter.prototype.isNodeExecutable = false;

    Linter.prototype.errorStream = 'stdout';

    function Linter(editor) {
      this.editor = editor;
      this.cwd = path.dirname(this.editor.getPath());
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter.executionTimeout', (function(_this) {
        return function(x) {
          return _this.executionTimeout = x;
        };
      })(this)));
    }

    Linter.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    Linter.prototype._cachedStatSync = _.memoize(function(path) {
      return fs.statSync(path);
    });

    Linter.prototype.getCmdAndArgs = function(filePath) {
      var cmd, cmd_list, stats;
      cmd = this.cmd;
      cmd_list = Array.isArray(cmd) ? cmd.slice() : cmd.split(' ');
      cmd_list.push(filePath);
      if (this.executablePath) {
        stats = this._cachedStatSync(this.executablePath);
        if (stats.isDirectory()) {
          cmd_list[0] = path.join(this.executablePath, cmd_list[0]);
        } else {
          cmd_list[0] = this.executablePath;
        }
      }
      if (this.isNodeExecutable) {
        cmd_list.unshift(this.getNodeExecutablePath());
      }
      cmd_list = cmd_list.map(function(cmd_item) {
        if (/@filename/i.test(cmd_item)) {
          return cmd_item.replace(/@filename/gi, filePath);
        }
        if (/@tempdir/i.test(cmd_item)) {
          return cmd_item.replace(/@tempdir/gi, path.dirname(filePath));
        } else {
          return cmd_item;
        }
      });
      log('command and arguments', cmd_list);
      return {
        command: cmd_list[0],
        args: cmd_list.slice(1)
      };
    };

    Linter.prototype.getReportFilePath = function(filePath) {
      return path.join(path.dirname(filePath), this.reportFilePath);
    };

    Linter.prototype.getNodeExecutablePath = function() {
      return path.join(atom.packages.getApmPath(), '..', 'node');
    };

    Linter.prototype.lintFile = function(filePath, callback) {
      var args, command, dataStderr, dataStdout, exit, exited, options, process, stderr, stdout, _ref2;
      _ref2 = this.getCmdAndArgs(filePath), command = _ref2.command, args = _ref2.args;
      log('is node executable: ' + this.isNodeExecutable);
      options = {
        cwd: this.cwd
      };
      dataStdout = [];
      dataStderr = [];
      exited = false;
      stdout = function(output) {
        log('stdout', output);
        return dataStdout += output;
      };
      stderr = function(output) {
        warn('stderr', output);
        return dataStderr += output;
      };
      exit = (function(_this) {
        return function() {
          var data, reportFilePath;
          exited = true;
          switch (_this.errorStream) {
            case 'file':
              reportFilePath = _this.getReportFilePath(filePath);
              if (fs.existsSync(reportFilePath)) {
                data = fs.readFileSync(reportFilePath);
              }
              break;
            case 'stdout':
              data = dataStdout;
              break;
            default:
              data = dataStderr;
          }
          return _this.processMessage(data, callback);
        };
      })(this);
      process = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      if (this.executionTimeout > 0) {
        return setTimeout((function(_this) {
          return function() {
            if (exited) {
              return;
            }
            process.kill();
            return warn("command `" + command + "` timed out after " + _this.executionTimeout + " ms");
          };
        })(this), this.executionTimeout);
      }
    };

    Linter.prototype.processMessage = function(message, callback) {
      var messages, regex;
      messages = [];
      regex = XRegExp(this.regex, this.regexFlags);
      XRegExp.forEach(message, regex, (function(_this) {
        return function(match, i) {
          var msg;
          msg = _this.createMessage(match);
          if (msg.range != null) {
            return messages.push(msg);
          }
        };
      })(this), this);
      return callback(messages);
    };

    Linter.prototype.createMessage = function(match) {
      var level;
      if (match.error) {
        level = 'error';
      } else if (match.warning) {
        level = 'warning';
      } else {
        level = this.defaultLevel;
      }
      if (match.line == null) {
        match.line = 0;
      }
      if (match.col == null) {
        match.col = 0;
      }
      return {
        line: match.line,
        col: match.col,
        level: level,
        message: this.formatMessage(match),
        linter: this.linterName,
        range: this.computeRange(match)
      };
    };

    Linter.prototype.formatMessage = function(match) {
      return match.message;
    };

    Linter.prototype.lineLengthForRow = function(row) {
      var text;
      text = this.editor.lineTextForBufferRow(row);
      return (text != null ? text.length : void 0) || 0;
    };

    Linter.prototype.getEditorScopesForPosition = function(position) {
      try {
        return _.clone(this.editor.displayBuffer.tokenizedBuffer.scopesForPosition(position));
      } catch (_error) {
        return [];
      }
    };

    Linter.prototype.getGetRangeForScopeAtPosition = function(innerMostScope, position) {
      return this.editor.displayBuffer.tokenizedBuffer.bufferRangeForScopeAtPosition(innerMostScope, position);
    };

    Linter.prototype.computeRange = function(match) {
      var colEnd, colStart, decrementParse, innerMostScope, position, range, rowEnd, rowStart, scopes, _ref2, _ref3, _ref4;
      decrementParse = function(x) {
        return Math.max(0, parseInt(x) - 1);
      };
      rowStart = decrementParse((_ref2 = match.lineStart) != null ? _ref2 : match.line);
      rowEnd = decrementParse((_ref3 = (_ref4 = match.lineEnd) != null ? _ref4 : match.line) != null ? _ref3 : rowStart);
      if (rowEnd >= this.editor.getLineCount()) {
        log("ignoring " + match + " - it's longer than the buffer");
        return null;
      }
      if (!match.colStart) {
        position = new Point(rowStart, match.col);
        scopes = this.getEditorScopesForPosition(position);
        while (innerMostScope = scopes.pop()) {
          range = this.getGetRangeForScopeAtPosition(innerMostScope, position);
          if (range != null) {
            return range;
          }
        }
      }
      if (match.colStart == null) {
        match.colStart = match.col;
      }
      colStart = decrementParse(match.colStart);
      colEnd = match.colEnd != null ? decrementParse(match.colEnd) : parseInt(this.lineLengthForRow(rowEnd));
      if (colStart === colEnd) {
        colStart = decrementParse(colStart);
      }
      return new Range([rowStart, colStart], [rowEnd, colEnd]);
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdHQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxPQUFrQyxPQUFBLENBQVEsTUFBUixDQUFsQyxFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixFQUFlLHVCQUFBLGVBRmYsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUhKLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUSxTQUFSLEVBQVgsT0FKRCxDQUFBOztBQUFBLEVBS0Msc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUxELENBQUE7O0FBQUEsRUFPQSxRQUFjLE9BQUEsQ0FBUSxTQUFSLENBQWQsRUFBQyxZQUFBLEdBQUQsRUFBTSxhQUFBLElBUE4sQ0FBQTs7QUFBQSxFQVlNO0FBSUosSUFBQSxNQUFDLENBQUEsTUFBRCxHQUFTLEVBQVQsQ0FBQTs7QUFBQSxxQkFJQSxHQUFBLEdBQUssRUFKTCxDQUFBOztBQUFBLHFCQWlCQSxLQUFBLEdBQU8sRUFqQlAsQ0FBQTs7QUFBQSxxQkFtQkEsVUFBQSxHQUFZLEVBbkJaLENBQUE7O0FBQUEscUJBc0JBLEdBQUEsR0FBSyxJQXRCTCxDQUFBOztBQUFBLHFCQXdCQSxZQUFBLEdBQWMsT0F4QmQsQ0FBQTs7QUFBQSxxQkEwQkEsVUFBQSxHQUFZLElBMUJaLENBQUE7O0FBQUEscUJBNEJBLGNBQUEsR0FBZ0IsSUE1QmhCLENBQUE7O0FBQUEscUJBOEJBLGdCQUFBLEdBQWtCLEtBOUJsQixDQUFBOztBQUFBLHFCQWlDQSxXQUFBLEdBQWEsUUFqQ2IsQ0FBQTs7QUFvQ2EsSUFBQSxnQkFB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
//# sourceURL=/Users/lildude/.atom/packages/linter/lib/linter.coffee