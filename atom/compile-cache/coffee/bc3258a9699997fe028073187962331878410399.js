(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitAdd, GitAddAllAndCommit, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDiff, GitDiffAll, GitFetch, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRemove, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles, commands, _ref;
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
    GitMerge = require('./models/git-merge');
    commands = [];
    if (atom.project.getRepo() != null) {
      git.refresh();
      if (((_ref = atom.workspace.getActiveEditor()) != null ? _ref.getPath() : void 0) != null) {
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
      }
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
        'git-plus:merge', 'Merge', function() {
          return GitMerge();
        }
      ]);
    } else {
      commands.push([
        'git-plus:init', 'Init', function() {
          return GitInit();
        }
      ]);
    }
    return commands;
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixRQUFBLHVYQUFBO0FBQUEsSUFBQSxNQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQkFBUixDQUF6QixDQUFBO0FBQUEsSUFDQSxrQkFBQSxHQUF5QixPQUFBLENBQVEsaUNBQVIsQ0FEekIsQ0FBQTtBQUFBLElBRUEsZUFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVIsQ0FGekIsQ0FBQTtBQUFBLElBR0EsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVIsQ0FIekIsQ0FBQTtBQUFBLElBSUEsbUJBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSLENBSnpCLENBQUE7QUFBQSxJQUtBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxvQ0FBUixDQUx6QixDQUFBO0FBQUEsSUFNQSxhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUixDQU56QixDQUFBO0FBQUEsSUFPQSxTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUixDQVB6QixDQUFBO0FBQUEsSUFRQSxjQUFBLEdBQXlCLE9BQUEsQ0FBUSwyQkFBUixDQVJ6QixDQUFBO0FBQUEsSUFTQSxPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUixDQVR6QixDQUFBO0FBQUEsSUFVQSxVQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUixDQVZ6QixDQUFBO0FBQUEsSUFXQSxRQUFBLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUixDQVh6QixDQUFBO0FBQUEsSUFZQSxPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUixDQVp6QixDQUFBO0FBQUEsSUFhQSxNQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQkFBUixDQWJ6QixDQUFBO0FB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
//# sourceURL=/Users/lildude/.atom/packages/git-plus/lib/git-plus-commands.coffee