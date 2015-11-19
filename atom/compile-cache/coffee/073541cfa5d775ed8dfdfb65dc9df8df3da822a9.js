(function() {
  var Reporter, extend, path, post, querystring,
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

  module.exports = Reporter = (function() {
    function Reporter() {}

    Reporter.sendEvent = function(category, name, label, value) {
      var params;
      params = {
        t: 'event',
        ec: category,
        ea: name,
        el: label,
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
        sr: "" + screen.width + "x" + screen.height
      });
    };

    return Reporter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxRQUFBLHVEQUFBO0FBQUEsSUFEUSx1QkFBUSxzRUFDaEIsQ0FBQTtBQUFBLFNBQUEsbURBQUE7cUNBQUE7QUFDRSxXQUFBLGtCQUFBO2lDQUFBO0FBQ0UsUUFBQSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWMsS0FBZCxDQURGO0FBQUEsT0FERjtBQUFBLEtBQUE7V0FHQSxPQUpPO0VBQUEsQ0FIVCxDQUFBOztBQUFBLEVBU0EsSUFBQSxHQUFPLFNBQUMsR0FBRCxHQUFBO0FBQ0wsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQVUsSUFBQSxjQUFBLENBQUEsQ0FBVixDQUFBO0FBQUEsSUFDQSxHQUFHLENBQUMsSUFBSixDQUFTLE1BQVQsRUFBaUIsR0FBakIsQ0FEQSxDQUFBO1dBRUEsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFULEVBSEs7RUFBQSxDQVRQLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUNROzBCQUNKOztBQUFBLElBQUEsUUFBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLFFBQUQsRUFBVyxJQUFYLEVBQWlCLEtBQWpCLEVBQXdCLEtBQXhCLEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FDRTtBQUFBLFFBQUEsQ0FBQSxFQUFHLE9BQUg7QUFBQSxRQUNBLEVBQUEsRUFBSSxRQURKO0FBQUEsUUFFQSxFQUFBLEVBQUksSUFGSjtBQUFBLFFBR0EsRUFBQSxFQUFJLEtBSEo7QUFB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
//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/reporter.coffee