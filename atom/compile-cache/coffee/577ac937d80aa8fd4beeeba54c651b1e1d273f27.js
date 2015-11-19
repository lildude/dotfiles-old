(function() {
  var CompositeDisposable, MinimapView, Mixin, TextEditor, ViewManagement, deprecate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  TextEditor = require('atom').TextEditor;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  deprecate = require('grim').deprecate;

  MinimapView = null;

  module.exports = ViewManagement = (function(_super) {
    __extends(ViewManagement, _super);

    function ViewManagement() {
      return ViewManagement.__super__.constructor.apply(this, arguments);
    }

    ViewManagement.prototype.minimapViews = {};

    ViewManagement.prototype.updateAllViews = function() {
      var id, view, _ref, _results;
      _ref = this.minimapViews;
      _results = [];
      for (id in _ref) {
        view = _ref[id];
        _results.push(view.onScrollViewResized());
      }
      return _results;
    };

    ViewManagement.prototype.minimapForEditorView = function(editorView) {
      return this.minimapForEditor(editorView != null ? editorView.getEditor() : void 0);
    };

    ViewManagement.prototype.minimapForEditor = function(editor) {
      if (editor != null) {
        return this.minimapViews[editor.id];
      }
    };

    ViewManagement.prototype.getActiveMinimap = function() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    };

    ViewManagement.prototype.observeMinimaps = function(iterator) {
      var createdCallback, disposable, id, minimapView, _ref;
      if (iterator == null) {
        return;
      }
      _ref = this.minimapViews;
      for (id in _ref) {
        minimapView = _ref[id];
        iterator({
          view: minimapView
        });
      }
      createdCallback = function(minimapView) {
        return iterator(minimapView);
      };
      disposable = this.onDidCreateMinimap(createdCallback);
      disposable.off = function() {
        deprecate('Use Disposable::dispose instead');
        return disposable.dispose();
      };
      return disposable;
    };

    ViewManagement.prototype.eachMinimapView = function(iterator) {
      deprecate('Use Minimap::observeMinimaps instead');
      return this.observeMinimaps(iterator);
    };

    ViewManagement.prototype.destroyViews = function() {
      var id, view, _ref, _ref1;
      _ref = this.minimapViews;
      for (id in _ref) {
        view = _ref[id];
        view.destroy();
      }
      if ((_ref1 = this.observePaneSubscription) != null) {
        _ref1.dispose();
      }
      return this.minimapViews = {};
    };

    ViewManagement.prototype.createViews = function() {
      return this.observePaneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneSubscriptions, paneView;
          paneSubscriptions = new CompositeDisposable;
          paneView = atom.views.getView(pane);
          paneSubscriptions.add(pane.onDidDestroy(function() {
            paneSubscriptions.dispose();
            return requestAnimationFrame(function() {
              return _this.updateAllViews();
            });
          }));
          paneSubscriptions.add(pane.observeActiveItem(function(item) {
            if (item instanceof TextEditor) {
              return paneView.classList.add('with-minimap');
            } else {
              return paneView.classList.remove('with-minimap');
            }
          }));
          paneSubscriptions.add(pane.observeItems(function(item) {
            if (item instanceof TextEditor) {
              _this.onEditorAdded(item, pane);
              return paneView.classList.add('with-minimap');
            } else {
              return paneView.classList.remove('with-minimap');
            }
          }));
          return _this.updateAllViews();
        };
      })(this));
    };

    ViewManagement.prototype.onEditorAdded = function(editor, pane) {
      var editorId, editorView, event, paneView, subscriptions, view;
      MinimapView || (MinimapView = require('../minimap-view'));
      editorId = editor.id;
      editorView = atom.views.getView(editor);
      paneView = atom.views.getView(pane);
      if (!((editorView != null) && (paneView != null))) {
        return;
      }
      if ((view = this.minimapViews[editorId]) != null) {
        view.paneView = paneView;
        view.setEditorView(editorView);
        view.detachFromPaneView();
        view.attachToPaneView();
        return;
      }
      view = new MinimapView(editorView, paneView);
      this.minimapViews[editorId] = view;
      event = {
        view: view
      };
      this.emitter.emit('did-create-minimap', event);
      view.updateMinimapRenderView();
      subscriptions = new CompositeDisposable;
      return subscriptions.add(editor.onDidDestroy((function(_this) {
        return function() {
          var _ref;
          view = _this.minimapViews[editorId];
          event = {
            view: view
          };
          if (view != null) {
            _this.emitter.emit('will-destroy-minimap', event);
            view.destroy();
            delete _this.minimapViews[editorId];
            _this.emitter.emit('did-destroy-minimap', event);
            if ((_ref = paneView.getActiveView()) != null ? _ref.classList.contains('editor') : void 0) {
              return paneView.classList.add('with-minimap');
            }
          }
        };
      })(this)));
    };

    return ViewManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0MsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBREQsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBR0MsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBSEQsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxJQUpkLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDZCQUFBLFlBQUEsR0FBYyxFQUFkLENBQUE7O0FBQUEsNkJBR0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLHdCQUFBO0FBQUE7QUFBQTtXQUFBLFVBQUE7d0JBQUE7QUFBQSxzQkFBQSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxFQUFBLENBQUE7QUFBQTtzQkFEYztJQUFBLENBSGhCLENBQUE7O0FBQUEsNkJBWUEsb0JBQUEsR0FBc0IsU0FBQyxVQUFELEdBQUE7YUFDcEIsSUFBQyxDQUFBLGdCQUFELHNCQUFrQixVQUFVLENBQUUsU0FBWixDQUFBLFVBQWxCLEVBRG9CO0lBQUEsQ0FadEIsQ0FBQTs7QUFBQSw2QkFxQkEsZ0JBQUEsR0FBa0IsU0FBQyxNQUFELEdBQUE7QUFDaEIsTUFBQSxJQUE0QixjQUE1QjtlQUFBLElBQUMsQ0FBQSxZQUFhLENBQUEsTUFBTSxDQUFDLEVBQVAsRUFBZDtPQURnQjtJQUFBLENBckJsQixDQUFBOztBQUFBLDZCQTJCQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsZ0JBQUQsQ0FBa0Is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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/view-management.coffee