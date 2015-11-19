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
      projectConfigFile: "_mdwriter.cson",
      siteLocalDir: "/config/your/local/directory/in/settings",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
      siteImagesDir: "images/{year}/{month}/",
      siteUrl: "",
      urlForTags: "",
      urlForPosts: "",
      urlForCategories: "",
      newDraftFileName: "{title}{extension}",
      newPostFileName: "{year}-{month}-{day}-{title}{extension}",
      frontMatter: "---\nlayout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---",
      fileExtension: ".markdown",
      publishRenameBasedOnTitle: false,
      publishKeepFileExtname: false,
      inlineNewLineContinuation: false,
      siteLinkPath: path.join(atom.getConfigDirPath(), "" + Configuration.prefix + "-links.cson"),
      referenceInsertPosition: "paragraph",
      referenceIndentLength: 2,
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
          regexMatchBefore: "(?:-|\\*|\\+)\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s"
        },
        ol: {
          before: "1. ",
          regexMatchBefore: "(?:\\d+\\.)\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s"
        },
        task: {
          before: "- [ ] ",
          regexMatchBefore: "(?:-|\\*|\\+|\\d+\\.)\\s+\\[ ]\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s*(?:\\[[xX ]])?\\s"
        },
        taskdone: {
          before: "- [X] ",
          regexMatchBefore: "(?:-|\\*|\\+|\\d+\\.)\\s+\\[[xX]]\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s*(?:\\[[xX ]])?\\s"
        },
        blockquote: {
          before: "> "
        }
      },
      imageTag: "![<alt>](<src>)",
      tableAlignment: "empty",
      tableExtraPipes: false,
      grammars: ['source.gfm', 'source.litcoffee', 'text.plain', 'text.plain.null-grammar']
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

    Configuration.prototype.keyPath = function(key) {
      return "" + this.constructor.prefix + "." + key;
    };

    Configuration.prototype.get = function(key) {
      return this.getProject(key) || this.getUser(key) || this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.set = function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    };

    Configuration.prototype.restoreDefault = function(key) {
      return atom.config.unset(this.keyPath(key));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJTTsrQkFDSjs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxNQUFELEdBQVMsaUJBQVQsQ0FBQTs7QUFBQSxJQUVBLGFBQUMsQ0FBQSxRQUFELEdBRUU7QUFBQSxNQUFBLFVBQUEsRUFBWSxTQUFaO0FBQUEsTUFJQSxpQkFBQSxFQUFtQixnQkFKbkI7QUFBQSxNQU9BLFlBQUEsRUFBYywwQ0FQZDtBQUFBLE1BU0EsYUFBQSxFQUFlLFVBVGY7QUFBQSxNQVdBLFlBQUEsRUFBYyxnQkFYZDtBQUFBLE1BYUEsYUFBQSxFQUFlLHdCQWJmO0FBQUEsTUFnQkEsT0FBQSxFQUFTLEVBaEJUO0FBQUEsTUFtQkEsVUFBQSxFQUFZLEVBbkJaO0FBQUEsTUFvQkEsV0FBQSxFQUFhLEVBcEJiO0FBQUEsTUFxQkEsZ0JBQUEsRUFBa0IsRUFyQmxCO0FBQUEsTUF3QkEsZ0JBQUEsRUFBa0Isb0JBeEJsQjtBQUFBLE1BMEJBLGVBQUEsRUFBaUIseUNBMUJqQjtBQUFBLE1BNEJBLFdBQUEsRUFBYSxrRUE1QmI7QUFBQSxNQXFDQSxhQUFBLEVBQWUsV0FyQ2Y7QUFBQSxNQXdDQSx5QkFBQSxFQUEyQixLQXhDM0I7QUFBQSxNQTBDQSxzQkFBQSxFQUF3QixLQTFDeEI7QUFBQSxNQTZDQSx5QkFBQSxFQUEyQixL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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/config.coffee
