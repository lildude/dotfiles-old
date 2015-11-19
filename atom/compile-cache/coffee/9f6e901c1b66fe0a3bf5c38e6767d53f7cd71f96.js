(function() {
  var GitPaletteView, git;

  git = require('./git');

  GitPaletteView = require('./views/git-palette-view');

  module.exports = {
    config: {
      includeStagedDiff: {
        title: 'Include staged diffs?',
        description: 'description',
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
        "default": 25,
        minimum: 1
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
      var GitAdd, GitAddAllAndCommit, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDiff, GitDiffAll, GitFetch, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles, _ref;
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
      atom.commands.add('atom-workspace', 'git-plus:menu', function() {
        return new GitPaletteView();
      });
      if (atom.project.getRepositories().length === 0) {
        return atom.commands.add('atom-workspace', 'git-plus:init', function() {
          return GitInit();
        });
      } else {
        git.refresh();
        if (((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) != null) {
          atom.commands.add('atom-workspace', 'git-plus:add', function() {
            return GitAdd();
          });
          atom.commands.add('atom-workspace', 'git-plus:log-current-file', function() {
            return GitLog(true);
          });
          atom.commands.add('atom-workspace', 'git-plus:remove-current-file', function() {
            return GitRemove();
          });
          atom.commands.add('atom-workspace', 'git-plus:checkout-current-file', function() {
            return GitCheckoutCurrentFile();
          });
        }
        atom.commands.add('atom-workspace', 'git-plus:add-all', function() {
          return GitAdd(true);
        });
        atom.commands.add('atom-workspace', 'git-plus:add-all-and-commit', function() {
          return GitAddAllAndCommit();
        });
        atom.commands.add('atom-workspace', 'git-plus:add-and-commit', function() {
          return GitAddAndCommit();
        });
        atom.commands.add('atom-workspace', 'git-plus:diff', function() {
          return GitDiff();
        });
        atom.commands.add('atom-workspace', 'git-plus:diff-all', function() {
          return GitDiffAll();
        });
        atom.commands.add('atom-workspace', 'git-plus:log', function() {
          return GitLog();
        });
        atom.commands.add('atom-workspace', 'git-plus:status', function() {
          return GitStatus();
        });
        atom.commands.add('atom-workspace', 'git-plus:push', function() {
          return GitPush();
        });
        atom.commands.add('atom-workspace', 'git-plus:pull', function() {
          return GitPull();
        });
        atom.commands.add('atom-workspace', 'git-plus:remove', function() {
          return GitRemove(true);
        });
        atom.commands.add('atom-workspace', 'git-plus:checkout', function() {
          return GitBranch.gitBranches();
        });
        atom.commands.add('atom-workspace', 'git-plus:checkout-all-files', function() {
          return GitCheckoutAllFiles();
        });
        atom.commands.add('atom-workspace', 'git-plus:cherry-pick', function() {
          return GitCherryPick();
        });
        atom.commands.add('atom-workspace', 'git-plus:commit', function() {
          return new GitCommit();
        });
        atom.commands.add('atom-workspace', 'git-plus:commit-amend', function() {
          return GitCommitAmend();
        });
        atom.commands.add('atom-workspace', 'git-plus:fetch', function() {
          return GitFetch();
        });
        atom.commands.add('atom-workspace', 'git-plus:new-branch', function() {
          return GitBranch.newBranch();
        });
        atom.commands.add('atom-workspace', 'git-plus:reset-head', function() {
          return git.reset();
        });
        atom.commands.add('atom-workspace', 'git-plus:show', function() {
          return GitShow();
        });
        atom.commands.add('atom-workspace', 'git-plus:stage-files', function() {
          return GitStageFiles();
        });
        atom.commands.add('atom-workspace', 'git-plus:stage-hunk', function() {
          return GitStageHunk();
        });
        atom.commands.add('atom-workspace', 'git-plus:stash-save', function() {
          return GitStashSave();
        });
        atom.commands.add('atom-workspace', 'git-plus:stash-pop', function() {
          return GitStashPop();
        });
        atom.commands.add('atom-workspace', 'git-plus:stash-keep', function() {
          return GitStashApply();
        });
        atom.commands.add('atom-workspace', 'git-plus:stash-drop', function() {
          return GitStashDrop();
        });
        atom.commands.add('atom-workspace', 'git-plus:tags', function() {
          return GitTags();
        });
        atom.commands.add('atom-workspace', 'git-plus:unstage-files', function() {
          return GitUnstageFiles();
        });
        atom.commands.add('atom-workspace', 'git-plus:run', function() {
          return GitRun();
        });
        return atom.commands.add('atom-workspace', 'git-plus:merge', function() {
          return GitMerge();
        });
      }
    }
  };

}).call(this);
