(function() {
  var Config, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require("path");

  Config = (function() {
    function Config() {}

    Config.prefix = "markdown-writer";

    Config.defaults = {
      siteEngine: "general",
      siteLocalDir: "/GitHub/example.github.io/",
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
      siteLinkPath: path.join(atom.getConfigDirPath(), "" + Config.prefix + "-links.cson"),
      imageTag: "![<alt>](<src>)",
      siteImageUrl: "/assets/{year}/{month}/"
    };

    Config.engines = {
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

    Config.prototype.keyPath = function(key) {
      return "" + this.constructor.prefix + "." + key;
    };

    Config.prototype.get = function(key) {
      if (atom.config.isDefault(this.keyPath(key))) {
        return this.getEngine(key) || this.getDefault(key);
      } else {
        return atom.config.get(this.keyPath(key));
      }
    };

    Config.prototype.set = function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    };

    Config.prototype.getDefault = function(key) {
      return this._valueForKeyPath(this.constructor.defaults, key);
    };

    Config.prototype.restoreDefault = function(key) {
      return atom.config.restoreDefault(this.keyPath(key));
    };

    Config.prototype.engineNames = function() {
      return Object.keys(this.constructor.engines);
    };

    Config.prototype.getEngine = function(key) {
      var engine;
      engine = atom.config.get(this.keyPath("siteEngine"));
      if (__indexOf.call(this.engineNames(), engine) >= 0) {
        return this._valueForKeyPath(this.constructor.engines[engine], key);
      }
    };

    Config.prototype._valueForKeyPath = function(object, keyPath) {
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

    return Config;

  })();

  module.exports = new Config();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFTTt3QkFDSjs7QUFBQSxJQUFBLE1BQUMsQ0FBQSxNQUFELEdBQVMsaUJBQVQsQ0FBQTs7QUFBQSxJQUVBLE1BQUMsQ0FBQSxRQUFELEdBRUU7QUFBQSxNQUFBLFVBQUEsRUFBWSxTQUFaO0FBQUEsTUFFQSxZQUFBLEVBQWMsNEJBRmQ7QUFBQSxNQUlBLGFBQUEsRUFBZSxVQUpmO0FBQUEsTUFNQSxZQUFBLEVBQWMsZ0JBTmQ7QUFBQSxNQVFBLE9BQUEsRUFBUyxFQVJUO0FBQUEsTUFVQSxVQUFBLEVBQVksMkNBVlo7QUFBQSxNQVdBLFdBQUEsRUFBYSw0Q0FYYjtBQUFBLE1BWUEsZ0JBQUEsRUFBa0IsaURBWmxCO0FBQUEsTUFjQSxRQUFBLEVBQVUsQ0FDUixZQURRLEVBRVIsa0JBRlEsRUFHUixZQUhRLEVBSVIseUJBSlEsQ0FkVjtBQUFBLE1BcUJBLGFBQUEsRUFBZSxXQXJCZjtBQUFBLE1BdUJBLHlCQUFBLEVBQTJCLEtBdkIzQjtBQUFBLE1BeUJBLHNCQUFBLEVBQXdCLEtBekJ4QjtBQUFBLE1BMkJBLGVBQUEsRUFBaUIseUNBM0JqQjtBQUFBLE1BNkJBLFdBQUEsRUFBYSxrRUE3QmI7QUFBQSxNQXFDQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLE1BQUEsRUFBUSxPQUFSO0FBQUEsUUFDQSxLQUFBLEVBQU8sT0FEUDtBQUFBLFFBRUEsV0FBQSxFQUFhLHFCQUZiO0FBQUEsUUFHQSxVQUFBLEVBQVksUUFIWjtPQXRDRjtBQUFBLE1BMkNBLFlBQUEsRUFBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBQVYsRUFBbUMsRUFB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
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/config.coffee