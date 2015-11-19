(function() {
  var Reporter, https, path, querystring, _;

  https = require('https');

  path = require('path');

  querystring = require('querystring');

  _ = require('underscore-plus');

  module.exports = Reporter = (function() {
    function Reporter() {}

    Reporter.sendEvent = function(category, name, value) {
      var params;
      params = {
        t: 'event',
        ec: category,
        ea: name,
        ev: value
      };
      return this.send(params);
    };

    Reporter.sendTiming = function(category, name, value) {
      var params;
      params = {
        t: 'timing',
        utc: category,
        utv: name,
        utt: value
      };
      return this.send(params);
    };

    Reporter.viewNameForPaneItem = function(item) {
      var extension, itemPath, name, _ref;
      name = (_ref = typeof item.getViewClass === "function" ? item.getViewClass().name : void 0) != null ? _ref : item.constructor.name;
      if (name !== 'EditorView') {
        return name;
      }
      itemPath = typeof item.getPath === "function" ? item.getPath() : void 0;
      if (path.dirname(itemPath) !== atom.getConfigDirPath()) {
        return name;
      }
      extension = path.extname(itemPath);
      switch (path.basename(itemPath, extension)) {
        case 'config':
          if (extension === '.json' || extension === '.cson') {
            name = 'UserConfig';
          }
          break;
        case 'init':
          if (extension === '.js' || extension === '.coffee') {
            name = 'UserInitScript';
          }
          break;
        case 'keymap':
          if (extension === '.json' || extension === '.cson') {
            name = 'UserKeymap';
          }
          break;
        case 'snippets':
          if (extension === '.json' || extension === '.cson') {
            name = 'UserSnippets';
          }
          break;
        case 'styles':
          if (extension === '.css' || extension === '.less') {
            name = 'UserStylesheet';
          }
      }
      return name;
    };

    Reporter.sendPaneItem = function(item) {
      var params;
      params = {
        t: 'appview',
        cd: this.viewNameForPaneItem(item)
      };
      return this.send(params);
    };

    Reporter.send = function(params) {
      _.extend(params, this.defaultParams());
      return this.request({
        method: 'POST',
        hostname: 'www.google-analytics.com',
        path: "/collect?" + (querystring.stringify(params)),
        headers: {
          'User-Agent': navigator.userAgent
        }
      });
    };

    Reporter.request = function(options) {
      var request;
      request = https.request(options);
      request.on('error', function() {});
      return request.end();
    };

    Reporter.defaultParams = function() {
      return {
        v: 1,
        tid: "UA-3769691-33",
        cid: atom.config.get('metrics.userId'),
        an: 'atom',
        av: atom.getVersion(),
        sr: "" + screen.width + "x" + screen.height
      };
    };

    return Reporter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUpKLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNROzBCQUNKOztBQUFBLElBQUEsUUFBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLFFBQUQsRUFBVyxJQUFYLEVBQWlCLEtBQWpCLEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FDRTtBQUFBLFFBQUEsQ0FBQSxFQUFHLE9BQUg7QUFBQSxRQUNBLEVBQUEsRUFBSSxRQURKO0FBQUEsUUFFQSxFQUFBLEVBQUksSUFGSjtBQUFBLFFBR0EsRUFBQSxFQUFJLEtBSEo7T0FERixDQUFBO2FBTUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLEVBUFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsSUFTQSxRQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsUUFBRCxFQUFXLElBQVgsRUFBaUIsS0FBakIsR0FBQTtBQUNYLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUNFO0FBQUEsUUFBQSxDQUFBLEVBQUcsUUFBSDtBQUFBLFFBQ0EsR0FBQSxFQUFLLFFBREw7QUFBQSxRQUVBLEdBQUEsRUFBSyxJQUZMO0FBQUEsUUFHQSxHQUFBLEVBQUssS0FITDtPQURGLENBQUE7YUFNQSxJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU4sRUFQVztJQUFBLENBVGIsQ0FBQTs7QUFBQSxJQWtCQSxRQUFDLENBQUEsbUJBQUQsR0FBc0IsU0FBQyxJQUFELEdBQUE7QUFDcEIsVUFBQSwrQkFBQTtBQUFBLE1BQUEsSUFBQSx5R0FBbUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFwRCxDQUFBO0FBQ0EsTUFBQSxJQUFtQixJQUFBLEtBQVEsWUFBM0I7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBQUEsTUFHQSxRQUFBLHdDQUFXLElBQUksQ0FBQyxrQkFIaEIsQ0FBQTtBQUlBLE1BQUEsSUFBbUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQUEsS0FBMEIsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBN0M7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUpBO0FBQUEsTUFNQSxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBTlosQ0FBQTtBQU9BLGNBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkLEVBQXdCLFNBQXhCLENBQVA7QUFBQSxhQUNPLFFBRFA7QUFFSSxVQUFBLElBQTJCLFNBQUEsS0FBYyxPQUFkLElBQUEsU0FBQSxLQUF1QixPQUFsRDtBQUFBLFlBQUEsSUFBQSxHQUFPLFlBQVAsQ0FBQTtXQUZKO0FBQ087QUFEUCxhQUdPLE1BSFA7QUFJSSxVQUFBLElBQTJCLFNBQUEsS0FBYyxLQUFkLElBQUEsU0FBQSxLQUFxQixTQUFoRDtBQUFBLFlBQUEsSUFBQSxHQUFPLGdCQUFQLENBQUE7V0FKSjtBQUdPO0FBSFAsYUFLTyxRQUxQO0FBTUksVUFBQSxJQUEyQixTQUFBLEtBQWMsT0FBZCxJQUFBLFNBQUEsS0FBdUIsT0FBbEQ7QUFBQSxZQUFBLElBQUEsR0FBTyxZQUFQLENBQUE7V0FOSjtBQUtPO0FBTFAsYUFPTyxVQVBQO0FBUUksVUFBQSxJQUEyQixTQUFBLEtBQWMsT0FBZCxJQUFBLFNBQUEsS0FBdUIsT0FBbEQ7QUFBQSxZQUFBLElBQUEsR0FBTyxjQUFQLENBQUE7V0FSSjtBQU9PO0FBUFAsYUFTTyxRQVRQO0FBVUksVUFBQSxJQUEyQixTQUFBLEtBQWMsTUFBZCxJQUFBLFNBQUEsS0FBc0IsT0FBakQ7QUFBQSxZQUFBLElBQUEsR0FBTyxnQkFBUCxDQUFBO1dBVko7QUFBQSxPQVBBO2FBa0JBLEtBbkJvQjtJQUFBLENBbEJ0QixDQUFBOztBQUFBLElBdUNBLFFBQUMsQ0FBQSxZQUFELEdBQWUsU0FBQyxJQUFELEdBQUE7QUFDYixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FDRTtBQUFBLFFBQUEsQ0FBQSxFQUFHLFNBQUg7QUFBQSxRQUNBLEVBQUEsRUFBSSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBckIsQ0FESjtPQURGLENBQUE7YUFHQSxJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU4sRUFKYTtJQUFBLENBdkNmLENBQUE7O0FBQUEsSUE2Q0EsUUFBQyxDQUFBLElBQUQsR0FBTyxTQUFDLE1BQUQsR0FBQTtBQUNMLE1BQUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxNQUFULEVBQWlCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBakIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLE1BQVI7QUFBQSxRQUNBLFFBQUEsRUFBVSwwQkFEVjtBQUFBLFFBRUEsSUFBQSxFQUFPLFdBQUEsR0FBVSxDQUFBLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQUEsQ0FGakI7QUFBQSxRQUdBLE9BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLFNBQVMsQ0FBQyxTQUF4QjtTQUpGO09BREYsRUFGSztJQUFBLENBN0NQLENBQUE7O0FBQUEsSUFzREEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE9BQUQsR0FBQTtBQUNSLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxPQUFOLENBQWMsT0FBZCxDQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxFQUFSLENBQVcsT0FBWCxFQUFvQixTQUFBLEdBQUEsQ0FBcEIsQ0FEQSxDQUFBO2FBRUEsT0FBTyxDQUFDLEdBQVIsQ0FBQSxFQUhRO0lBQUEsQ0F0RFYsQ0FBQTs7QUFBQSxJQTJEQSxRQUFDLENBQUEsYUFBRCxHQUFnQixTQUFBLEdBQUE7YUFDZDtBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLEdBQUEsRUFBSyxlQURMO0FBQUEsUUFFQSxHQUFBLEVBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixDQUZMO0FBQUEsUUFHQSxFQUFBLEVBQUksTUFISjtBQUFBLFFBSUEsRUFBQSxFQUFJLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FKSjtBQUFBLFFBS0EsRUFBQSxFQUFJLEVBQUEsR0FBRSxNQUFNLENBQUMsS0FBVCxHQUFnQixHQUFoQixHQUFrQixNQUFNLENBQUMsTUFMN0I7UUFEYztJQUFBLENBM0RoQixDQUFBOztvQkFBQTs7TUFSSixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/reporter.coffee