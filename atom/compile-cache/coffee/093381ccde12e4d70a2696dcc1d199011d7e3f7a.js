(function() {
  var Configuration, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require("path");

  Configuration = (function() {
    function Configuration() {}

    Configuration.prefix = "markdown-writer";

    Configuration.defaults = {
      siteEngine: "general",
      siteLocalDir: "/github/example.github.io/",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
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
      codeblock: {
        before: "```\n",
        after: "\n```",
        regexBefore: "```(?:[\\w- ]+)?\\n",
        regexAfter: "\\n```"
      },
      siteLinkPath: path.join(atom.getConfigDirPath(), "" + Configuration.prefix + "-links.cson"),
      referenceInsertPosition: "paragraph",
      referenceIndentLength: 2,
      imageTag: "![<alt>](<src>)",
      siteImageUrl: "/assets/{year}/{month}/"
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

    Configuration.prototype.engineNames = function() {
      return Object.keys(this.constructor.engines);
    };

    Configuration.prototype.get = function(key) {
      return this.getUserConfig(key) || this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.set = function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    };

    Configuration.prototype.getDefault = function(key) {
      return this._valueForKeyPath(this.constructor.defaults, key);
    };

    Configuration.prototype.getEngine = function(key) {
      var engine;
      engine = atom.config.get(this.keyPath("siteEngine"));
      if (__indexOf.call(this.engineNames(), engine) >= 0) {
        return this._valueForKeyPath(this.constructor.engines[engine], key);
      }
    };

    Configuration.prototype.getCurrentConfig = function(key) {
      return this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.getUserConfig = function(key) {
      return atom.config.get(this.keyPath(key), {
        sources: [atom.config.getUserConfigPath()]
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRU07K0JBQ0o7O0FBQUEsSUFBQSxhQUFDLENBQUEsTUFBRCxHQUFTLGlCQUFULENBQUE7O0FBQUEsSUFFQSxhQUFDLENBQUEsUUFBRCxHQUVFO0FBQUEsTUFBQSxVQUFBLEVBQVksU0FBWjtBQUFBLE1BRUEsWUFBQSxFQUFjLDRCQUZkO0FBQUEsTUFJQSxhQUFBLEVBQWUsVUFKZjtBQUFBLE1BTUEsWUFBQSxFQUFjLGdCQU5kO0FBQUEsTUFRQSxPQUFBLEVBQVMsRUFSVDtBQUFBLE1BVUEsVUFBQSxFQUFZLDJDQVZaO0FBQUEsTUFXQSxXQUFBLEVBQWEsNENBWGI7QUFBQSxNQVlBLGdCQUFBLEVBQWtCLGlEQVpsQjtBQUFBLE1BY0EsUUFBQSxFQUFVLENBQ1IsWUFEUSxFQUVSLGtCQUZRLEVBR1IsWUFIUSxFQUlSLHlCQUpRLENBZFY7QUFBQSxNQXFCQSxhQUFBLEVBQWUsV0FyQmY7QUFBQSxNQXVCQSx5QkFBQSxFQUEyQixLQXZCM0I7QUFBQSxNQXlCQSxzQkFBQSxFQUF3QixLQXpCeEI7QUFBQSxNQTJCQSxlQUFBLEVBQWlCLHlDQTNCakI7QUFBQSxNQTZCQSxXQUFBLEVBQWEsa0VBN0JiO0FBQUEsTUFxQ0EsU0FBQSxFQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsT0FBUjtBQUFBLFFBQ0EsS0FBQSxFQUFPLE9BRFA7QUFBQSxRQUVBLFdBQUEsRUFBYSxxQkFGYjtBQUFBLFFBR0EsVUFBQSxFQUFZLFFBSFo7T0F0Q0Y7QUFBQSxNQTJDQSxZQUFBLEVBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUFWLEVBQW1DLEVB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
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/config.coffee