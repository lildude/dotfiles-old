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
      siteLocalDir: "/config/your/local/directory/in/settings",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
      siteImagesDir: "images/{year}/{month}/",
      siteUrl: "",
      urlForTags: "",
      urlForPosts: "",
      urlForCategories: "",
      grammars: ['source.gfm', 'source.litcoffee', 'text.plain', 'text.plain.null-grammar'],
      fileExtension: ".markdown",
      publishRenameBasedOnTitle: false,
      publishKeepFileExtname: false,
      newPostFileName: "{year}-{month}-{day}-{title}{extension}",
      frontMatter: "---\nlayout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---",
      siteLinkPath: path.join(atom.getConfigDirPath(), "" + Configuration.prefix + "-links.cson"),
      referenceInsertPosition: "paragraph",
      referenceIndentLength: 2,
      projectConfigFile: "_mdwriter.cson",
      textStyles: {
        code: {
          before: "`",
          after: "`"
        },
        bold: {
          before: "**",
          after: "**"
        },
        italic: {
          before: "_",
          after: "_"
        },
        keystroke: {
          before: "<kbd>",
          after: "</kbd>"
        },
        strikethrough: {
          before: "~~",
          after: "~~"
        },
        codeblock: {
          before: "```\n",
          after: "\n```",
          regexBefore: "```(?:[\\w- ]+)?\\n",
          regexAfter: "\\n```"
        }
      },
      lineStyles: {
        h1: {
          before: "# "
        },
        h2: {
          before: "## "
        },
        h3: {
          before: "### "
        },
        h4: {
          before: "#### "
        },
        h5: {
          before: "##### "
        },
        ul: {
          before: "- ",
          regexBefore: "(?:-|\\*|\\d+\\.)\\s"
        },
        ol: {
          before: "1. ",
          regexBefore: "(?:-|\\*|\\d+\\.)\\s"
        },
        task: {
          before: "- [ ] ",
          regexBefore: "(?:- \\[ ]|- \\[x]|- \\[X]|-|\\*)\\s"
        },
        taskdone: {
          before: "- [x] ",
          regexBefore: "(?:- \\[ ]|- \\[x]|- \\[X]|-|\\*)\\s"
        },
        blockquote: {
          before: "> "
        }
      },
      imageTag: "![<alt>](<src>)",
      tableAlignment: "empty",
      tableExtraPipes: false
    };

    Configuration.engines = {
      html: {
        imageTag: "<a href=\"<site>/<slug>.html\" target=\"_blank\">\n  <img class=\"align<align>\" alt=\"<alt>\" src=\"<src>\" width=\"<width>\" height=\"<height>\" />\n</a>"
      },
      jekyll: {
        textStyles: {
          codeblock: {
            before: "{% highlight %}\n",
            after: "\n{% endhighlight %}",
            regexBefore: "{% highlight(?: .+)? %}\n",
            regexAfter: "\n{% endhighlight %}"
          }
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
      var config, project;
      if (!atom.project || atom.project.getPaths().length < 1) {
        return;
      }
      project = atom.project.getPaths()[0];
      config = this._loadProjectConfig(project);
      return this._valueForKeyPath(config, key);
    };

    Configuration.prototype._loadProjectConfig = function(project) {
      var config, file, filePath;
      if (this.constructor.projectConfigs[project]) {
        return this.constructor.projectConfigs[project];
      }
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
