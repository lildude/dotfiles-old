(function() {
  var $, Reporter, path, querystring, _;

  $ = require('atom').$;

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
      _.extend(params, this.defaultParams());
      return this.request({
        type: 'POST',
        url: "https://www.google-analytics.com/collect?" + (querystring.stringify(params))
      });
    };

    Reporter.request = function(options) {
      if (navigator.onLine) {
        return $.ajax(options);
      }
    };

    Reporter.defaultParams = function() {
      var params, startDate;
      params = {};
      if (startDate = localStorage.getItem('metrics.sd')) {
        params.cd1 = startDate;
      }
      return _.extend(params, {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUpKLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNROzBCQUNKOztBQUFBLElBQUEsUUFBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLFFBQUQsRUFBVyxJQUFYLEVBQWlCLEtBQWpCLEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FDRTtBQUFBLFFBQUEsQ0FBQSxFQUFHLE9BQUg7QUFBQSxRQUNBLEVBQUEsRUFBSSxRQURKO0FBQUEsUUFFQSxFQUFBLEVBQUksSUFGSjtBQUFBLFFBR0EsRUFBQSxFQUFJLEtBSEo7T0FERixDQUFBO2FBTUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLEVBUFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsSUFTQSxRQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsUUFBRCxFQUFXLElBQVgsRUFBaUIsS0FBakIsR0FBQTtBQUNYLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUNFO0FBQUEsUUFBQSxDQUFBLEVBQUcsUUFBSDtBQUFBLFFBQ0EsR0FBQSxFQUFLLFFBREw7QUFBQSxRQUVBLEdBQUEsRUFBSyxJQUZMO0FBQUEsUUFHQSxHQUFBLEVBQUssS0FITDtPQURGLENBQUE7YUFNQSxJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU4sRUFQVztJQUFBLENBVGIsQ0FBQTs7QUFBQSxJQWtCQSxRQUFDLENBQUEs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
//# sourceURL=/Users/lildude/.atom/packages/metrics/lib/reporter.coffee