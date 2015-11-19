(function() {
  var CSON, Configuration, fs, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require("path");

  CSON = require("season");

  fs = require("fs-plus");

  Configuration = (function() {
    function Configuration() {}

    Configuration.prefix = "markdown-writer";

    Configuration.defaults = {
      siteEngine: "general",
      siteLocalDir: "/github/example.github.io/",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
      siteImagesDir: "images/{year}/{month}/",
      siteUrl: "",
      urlForTags: "http://example.github.io/assets/tags.json",
      urlForPosts: "http://example.github.io/assets/posts.json",
      urlForCategories: "http://example.github.io/assets/categories.json",
      grammars: ['source.gfm', 'source.litcoffee', 'text.plain', 'text.plain.null-grammar'],
      fileExtension: ".markdown",
      publishRenameBasedOnTitle: false,
      publishKeepFileExtname: false,
      newPostFileName: "{year}-{month}-{day}-{title}{extension}",
      frontMatter: "---\nlayout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---",
      imageTag: "![<alt>](<src>)",
      codeblock: {
        before: "```\n",
        after: "\n```",
        regexBefore: "```(?:[\\w- ]+)?\\n",
        regexAfter: "\\n```"
      },
      siteLinkPath: path.join(atom.getConfigDirPath(), "" + Configuration.prefix + "-links.cson"),
      referenceInsertPosition: "paragraph",
      referenceIndentLength: 2,
      projectConfigFile: "_mdwriter.cson"
    };

    Configuration.engines = {
      html: {
        imageTag: "<a href=\"<site>/<slug>.html\" target=\"_blank\">\n  <img class=\"align<align>\" alt=\"<alt>\" src=\"<src>\" width=\"<width>\" height=\"<height>\" />\n</a>"
      },
      jekyll: {
        codeblock: {
          before: "{% highlight %}\n",
          after: "\n{% endhighlight %}",
          regexBefore: "{% highlight(?: .+)? %}\n",
          regexAfter: "\n{% endhighlight %}"
        }
      },
      octopress: {
        imageTag: "{% img {align} {src} {width} {height} '{alt}' %}"
      },
      hexo: {
        newPostFileName: "{title}{extension}",
        frontMatter: "layout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---"
      }
    };

    Configuration.projectConfigs = {};

    Configuration.prototype.engineNames = function() {
      return Object.keys(this.constructor.engines);
    };

    Configuration.prototype.get = function(key) {
      return this.getProject(key) || this.getUser(key) || this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.set = function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    };

    Configuration.prototype.getDefault = function(key) {
      return this._valueForKeyPath(this.constructor.defaults, key);
    };

    Configuration.prototype.getEngine = function(key) {
      var engine;
      engine = this.getProject("siteEngine") || this.getUser("siteEngine") || this.getDefault("siteEngine");
      if (__indexOf.call(this.engineNames(), engine) >= 0) {
        return this._valueForKeyPath(this.constructor.engines[engine], key);
      }
    };

    Configuration.prototype.getCurrentDefault = function(key) {
      return this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.getUser = function(key) {
      return atom.config.get(this.keyPath(key), {
        sources: [atom.config.getUserConfigPath()]
      });
    };

    Configuration.prototype.getProject = function(key) {
      var project;
      if (!(atom.project && atom.project.getPaths().length > 0)) {
        return;
      }
      project = atom.project.getPaths()[0];
      if (!this.constructor.projectConfigs[project]) {
        this._loadProjectConfig(project);
      }
      return this._valueForKeyPath(this.constructor.projectConfigs[project], key);
    };

    Configuration.prototype._loadProjectConfig = function(project) {
      var config, file, filePath;
      file = this.getUser("projectConfigFile") || this.getDefault("projectConfigFile");
      filePath = path.join(project, file);
      if (fs.existsSync(filePath)) {
        config = CSON.readFileSync(filePath);
      }
      return this.constructor.projectConfigs[project] = config || {};
    };

    Configuration.prototype.restoreDefault = function(key) {
      return atom.config.unset(this.keyPath(key));
    };

    Configuration.prototype.keyPath = function(key) {
      return "" + this.constructor.prefix + "." + key;
    };

    Configuration.prototype._valueForKeyPath = function(object, keyPath) {
      var key, keys, _i, _len;
      keys = keyPath.split('.');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    };

    return Configuration;

  })();

  module.exports = new Configuration();

}).call(this);
