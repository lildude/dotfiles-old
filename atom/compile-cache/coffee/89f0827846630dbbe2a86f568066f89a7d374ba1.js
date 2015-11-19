(function() {
  var CherryPickSelectBranch, git, gitCherryPick;

  git = require('../git');

  CherryPickSelectBranch = require('../views/cherry-pick-select-branch-view');

  gitCherryPick = function() {
    var currentHead, head, heads, i, repo, _i, _len;
    repo = git.getRepo();
    heads = repo.getReferences().heads;
    currentHead = repo.getShortHead();
    for (i = _i = 0, _len = heads.length; _i < _len; i = ++_i) {
      head = heads[i];
      heads[i] = head.replace('refs/heads/', '');
    }
    heads = heads.filter(function(head) {
      return head !== currentHead;
    });
    return new CherryPickSelectBranch(heads, currentHead);
  };

  module.exports = gitCherryPick;

}).call(this);
