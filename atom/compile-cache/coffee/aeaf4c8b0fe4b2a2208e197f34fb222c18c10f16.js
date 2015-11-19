(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      directory: {
        title: 'Note Directory',
        description: 'The directory to archive notes',
        type: 'string',
        "default": process.env.ATOM_HOME + '/packages/notational-velocity/notebook'
      }
    },
    notationalVelocityView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'notational-velocity:toggle': (function(_this) {
          return function() {
            return _this.createView(state).toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.notationalVelocityView.destroy();
    },
    serialize: function() {
      return {
        notationalVelocityViewState: this.notationalVelocityView.serialize()
      };
    },
    createView: function(state) {
      var NotationalVelocityView;
      if (this.notationalVelocityView == null) {
        NotationalVelocityView = require('./notational-velocity-view');
        this.notationalVelocityView = new NotationalVelocityView(state.notationalVelocityViewState);
      }
      return this.notationalVelocityView;
    }
  };

}).call(this);
