(function() {
  var Reporter, extend, getReleaseChannel, path, post, querystring,
    __slice = [].slice;

  path = require('path');

  querystring = require('querystring');

  extend = function() {
    var key, propertyMap, propertyMaps, target, value, _i, _len;
    target = arguments[0], propertyMaps = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = propertyMaps.length; _i < _len; _i++) {
      propertyMap = propertyMaps[_i];
      for (key in propertyMap) {
        value = propertyMap[key];
        target[key] = value;
      }
    }
    return target;
  };

  post = function(url) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    return xhr.send(null);
  };

  getReleaseChannel = function() {
    var version;
    version = atom.getVersion();
    if (version.indexOf('beta') > -1) {
      return 'beta';
    } else if (version.indexOf('dev') > -1) {
      return 'dev';
    } else {
      return 'stable';
    }
  };

  module.exports = Reporter = (function() {
    function Reporter() {}

    Reporter.sendEvent = function(category, action, label, value) {
      var params;
      params = {
        t: 'event',
        ec: category,
        ea: action
      };
      if (label != null) {
        params.el = label;
      }
      if (value != null) {
        params.ev = value;
      }
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

    Reporter.sendException = function(description) {
      var params;
      params = {
        t: 'exception',
        exd: description,
        exf: atom.inDevMode() ? '0' : '1'
      };
      return this.send(params);
    };

    Reporter.viewNameForPaneItem = function(item) {
      var extension, itemPath, name, _ref;
      name = (_ref = typeof item.getViewClass === "function" ? item.getViewClass().name : void 0) != null ? _ref : item.constructor.name;
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
      var params, _ref;
      params = {
        t: 'appview',
        cd: this.viewNameForPaneItem(item),
        dt: typeof item.getGrammar === "function" ? (_ref = item.getGrammar()) != null ? _ref.name : void 0 : void 0
      };
      return this.send(params);
    };

    Reporter.sendCommand = function(commandName) {
      var params, _base;
      if (this.commandCount == null) {
        this.commandCount = {};
      }
      if ((_base = this.commandCount)[commandName] == null) {
        _base[commandName] = 0;
      }
      this.commandCount[commandName]++;
      params = {
        t: 'event',
        ec: 'command',
        ea: commandName.split(':')[0],
        el: commandName,
        ev: this.commandCount[commandName]
      };
      return this.send(params);
    };

    Reporter.send = function(params) {
      extend(params, this.defaultParams());
      return this.request("https://www.google-analytics.com/collect?" + (querystring.stringify(params)));
    };

    Reporter.request = function(url) {
      if (navigator.onLine) {
        return post(url);
      }
    };

    Reporter.defaultParams = function() {
      var params, startDate;
      params = {};
      if (startDate = localStorage.getItem('metrics.sd')) {
        params.cd1 = startDate;
      }
      return extend(params, {
        v: 1,
        tid: "UA-3769691-33",
        cid: localStorage.getItem('metrics.userId'),
        an: 'atom',
        av: atom.getVersion(),
        sr: "" + screen.width + "x" + screen.height,
        aiid: getReleaseChannel()
      });
    };

    return Reporter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWV0cmljcy9saWIvcmVwb3J0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxRQUFBLHVEQUFBO0FBQUEsSUFEUSx1QkFBUSxzRUFDaEIsQ0FBQTtBQUFBLFNBQUEsbURBQUE7cUNBQUE7QUFDRSxXQUFBLGtCQUFBO2lDQUFBO0FBQ0UsUUFBQSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWMsS0FBZCxDQURGO0FBQUEsT0FERjtBQUFBLEtBQUE7V0FHQSxPQUpPO0VBQUEsQ0FIVCxDQUFBOztBQUFBLEVBU0EsSUFBQSxHQUFPLFNBQUMsR0FBRCxHQUFBO0FBQ0wsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQVUsSUFBQSxjQUFBLENBQUEsQ0FBVixDQUFBO0FBQUEsSUFDQSxHQUFHLENBQUMsSUFBSixDQUFTLE1BQVQsRUFBaUIsR0FBakIsQ0FEQSxDQUFBO1dBRUEsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFULEVBSEs7RUFBQSxDQVRQLENBQUE7O0FBQUEsRUFjQSxpQkFBQSxHQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFWLENBQUE7QUFDQSxJQUFBLElBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsQ0FBQSxHQUEwQixDQUFBLENBQTdCO2FBQ0UsT0FERjtLQUFBLE1BRUssSUFBRyxPQUFPLENBQUMs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

//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/reporter.coffee
