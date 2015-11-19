(function() {
  var BranchListView, OutputView, PullBranchListView, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  OutputView = require('./output-view');

  BranchListView = require('./branch-list-view');

  module.exports = PullBranchListView = (function(_super) {
    __extends(PullBranchListView, _super);

    function PullBranchListView() {
      return PullBranchListView.__super__.constructor.apply(this, arguments);
    }

    PullBranchListView.prototype.initialize = function(remote) {
      this.remote = remote;
      return git.cmd({
        args: ['branch', '-r'],
        stdout: (function(_this) {
          return function(data) {
            _this.data = data;
            return PullBranchListView.__super__.initialize.apply(_this, arguments);
          };
        })(this)
      });
    };

    PullBranchListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      this.pull(name.split('/')[1]);
      return this.cancel();
    };

    PullBranchListView.prototype.pull = function(remoteBranch) {
      var remote, view;
      if (remoteBranch == null) {
        remoteBranch = '';
      }
      view = new OutputView();
      remote = this.remote;
      return git.cmd({
        args: ['fetch', this.remote],
        stdout: function(data) {
          this.data = data;
          if (this.data.toString().length === 0) {
            return git.cmd({
              args: ['merge', remote + "/" + remoteBranch],
              stdout: function(data) {
                return view.addLine(data.toString());
              },
              stderr: function(data) {
                return view.addLine(data.toString());
              },
              exit: (function(_this) {
                return function(code) {
                  return view.finish();
                };
              })(this)
            });
          }
        },
        stderr: function(data) {
          return view.addLine(data.toString());
        }
      });
    };

    return PullBranchListView;

  })(BranchListView);

}).call(this);
