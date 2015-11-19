(function() {
  var $, GitPaletteView, git;

  $ = require('atom').$;

  git = require('./git');

  GitPaletteView = require('./views/git-palette-view');

  module.exports = {
    configDefaults: {
      includeStagedDiff: true,
      openInPane: true,
      splitPane: 'right',
      wordDiff: true,
      amountOfCommitsToShow: 25,
      gitPath: 'git',
      messageTimeout: 5
    },
    activate: function(state) {
      var GitAdd, GitAddAllAndCommit, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDiff, GitDiffAll, GitFetch, GitInit, GitLog, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles;
      GitAdd = require('./models/git-add');
      GitAddAllAndCommit = require('./models/git-add-all-and-commit');
      GitAddAndCommit = require('./models/git-add-and-commit');
      GitBranch = require('./models/git-branch');
      GitCheckoutAllFiles = require('./models/git-checkout-all-files');
      GitCheckoutCurrentFile = require('./models/git-checkout-current-file');
      GitCherryPick = require('./models/git-cherry-pick');
      GitCommit = require('./models/git-commit');
      GitCommitAmend = require('./models/git-commit-amend');
      GitDiff = require('./models/git-diff');
      GitDiffAll = require('./models/git-diff-all');
      GitFetch = require('./models/git-fetch');
      GitInit = require('./models/git-init');
      GitLog = require('./models/git-log');
      GitStatus = require('./models/git-status');
      GitPush = require('./models/git-push');
      GitPull = require('./models/git-pull');
      GitRemove = require('./models/git-remove');
      GitShow = require('./models/git-show');
      GitStageFiles = require('./models/git-stage-files');
      GitStageHunk = require('./models/git-stage-hunk');
      GitStashApply = require('./models/git-stash-apply');
      GitStashDrop = require('./models/git-stash-drop');
      GitStashPop = require('./models/git-stash-pop');
      GitStashSave = require('./models/git-stash-save');
      GitTags = require('./models/git-tags');
      GitUnstageFiles = require('./models/git-unstage-files');
      GitRun = require('./models/git-run');
      atom.workspaceView.command('git-plus:menu', function() {
        return new GitPaletteView();
      });
      atom.workspaceView.command('git-plus:add', function() {
        return GitAdd();
      });
      atom.workspaceView.command('git-plus:add-all', function() {
        return GitAdd(true);
      });
      atom.workspaceView.command('git-plus:add-all-and-commit', function() {
        return GitAddAllAndCommit();
      });
      atom.workspaceView.command('git-plus:add-and-commit', function() {
        return GitAddAndCommit();
      });
      atom.workspaceView.command('git-plus:diff', function() {
        return GitDiff();
      });
      atom.workspaceView.command('git-plus:diff-all', function() {
        return GitDiffAll();
      });
      atom.workspaceView.command('git-plus:log', function() {
        return GitLog();
      });
      atom.workspaceView.command('git-plus:log-current-file', function() {
        return GitLog(true);
      });
      atom.workspaceView.command('git-plus:status', function() {
        return GitStatus();
      });
      atom.workspaceView.command('git-plus:push', function() {
        return GitPush();
      });
      atom.workspaceView.command('git-plus:pull', function() {
        return GitPull();
      });
      atom.workspaceView.command('git-plus:remove-current-file', function() {
        return GitRemove();
      });
      atom.workspaceView.command('git-plus:remove', function() {
        return GitRemove(true);
      });
      atom.workspaceView.command('git-plus:checkout-current-file', function() {
        return GitCheckoutCurrentFile();
      });
      atom.workspaceView.command('git-plus:checkout', function() {
        return GitBranch.gitBranches();
      });
      atom.workspaceView.command('git-plus:checkout-all-files', function() {
        return GitCheckoutAllFiles();
      });
      atom.workspaceView.command('git-plus:cherry-pick', function() {
        return GitCherryPick();
      });
      atom.workspaceView.command('git-plus:commit', function() {
        return new GitCommit();
      });
      atom.workspaceView.command('git-plus:commit-amend', function() {
        return GitCommitAmend();
      });
      atom.workspaceView.command('git-plus:fetch', function() {
        return GitFetch();
      });
      atom.workspaceView.command('git-plus:new-branch', function() {
        return GitBranch.newBranch();
      });
      atom.workspaceView.command('git-plus:reset-head', function() {
        return git.reset();
      });
      atom.workspaceView.command('git-plus:show', function() {
        return GitShow();
      });
      atom.workspaceView.command('git-plus:stage-files', function() {
        return GitStageFiles();
      });
      atom.workspaceView.command('git-plus:stage-hunk', function() {
        return GitStageHunk();
      });
      atom.workspaceView.command('git-plus:stash-save', function() {
        return GitStashSave();
      });
      atom.workspaceView.command('git-plus:stash-pop', function() {
        return GitStashPop();
      });
      atom.workspaceView.command('git-plus:stash-keep', function() {
        return GitStashApply();
      });
      atom.workspaceView.command('git-plus:stash-drop', function() {
        return GitStashDrop();
      });
      atom.workspaceView.command('git-plus:tags', function() {
        return GitTags();
      });
      atom.workspaceView.command('git-plus:unstage-files', function() {
        return GitUnstageFiles();
      });
      atom.workspaceView.command('git-plus:init', function() {
        return GitInit();
      });
      return atom.workspaceView.command('git-plus:run', function() {
        return GitRun();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUROLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwwQkFBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxpQkFBQSxFQUFtQixJQUFuQjtBQUFBLE1BQ0EsVUFBQSxFQUFZLElBRFo7QUFBQSxNQUVBLFNBQUEsRUFBVyxPQUZYO0FBQUEsTUFHQSxRQUFBLEVBQVUsSUFIVjtBQUFBLE1BSUEscUJBQUEsRUFBdUIsRUFKdkI7QUFBQSxNQUtBLE9BQUEsRUFBUyxLQUxUO0FBQUEsTUFNQSxjQUFBLEVBQWdCLENBTmhCO0tBREY7QUFBQSxJQVNBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEscVdBQUE7QUFBQSxNQUFBLE1BQUEsR0FBeUIsT0FBQSxDQUFRLGtCQUFSLENBQXpCLENBQUE7QUFBQSxNQUNBLGtCQUFBLEdBQXlCLE9BQUEsQ0FBUSxpQ0FBUixDQUR6QixDQUFBO0FBQUEsTUFFQSxlQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUixDQUZ6QixDQUFBO0FBQUEsTUFHQSxTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUixDQUh6QixDQUFBO0FBQUEsTUFJQSxtQkFBQSxHQUF5QixPQUFBLENBQVEsaUNBQVIsQ0FKekIsQ0FBQTtBQUFBLE1BS0Esc0JBQUEsR0FBeUIsT0FBQSxDQUFRLG9DQUFSLENBTHpCLENBQUE7QUFBQSxNQU1BLGFBQUEsR0FBeUIsT0FBQSxDQUFRLDBCQUFSLENBTnpCLENBQUE7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
//# sourceURL=/Users/lildude/.atom/packages/git-plus/lib/git-plus.coffee