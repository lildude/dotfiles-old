(function() {
  var MinimapView, Mixin, ViewManagement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

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
      return this.minimapForEditor(atom.workspace.getActiveEditor());
    };

    ViewManagement.prototype.eachMinimapView = function(iterator) {
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
      return {
        off: (function(_this) {
          return function() {
            return disposable.dispose();
          };
        })(this)
      };
    };

    ViewManagement.prototype.destroyViews = function() {
      var id, view, _ref, _ref1;
      _ref = this.minimapViews;
      for (id in _ref) {
        view = _ref[id];
        view.destroy();
      }
      if ((_ref1 = this.eachEditorViewSubscription) != null) {
        _ref1.off();
      }
      return this.minimapViews = {};
    };

    ViewManagement.prototype.createViews = function() {
      return this.eachEditorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var editorId, event, paneView, view;
          MinimapView || (MinimapView = require('../minimap-view'));
          editorId = editorView.editor.id;
          paneView = editorView.getPaneView();
          if (paneView == null) {
            return;
          }
          if ((view = _this.minimapViews[editorId]) != null) {
            view.setEditorView(editorView);
            view.detachFromPaneView();
            view.attachToPaneView();
            return;
          }
          view = new MinimapView(editorView);
          _this.minimapViews[editorId] = view;
          event = {
            view: view
          };
          _this.emit('minimap-view:created', event);
          _this.emitter.emit('did-create-minimap', event);
          view.updateMinimapRenderView();
          return editorView.editor.on('destroyed', function() {
            var _ref;
            view = _this.minimapViews[editorId];
            event = {
              view: view
            };
            if (view != null) {
              _this.emit('minimap-view:will-be-destroyed', event);
              _this.emitter.emit('will-destroy-minimap', event);
              view.destroy();
              delete _this.minimapViews[editorId];
              _this.emit('minimap-view:destroyed', {
                view: view
              });
              _this.emitter.emit('did-destroy-minimap', event);
              if ((_ref = paneView.activeView) != null ? _ref.hasClass('editor') : void 0) {
                return paneView.addClass('with-minimap');
              }
            }
          });
        };
      })(this));
    };

    return ViewManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLElBRGQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNkJBQUEsWUFBQSxHQUFjLEVBQWQsQ0FBQTs7QUFBQSw2QkFHQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsd0JBQUE7QUFBQTtBQUFBO1dBQUEsVUFBQTt3QkFBQTtBQUFBLHNCQUFBLElBQUksQ0FBQyxtQkFBTCxDQUFBLEVBQUEsQ0FBQTtBQUFBO3NCQURjO0lBQUEsQ0FIaEIsQ0FBQTs7QUFBQSw2QkFZQSxvQkFBQSxHQUFzQixTQUFDLFVBQUQsR0FBQTthQUNwQixJQUFDLENBQUEsZ0JBQUQsc0JBQWtCLFVBQVUsQ0FBRSxTQUFaLENBQUEsVUFBbEIsRUFEb0I7SUFBQSxDQVp0QixDQUFBOztBQUFBLDZCQXFCQSxnQkFBQSxHQUFrQixTQUFDLE1BQUQsR0FBQTtBQUNoQixNQUFBLElBQTRCLGNBQTVCO2VBQUEsSUFBQyxDQUFBLFlBQWEsQ0FBQSxNQUFNLENBQUMsRUFBUCxFQUFkO09BRGdCO0lBQUEsQ0FyQmxCLENBQUE7O0FBQUEsNkJBMkJBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFsQixFQUFIO0lBQUEsQ0EzQmxCLENBQUE7O0FBQUEsNkJBdUNBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixVQUFBLGtEQUFBO0FBQUEsTUFBQSxJQUFjLGdCQUFkO0FBQUEsY0FB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/view-management.coffee