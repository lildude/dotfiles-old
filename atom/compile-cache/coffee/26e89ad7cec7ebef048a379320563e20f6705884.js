(function() {
  var CompositeDisposable, GuideUri, GuideView, Reporter, WelcomeUri, WelcomeView, createGuideView, createWelcomeView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Reporter = null;

  WelcomeView = null;

  GuideView = null;

  WelcomeUri = 'atom://welcome/welcome';

  GuideUri = 'atom://welcome/guide';

  createWelcomeView = function(state) {
    if (WelcomeView == null) {
      WelcomeView = require('./welcome-view');
    }
    return new WelcomeView(state);
  };

  createGuideView = function(state) {
    if (GuideView == null) {
      GuideView = require('./guide-view');
    }
    return new GuideView(state);
  };

  module.exports = {
    config: {
      showOnStartup: {
        type: 'boolean',
        "default": true,
        description: 'Show the Welcome package next time a new window is created. This config setting is automatically set to `false` after a new window is created and the Welcome package is shown.'
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return process.nextTick((function(_this) {
        return function() {
          _this.subscriptions.add(atom.deserializers.add({
            name: 'WelcomeView',
            deserialize: function(state) {
              return createWelcomeView(state);
            }
          }));
          _this.subscriptions.add(atom.deserializers.add({
            name: 'GuideView',
            deserialize: function(state) {
              return createGuideView(state);
            }
          }));
          _this.subscriptions.add(atom.workspace.addOpener(function(filePath) {
            if (filePath === WelcomeUri) {
              return createWelcomeView({
                uri: WelcomeUri
              });
            }
          }));
          _this.subscriptions.add(atom.workspace.addOpener(function(filePath) {
            if (filePath === GuideUri) {
              return createGuideView({
                uri: GuideUri
              });
            }
          }));
          _this.subscriptions.add(atom.commands.add('atom-workspace', 'welcome:show', function() {
            return _this.show();
          }));
          if (atom.config.get('welcome.showOnStartup')) {
            _this.show();
            if (Reporter == null) {
              Reporter = require('./reporter');
            }
            Reporter.sendEvent('show-on-initial-load');
            return atom.config.set('welcome.showOnStartup', false);
          }
        };
      })(this));
    },
    show: function() {
      atom.workspace.open(WelcomeUri);
      return atom.workspace.open(GuideUri, {
        split: 'right'
      });
    },
    consumeReporter: function(reporter) {
      if (Reporter == null) {
        Reporter = require('./reporter');
      }
      return Reporter.setReporter(reporter);
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvd2VsY29tZS9saWIvd2VsY29tZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0dBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxJQURYLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsSUFGZCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLElBSFosQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSx3QkFMYixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLHNCQU5YLENBQUE7O0FBQUEsRUFRQSxpQkFBQSxHQUFvQixTQUFDLEtBQUQsR0FBQTs7TUFDbEIsY0FBZSxPQUFBLENBQVEsZ0JBQVI7S0FBZjtXQUNJLElBQUEsV0FBQSxDQUFZLEtBQVosRUFGYztFQUFBLENBUnBCLENBQUE7O0FBQUEsRUFZQSxlQUFBLEdBQWtCLFNBQUMsS0FBRCxHQUFBOztNQUNoQixZQUFhLE9BQUEsQ0FBUSxjQUFSO0tBQWI7V0FDSSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBRlk7RUFBQSxDQVpsQixDQUFBOztBQUFBLEVBZ0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxpTEFGYjtPQURGO0tBREY7QUFBQSxJQU1BLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTthQUVBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FB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

//# sourceURL=/Users/lildude/.atom/packages/welcome/lib/welcome.coffee
