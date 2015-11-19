(function() {
  var GitDiff, git, gitStat;

  git = require('../git');

  GitDiff = require('./git-diff');

  gitStat = function() {
    var args;
    args = ['diff', '--stat'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    return git.cmd({
      args: args,
      stdout: function(data) {
        return GitDiff({
          diffStat: data
        });
      }
    });
  };

  module.exports = gitStat;

}).call(this);
