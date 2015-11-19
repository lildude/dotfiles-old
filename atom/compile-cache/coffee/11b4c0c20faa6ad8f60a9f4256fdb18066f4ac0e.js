(function() {
  var Config, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require("path");

  Config = (function() {
    function Config() {}

    Config.prefix = "markdown-writer";

    Config.defaults = {
      siteEngine: "",
      siteLocalDir: "/GitHub/example.github.io/",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFTTt3QkFDSjs7QUFBQSxJQUFBLE1BQUMsQ0FBQSxNQUFELEdBQVMsaUJBQVQsQ0FBQTs7QUFBQSxJQUVBLE1BQUMsQ0FBQSxRQUFELEdBRUU7QUFBQSxNQUFBLFVBQUEsRUFBWSxFQUFaO0FBQUEsTUFFQSxZQUFBLEVBQWMsNEJBRmQ7QUFBQSxNQUlBLGFBQUEsRUFBZSxVQUpmO0FBQUEsTUFNQSxZQUFBLEVBQWMsZ0JBTmQ7QUFBQSxNQVFBLFVBQUEsRUFBWSwyQ0FSWjtBQUFBLE1BU0EsV0FBQSxFQUFhLDRDQVRiO0FBQUEsTUFVQSxnQkFBQSxFQUFrQixpREFWbEI7QUFBQSxNQVlBLFFBQUEsRUFBVSxDQUNSLFlBRFEsRUFFUixrQkFGUSxFQUdSLFlBSFEsRUFJUix5QkFKUSxDQVpWO0FBQUEsTUFtQkEsYUFBQSxFQUFlLFdBbkJmO0FBQUEsTUFxQkEseUJBQUEsRUFBMkIsS0FyQjNCO0FBQUEsTUF1QkEsc0JBQUEsRUFBd0IsS0F2QnhCO0FBQUEsTUF5QkEsZUFBQSxFQUFpQix5Q0F6QmpCO0FBQUEsTUEyQkEsV0FBQSxFQUFhLGtFQTNCYjtBQUFBLE1BbUNBLFNBQUEsRUFDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLE9BQVI7QUFBQSxRQUNBLEtBQUEsRUFBTyxPQURQO0FBQUEsUUFFQSxXQUFBLEVBQWEscUJBRmI7QUFBQSxRQUdBLFVBQUEsRUFBWSxRQUhaO09BcENGO0FBQUEsTUF5Q0EsWUFBQSxFQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFtQyxFQUFBLEdBQUUsTUFBQyxDQUFBLE1BQUgsR0FBVyxhQUE5QyxDQXpDZDtBQUFBLE1BMkNBLFFBQUEsRUFBVSxpQkEzQ1Y7QUFBQSxNQTZDQSxZQUFBLEVBQWMseUJBN0NkO0tBSkYsQ0FBQTs7QUFBQSxJQW1EQSxNQUFDLENBQUEsT0FBRCxHQUNFO0FBQUEsTUFBQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLFNBQUEsRUFDRTtBQUFBLFVBQUEsTUFBQSxFQUFRLG1CQUFSO0FBQUEsVUFDQSxLQUFBLEVBQU8sc0JBRFA7QUFBQSxVQUVBLFdBQUEsRUFBYSwyQkFGYjtBQUFBLFVBR0EsVUFBQSxFQUFZLHNCQUhaO1NBREY7T0FERjtBQUFBLE1BTUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsa0RBQVY7T0FQRjtBQUFBLE1BUUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxlQUFBLEVBQWlCLG9CQUFqQjtBQUFBLFFBQ0EsV0FBQSxFQUFhLDZEQURiO09BVEY7S0FwREYsQ0FBQTs7QUFBQSxxQkFxRUEsT0FBQSxHQUFTLFNBQUMsR0FBRCxHQUFBO2FBQVMsRUFBQSxHQUFFLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBZixHQUF1QixHQUF2QixHQUF5QixJQUFsQztJQUFBLENBckVULENBQUE7O0FBQUEscUJBdUVBLEdBQUEsR0FBSyxTQUFDLEdBQUQsR0FBQTtBQUNILE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsSUFBQyxDQUFBLE9BQUQsQ0FBUyxHQUFULENBQXRCLENBQUg7ZUFDRSxJQUFDLENBQUEsU0FBRCxDQUFXLEdBQVgsQ0FBQSxJQUFtQixJQUFDLENBQUEsVUFBRCxDQUFZLEdBQVosRUFEckI7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxPQUFELENBQVMsR0FBVCxDQUFoQixFQUhGO09BREc7SUFBQSxDQXZFTCxDQUFBOztBQUFBLHFCQTZFQSxHQUFBLEdBQUssU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO2FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxPQUFELENBQVMsR0FBVCxDQUFoQixFQUErQixHQUEvQixFQURHO0lBQUEsQ0E3RUwsQ0FBQTs7QUFBQSxxQkFnRkEsVUFBQSxHQUFZLFNBQUMsR0FBRCxHQUFBO2FBQ1YsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBL0IsRUFBeUMsR0FBekMsRUFEVTtJQUFBLENBaEZaLENBQUE7O0FBQUEscUJBbUZBLGNBQUEsR0FBZ0IsU0FBQyxHQUFELEdBQUE7YUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQVosQ0FBMkIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxHQUFULENBQTNCLEVBRGM7SUFBQSxDQW5GaEIsQ0FBQTs7QUFBQSxxQkFzRkEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUF6QixFQUFIO0lBQUEsQ0F0RmIsQ0FBQTs7QUFBQSxxQkF3RkEsU0FBQSxHQUFXLFNBQUMsR0FBRCxHQUFBO0FBQ1QsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxDQUFoQixDQUFULENBQUE7QUFDQSxNQUFBLElBQUcsZUFBVSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQVYsRUFBQSxNQUFBLE1BQUg7ZUFDRSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFRLENBQUEsTUFBQSxDQUF2QyxFQUFnRCxHQUFoRCxFQURGO09BRlM7SUFBQSxDQXhGWCxDQUFBOztBQUFBLHFCQTZGQSxnQkFBQSxHQUFrQixTQUFDLE1BQUQsRUFBUyxPQUFULEdBQUE7QUFDaEIsVUFBQSxtQkFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBZCxDQUFQLENBQUE7QUFDQSxXQUFBLDJDQUFBO3VCQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVMsTUFBTyxDQUFBLEdBQUEsQ0FBaEIsQ0FBQTtBQUNBLFFBQUEsSUFBYyxjQUFkO0FBQUEsZ0JBQUEsQ0FBQTtTQUZGO0FBQUEsT0FEQTthQUlBLE9BTGdCO0lBQUEsQ0E3RmxCLENBQUE7O2tCQUFBOztNQUhGLENBQUE7O0FBQUEsRUF1R0EsTUFBTSxDQUFDLE9BQVAsR0FBcUIsSUFBQSxNQUFBLENBQUEsQ0F2R3JCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/config.coffee