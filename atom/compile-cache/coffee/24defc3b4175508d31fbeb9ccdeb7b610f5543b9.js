(function() {
  var ListView, git, gitFetch;

  git = require('../git');

  ListView = require('../views/remote-list-view');

  gitFetch = function() {
    return git.cmd({
      args: ['remote'],
      stdout: function(data) {
        return new ListView(data.toString(), 'fetch');
      }
    });
  };

  module.exports = gitFetch;

}).call(this);
