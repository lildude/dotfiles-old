(function() {
  var $, GitPaletteView, git;

  $ = require('atom').$;

  git = require('./git');

  GitPaletteView = require('./views/git-palette-view');

  module.exports = {
    config: {
      includeStagedDiff: {
        title: 'Include staged diffs?',
        type: 'boolean',
        "default": true
      },
      openInPane: {
        type: 'boolean',
        "default": true,
        description: 'Allow commands to open new panes'
      },
      splitPane: {
        title: 'Split pane direction',
        type: 'string',
        "default": 'right',
        description: 'Where should new panes go?(right or left)'
      },
      wordDiff: {
        type: 'boolean',
        "default": true,
        description: 'Should word diffs be highlighted in diffs?'
      },
      amountOfCommitsToShow: {
        type: 'integer',
        "default": 25
      },
      gitPath: {
        type: 'string',
        "default": 'git',
        description: 'Where is your git?'
      },
      messageTimeout: {
        type: 'integer',
        "default": 5,
        description: 'How long should success/error messages be shown?'
      }
    },
    activate: function(state) {
      var GitAdd, GitAddAllAndCommit, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDiff, GitDiffAll, GitFetch, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles;
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
      GitMerge = require('./models/git-merge');
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
      atom.workspaceView.command('git-plus:run', function() {
        return GitRun();
      });
      return atom.workspaceView.command('git-plus:merge', function() {
        return GitMerge();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUROLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwwQkFBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sdUJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQURGO0FBQUEsTUFJQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtDQUZiO09BTEY7QUFBQSxNQVFBLFNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHNCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLE9BRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSwyQ0FIYjtPQVRGO0FBQUEsTUFhQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDRDQUZiO09BZEY7QUFBQSxNQWlCQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7T0FsQkY7QUFBQSxNQW9CQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FE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
//# sourceURL=/Users/lildude/.atom/packages/git-plus/lib/git-plus.coffee