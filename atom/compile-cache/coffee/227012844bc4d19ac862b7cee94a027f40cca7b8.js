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
        sr: "" + screen.width + "x" + screen.height
      });
    };

    return Reporter;

  })();

}).call(this);
