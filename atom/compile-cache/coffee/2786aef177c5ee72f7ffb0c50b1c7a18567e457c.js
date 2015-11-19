(function() {
  var $, PublishDraft, config, fs, path, utils;

  $ = require("atom-space-pen-views").$;

  config = require("./config");

  utils = require("./utils");

  fs = require("fs-plus");

  path = require("path");

  module.exports = PublishDraft = (function() {
    PublishDraft.prototype.draftPath = null;

    PublishDraft.prototype.postPath = null;

    PublishDraft.prototype.frontMatter = null;

    PublishDraft.prototype.editor = null;

    function PublishDraft() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.draftPath = this.editor.getPath();
      this.frontMatter = utils.getFrontMatter(this.editor.getText());
      this.postPath = this.getPostPath();
    }

    PublishDraft.prototype.display = function() {
      this.updateFrontMatter();
      this.editor.save();
      if (this.draftPath !== this.postPath) {
        this.editor.destroy();
        this.moveDraft();
        return atom.workspace.open(this.postPath);
      }
    };

    PublishDraft.prototype.updateFrontMatter = function() {
      if (this.frontMatter.published == null) {
        this.frontMatter.published = true;
      }
      this.frontMatter.date = "" + (utils.getDateStr()) + " " + (utils.getTimeStr());
      return utils.updateFrontMatter(this.editor, this.frontMatter);
    };

    PublishDraft.prototype.moveDraft = function() {
      var error;
      try {
        if (fs.existsSync(this.postPath)) {
          return alert("Error:\nPost " + this.postPath + " already exists!");
        } else {
          return fs.renameSync(this.draftPath, this.postPath);
        }
      } catch (_error) {
        error = _error;
        return alert("Error:\n" + error.message);
      }
    };

    PublishDraft.prototype.getPostPath = function() {
      return path.join(this.getPostDir(), this.getPostName());
    };

    PublishDraft.prototype.getPostDir = function() {
      var localDir, postsDir;
      localDir = config.get("siteLocalDir");
      postsDir = config.get("sitePostsDir");
      postsDir = utils.dirTemplate(postsDir);
      return path.join(localDir, postsDir);
    };

    PublishDraft.prototype.getPostName = function() {
      var date, info, template;
      template = config.get("newPostFileName");
      date = utils.getDate();
      info = {
        title: this.getPostTitle(),
        extension: this.getPostExtension()
      };
      return utils.template(template, $.extend(info, date));
    };

    PublishDraft.prototype.getPostTitle = function() {
      if (config.get("publishRenameBasedOnTitle")) {
        return utils.dasherize(this.frontMatter.title);
      } else {
        return utils.getTitleSlug(this.draftPath);
      }
    };

    PublishDraft.prototype.getPostExtension = function() {
      var extname;
      if (config.get("publishKeepFileExtname")) {
        extname = path.extname(this.draftPath);
      }
      return extname || config.get("fileExtension");
    };

    return PublishDraft;

  })();

}).call(this);
