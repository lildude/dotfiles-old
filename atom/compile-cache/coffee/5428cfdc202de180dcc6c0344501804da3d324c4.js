(function() {
  var $$, BufferedProcess, GitShow, LogListView, Os, Path, SelectListView, fs, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  GitShow = require('../models/git-show');

  module.exports = LogListView = (function(_super) {
    var currentFile, showCommitFilePath;

    __extends(LogListView, _super);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    currentFile = function() {
      var _ref1;
      return git.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    };

    showCommitFilePath = function() {
      return Path.join(Os.tmpDir(), "atom_git_plus_commit.diff");
    };

    LogListView.prototype.initialize = function(data, onlyCurrentFile) {
      this.data = data;
      this.onlyCurrentFile = onlyCurrentFile;
      LogListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    LogListView.prototype.parseData = function() {
      var item, tmp;
      this.data = this.data.split("\n").slice(0, -1);
      this.setItems((function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.data;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (!(item !== '')) {
            continue;
          }
          tmp = item.match(/([\w\d]{7});\|(.*);\|(.*);\|(.*)/);
          _results.push({
            hash: tmp != null ? tmp[1] : void 0,
            author: tmp != null ? tmp[2] : void 0,
            title: tmp != null ? tmp[3] : void 0,
            time: tmp != null ? tmp[4] : void 0
          });
        }
        return _results;
      }).call(this));
      return this.focusFilterEditor();
    };

    LogListView.prototype.getFilterKey = function() {
      return 'title';
    };

    LogListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    LogListView.prototype.cancelled = function() {
      return this.hide();
    };

    LogListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    LogListView.prototype.viewForItem = function(commit) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight text-huge'
            }, commit.title);
            _this.div({
              "class": ''
            }, "" + commit.hash + " by " + commit.author);
            return _this.div({
              "class": 'text-info'
            }, commit.time);
          };
        })(this));
      });
    };

    LogListView.prototype.confirmed = function(_arg) {
      var hash;
      hash = _arg.hash;
      return GitShow(hash, this.onlyCurrentFile ? currentFile() : void 0);
    };

    return LogListView;

  })(SelectListView);

}).call(this);
