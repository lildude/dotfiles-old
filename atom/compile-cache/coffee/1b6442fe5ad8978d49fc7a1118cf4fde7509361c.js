(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitAdd, GitAddAllAndCommit, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDiff, GitDiffAll, GitFetch, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles, commands, noOpenFile, noRepoHere, _ref;
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
    GitPull = require('./models/git-pull');
    GitPush = require('./models/git-push');
    GitRemove = require('./models/git-remove');
    GitShow = require('./models/git-show');
    GitStageFiles = require('./models/git-stage-files');
    GitStageHunk = require('./models/git-stage-hunk');
    GitStashApply = require('./models/git-stash-apply');
    GitStashDrop = require('./models/git-stash-drop');
    GitStashPop = require('./models/git-stash-pop');
    GitStashSave = require('./models/git-stash-save');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitUnstageFiles = require('./models/git-unstage-files');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    commands = [];
    noOpenFile = ((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) == null;
    noRepoHere = noOpenFile && atom.project.getRepositories().length === 0;
    if (noRepoHere) {
      commands.push([
        'git-plus:init', 'Init', function() {
          return GitInit();
        }
      ]);
    } else {
      git.refresh();
      if (git.getRepo() === null) {
        commands.push([
          'git-plus:init', 'Init', function() {
            return GitInit();
          }
        ]);
      } else {
        commands.push([
          'git-plus:add', 'Add', function() {
            return GitAdd();
          }
        ]);
        commands.push([
          'git-plus:log-current-file', 'Log Current File', function() {
            return GitLog(true);
          }
        ]);
        commands.push([
          'git-plus:remove-current-file', 'Remove Current File', function() {
            return GitRemove();
          }
        ]);
        commands.push([
          'git-plus:checkout-current-file', 'Checkout Current File', function() {
            return GitCheckoutCurrentFile();
          }
        ]);
        commands.push([
          'git-plus:add-all', 'Add All', function() {
            return GitAdd(true);
          }
        ]);
        commands.push([
          'git-plus:add-all-and-commit', 'Add All And Commit', function() {
            return GitAddAllAndCommit();
          }
        ]);
        commands.push([
          'git-plus:add-and-commit', 'Add And Commit', function() {
            return GitAddAndCommit();
          }
        ]);
        commands.push([
          'git-plus:checkout', 'Checkout', function() {
            return GitBranch.gitBranches();
          }
        ]);
        commands.push([
          'git-plus:checkout-all-files', 'Checkout All Files', function() {
            return GitCheckoutAllFiles();
          }
        ]);
        commands.push([
          'git-plus:cherry-pick', 'Cherry-Pick', function() {
            return GitCherryPick();
          }
        ]);
        commands.push([
          'git-plus:commit', 'Commit', function() {
            return new GitCommit;
          }
        ]);
        commands.push([
          'git-plus:commit-amend', 'Commit Amend', function() {
            return GitCommitAmend();
          }
        ]);
        commands.push([
          'git-plus:diff', 'Diff', function() {
            return GitDiff();
          }
        ]);
        commands.push([
          'git-plus:diff-all', 'Diff All', function() {
            return GitDiffAll();
          }
        ]);
        commands.push([
          'git-plus:fetch', 'Fetch', function() {
            return GitFetch();
          }
        ]);
        commands.push([
          'git-plus:log', 'Log', function() {
            return GitLog();
          }
        ]);
        commands.push([
          'git-plus:new-branch', 'Checkout New Branch', function() {
            return GitBranch.newBranch();
          }
        ]);
        commands.push([
          'git-plus:pull', 'Pull', function() {
            return GitPull();
          }
        ]);
        commands.push([
          'git-plus:push', 'Push', function() {
            return GitPush();
          }
        ]);
        commands.push([
          'git-plus:remove', 'Remove', function() {
            return GitRemove(true);
          }
        ]);
        commands.push([
          'git-plus:reset', 'Reset HEAD', function() {
            return git.reset();
          }
        ]);
        commands.push([
          'git-plus:show', 'Show', function() {
            return GitShow();
          }
        ]);
        commands.push([
          'git-plus:stage-files', 'Stage Files', function() {
            return GitStageFiles();
          }
        ]);
        commands.push([
          'git-plus:stage-hunk', 'Stage Hunk', function() {
            return GitStageHunk();
          }
        ]);
        commands.push([
          'git-plus:stash-save-changes', 'Stash: Save Changes', function() {
            return GitStashSave();
          }
        ]);
        commands.push([
          'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
            return GitStashPop();
          }
        ]);
        commands.push([
          'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
            return GitStashApply();
          }
        ]);
        commands.push([
          'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
            return GitStashDrop();
          }
        ]);
        commands.push([
          'git-plus:status', 'Status', function() {
            return GitStatus();
          }
        ]);
        commands.push([
          'git-plus:tags', 'Tags', function() {
            return GitTags();
          }
        ]);
        commands.push([
          'git-plus:unstage-files', 'Unstage Files', function() {
            return GitUnstageFiles();
          }
        ]);
        commands.push([
          'git-plus:run', 'Run', function() {
            return GitRun();
          }
        ]);
        commands.push([
          'git-plus:merge', 'Merge', function() {
            return GitMerge();
          }
        ]);
      }
    }
    return commands;
  };

  module.exports = getCommands;

}).call(this);
