(function() {
  var TagListView, git, gitTags;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  gitTags = function() {
    this.TagListView = null;
    return git.cmd({
      args: ['tag', '-ln'],
      stdout: function(data) {
        return this.TagListView = new TagListView(data);
      },
      exit: function() {
        if (this.TagListView == null) {
          return new TagListView('');
        }
      }
    });
  };

  module.exports = gitTags;

}).call(this);
