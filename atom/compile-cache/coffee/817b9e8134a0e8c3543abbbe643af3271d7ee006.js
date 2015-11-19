(function() {
  var MergeListView, git;

  git = require('../git');

  MergeListView = require('../views/merge-list-view');

  module.exports = function() {
    return git.cmd({
      args: ['branch'],
      stdout: function(data) {
        return new MergeListView(data);
      }
    });
  };

}).call(this);
