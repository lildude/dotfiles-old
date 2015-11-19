(function() {
  var CompositeDisposable, CoveringView, SideView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  CoveringView = require('./covering-view').CoveringView;

  SideView = (function(_super) {
    __extends(SideView, _super);

    function SideView() {
      return SideView.__super__.constructor.apply(this, arguments);
    }

    SideView.content = function(side, editor) {
      return this.div({
        "class": "side " + (side.klass()) + " " + side.position + " ui-site-" + (side.site())
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'controls'
          }, function() {
            _this.label({
              "class": 'text-highlight'
            }, side.ref);
            _this.span({
              "class": 'text-subtle'
            }, "// " + (side.description()));
            return _this.span({
              "class": 'pull-right'
            }, function() {
              _this.button({
                "class": 'btn btn-xs inline-block-tight revert',
                click: 'revert',
                outlet: 'revertBtn'
              }, 'Revert');
              return _this.button({
                "class": 'btn btn-xs inline-block-tight',
                click: 'useMe',
                outlet: 'useMeBtn'
              }, 'Use Me');
            });
          });
        };
      })(this));
    };

    SideView.prototype.initialize = function(side, editor) {
      this.side = side;
      this.subs = new CompositeDisposable;
      this.decoration = null;
      SideView.__super__.initialize.call(this, editor);
      this.detectDirty();
      this.prependKeystroke(this.side.eventName(), this.useMeBtn);
      return this.prependKeystroke('merge-conflicts:revert-current', this.revertBtn);
    };

    SideView.prototype.attached = function() {
      SideView.__super__.attached.apply(this, arguments);
      this.decorate();
      return this.subs.add(this.side.conflict.onDidResolveConflict((function(_this) {
        return function() {
          _this.deleteMarker(_this.side.refBannerMarker);
          if (!_this.side.wasChosen()) {
            _this.deleteMarker(_this.side.marker);
          }
          _this.remove();
          return _this.cleanup();
        };
      })(this)));
    };

    SideView.prototype.cleanup = function() {
      SideView.__super__.cleanup.apply(this, arguments);
      return this.subs.dispose();
    };

    SideView.prototype.cover = function() {
      return this.side.refBannerMarker;
    };

    SideView.prototype.decorate = function() {
      var args, _ref;
      if ((_ref = this.decoration) != null) {
        _ref.destroy();
      }
      if (this.side.conflict.isResolved() && !this.side.wasChosen()) {
        return;
      }
      args = {
        type: 'line',
        "class": this.side.lineClass()
      };
      return this.decoration = this.editor.decorateMarker(this.side.marker, args);
    };

    SideView.prototype.conflict = function() {
      return this.side.conflict;
    };

    SideView.prototype.isDirty = function() {
      return this.side.isDirty;
    };

    SideView.prototype.includesCursor = function(cursor) {
      var h, m, p, t, _ref;
      m = this.side.marker;
      _ref = [m.getHeadBufferPosition(), m.getTailBufferPosition()], h = _ref[0], t = _ref[1];
      p = cursor.getBufferPosition();
      return t.isLessThanOrEqual(p) && h.isGreaterThanOrEqual(p);
    };

    SideView.prototype.useMe = function() {
      this.side.resolve();
      return this.decorate();
    };

    SideView.prototype.revert = function() {
      this.editor.setTextInBufferRange(this.side.marker.getBufferRange(), this.side.originalText);
      return this.decorate();
    };

    SideView.prototype.detectDirty = function() {
      var currentText;
      currentText = this.editor.getTextInBufferRange(this.side.marker.getBufferRange());
      this.side.isDirty = currentText !== this.side.originalText;
      this.decorate();
      this.removeClass('dirty');
      if (this.side.isDirty) {
        return this.addClass('dirty');
      }
    };

    SideView.prototype.toString = function() {
      return "{SideView of: " + this.side + "}";
    };

    return SideView;

  })(CoveringView);

  module.exports = {
    SideView: SideView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi92aWV3L3NpZGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSLEVBQWhCLFlBREQsQ0FBQTs7QUFBQSxFQUdNO0FBRUosK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQVEsT0FBQSxHQUFNLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBQSxDQUFELENBQU4sR0FBb0IsR0FBcEIsR0FBdUIsSUFBSSxDQUFDLFFBQTVCLEdBQXFDLFdBQXJDLEdBQStDLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFELENBQXZEO09BQUwsRUFBNEUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDMUUsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFVBQVA7V0FBTCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBUCxFQUFnQyxJQUFJLENBQUMsR0FBckMsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxPQUFBLEVBQU8sYUFBUDthQUFOLEVBQTZCLEtBQUEsR0FBSSxDQUFDLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FBRCxD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

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/view/side-view.coffee
