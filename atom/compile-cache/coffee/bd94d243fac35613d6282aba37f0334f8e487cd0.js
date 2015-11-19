(function() {
  var Decoration, DecorationManagement, Emitter, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Mixin = require('mixto');

  path = require('path');

  Emitter = require('event-kit').Emitter;

  Decoration = require(path.join(atom.config.resourcePath, 'src', 'decoration'));

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      if (this.emitter == null) {
        this.emitter = new Emitter;
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.onDidAddDecoration = function(callback) {
      return this.emitter.on('did-add-decoration', callback);
    };

    DecorationManagement.prototype.onDidRemoveDecoration = function(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    };

    DecorationManagement.prototype.onDidChangeDecoration = function(callback) {
      return this.emitter.on('did-change-decoration', callback);
    };

    DecorationManagement.prototype.onDidUpdateDecoration = function(callback) {
      return this.emitter.on('did-update-decoration', callback);
    };

    DecorationManagement.prototype.decorationForId = function(id) {
      return this.decorationsById[id];
    };

    DecorationManagement.prototype.decorationsByTypesForRow = function() {
      var array, decoration, decorations, id, out, row, types, _i, _j, _len, _ref;
      row = arguments[0], types = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), decorations = arguments[_i++];
      out = [];
      for (id in decorations) {
        array = decorations[id];
        for (_j = 0, _len = array.length; _j < _len; _j++) {
          decoration = array[_j];
          if ((_ref = decoration.getProperties().type, __indexOf.call(types, _ref) >= 0) && decoration.getMarker().getScreenRange().intersectsRow(row)) {
            out.push(decoration);
          }
        }
      }
      return out;
    };

    DecorationManagement.prototype.decorationsForScreenRowRange = function(startScreenRow, endScreenRow) {
      var decorations, decorationsByMarkerId, marker, _i, _len, _ref;
      decorationsByMarkerId = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }
      return decorationsByMarkerId;
    };

    DecorationManagement.prototype.decorateMarker = function(marker, decorationParams) {
      var cls, decoration, _base, _base1, _base2, _base3, _base4, _name, _name1, _name2, _name3, _name4;
      if (this.destroyed) {
        return;
      }
      if (marker == null) {
        return;
      }
      marker = this.getMarker(marker.id);
      if (marker == null) {
        return;
      }
      if ((decorationParams.scope == null) && (decorationParams["class"] != null)) {
        cls = decorationParams["class"].split(' ').join('.');
        decorationParams.scope = ".minimap ." + cls;
      }
      if ((_base = this.decorationMarkerDestroyedSubscriptions)[_name = marker.id] == null) {
        _base[_name] = marker.onDidDestroy((function(_this) {
          return function() {
            return _this.removeAllDecorationsForMarker(marker);
          };
        })(this));
      }
      if ((_base1 = this.decorationMarkerChangedSubscriptions)[_name1 = marker.id] == null) {
        _base1[_name1] = marker.onDidChange((function(_this) {
          return function(event) {
            var decoration, decorations, end, start, _i, _len, _ref;
            decorations = _this.decorationsByMarkerId[marker.id];
            if (decorations != null) {
              for (_i = 0, _len = decorations.length; _i < _len; _i++) {
                decoration = decorations[_i];
                _this.emitter.emit('did-change-decoration', {
                  marker: marker,
                  decoration: decoration,
                  event: event
                });
              }
            }
            start = event.oldTailScreenPosition;
            end = event.oldHeadScreenPosition;
            if (start.row > end.row) {
              _ref = [end, start], start = _ref[0], end = _ref[1];
            }
            return _this.emitRangeChanges({
              start: start,
              end: end,
              screenDelta: end - start
            });
          };
        })(this));
      }
      decoration = new Decoration(marker, this, decorationParams);
      if ((_base2 = this.decorationsByMarkerId)[_name2 = marker.id] == null) {
        _base2[_name2] = [];
      }
      this.decorationsByMarkerId[marker.id].push(decoration);
      this.decorationsById[decoration.id] = decoration;
      if ((_base3 = this.decorationUpdatedSubscriptions)[_name3 = decoration.id] == null) {
        _base3[_name3] = decoration.onDidChangeProperties((function(_this) {
          return function(event) {
            return _this.emitDecorationChanges(decoration);
          };
        })(this));
      }
      if ((_base4 = this.decorationDestroyedSubscriptions)[_name4 = decoration.id] == null) {
        _base4[_name4] = decoration.onDidDestroy((function(_this) {
          return function(event) {
            return _this.removeDecoration(decoration);
          };
        })(this));
      }
      this.emitDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });
      return decoration;
    };

    DecorationManagement.prototype.emitDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.emitRangeChanges(range);
    };

    DecorationManagement.prototype.emitRangeChanges = function(range) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, screenDelta, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      if (isNaN(screenDelta)) {
        screenDelta = 0;
      }
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.emitChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker;
      if (decoration == null) {
        return;
      }
      marker = decoration.marker;
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.emitDecorationChanges(decoration);
      this.decorationUpdatedSubscriptions[decoration.id].dispose();
      this.decorationDestroyedSubscriptions[decoration.id].dispose();
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
        delete this.decorationsById[decoration.id];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        if (decorations.length === 0) {
          return this.removedAllMarkerDecorations(marker);
        }
      }
    };

    DecorationManagement.prototype.removeAllDecorationsForMarker = function(marker) {
      var decoration, decorations, _i, _len, _ref;
      if (marker == null) {
        return;
      }
      decorations = (_ref = this.decorationsByMarkerId[marker.id]) != null ? _ref.slice() : void 0;
      if (!decorations) {
        return;
      }
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        this.emitDecorationChanges(decoration);
      }
      return this.removedAllMarkerDecorations(marker);
    };

    DecorationManagement.prototype.removedAllMarkerDecorations = function(marker) {
      if (marker == null) {
        return;
      }
      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();
      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      return delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    };

    DecorationManagement.prototype.removeAllDecorations = function() {
      var decoration, id, sub, _ref, _ref1, _ref2, _ref3, _ref4;
      _ref = this.decorationMarkerChangedSubscriptions;
      for (id in _ref) {
        sub = _ref[id];
        sub.dispose();
      }
      _ref1 = this.decorationMarkerDestroyedSubscriptions;
      for (id in _ref1) {
        sub = _ref1[id];
        sub.dispose();
      }
      _ref2 = this.decorationUpdatedSubscriptions;
      for (id in _ref2) {
        sub = _ref2[id];
        sub.dispose();
      }
      _ref3 = this.decorationDestroyedSubscriptions;
      for (id in _ref3) {
        sub = _ref3[id];
        sub.dispose();
      }
      _ref4 = this.decorationsById;
      for (id in _ref4) {
        decoration = _ref4[id];
        decoration.destroy();
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BRkQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQXRCLEVBQW9DLEtBQXBDLEVBQTJDLFlBQTNDLENBQVIsQ0FIYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQTtBQUFBLGdCQUFBOztBQUFBLG1DQUdBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTs7UUFDckIsSUFBQyxDQUFBLFVBQVcsR0FBQSxDQUFBO09BQVo7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEVBRG5CLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUZ6QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsb0NBQUQsR0FBd0MsRUFIeEMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLHNDQUFELEdBQTBDLEVBSjFDLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSw4QkFBRCxHQUFrQyxFQUxsQyxDQUFBO2FBTUEsSUFBQyxDQUFBLGdDQUFELEdBQW9DLEdBUGY7SUFBQSxDQUh2QixDQUFBOztBQUFBLG1DQVlBLGtCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO2FBQ2xCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLG9CQUFaLEVBQWtDLFFBQWxDLEVBRGtCO0lBQUEsQ0FacEIsQ0FBQTs7QUFBQSxtQ0FlQSxxQkFBQSxHQUF1QixTQUFDLFFBQUQsR0FBQTthQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSx1QkFBWixFQUFxQyxRQUFyQyxFQURxQjtJQUFBLENBZnZCLENBQUE7O0FBQUEsbUNBa0JBLHFCQUFBLEdBQXVCLFNBQUMsUUFBRCxHQUFBO2FBQ3JCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLHVCQUFaLEVBQXFDLFFBQXJDLEVBRHFCO0lBQUEsQ0FsQnZCLENBQUE7O0FBQUEsbUNBcUJBLHFCQUFBLEdBQXVCLFNBQUMsUUFBRCxHQUFBO2FBQ3JCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLHVCQUFaLEVBQXFDLFFBQXJDLEVBRHFCO0lBQUEsQ0FyQnZCLENBQUE7O0FBQUEsbUNBNkJBLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFDZixJQUFDLENBQUEsZUFBZ0IsQ0FBQSxFQUFBLEVBREY7SUFBQSxDQTdCakIsQ0FBQTs7QUFBQSxtQ0F3Q0Esd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsdUVBQUE7QUFBQSxNQUR5QixvQkFBSyxzR0FBVSw2QkFDeEMsQ0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUNBLFdBQUEsaUJBQUE7Z0NBQUE7QUFDRSxhQUFBLDRDQUFBO2lDQUFBO0FBQ0UsVUFBQSxJQUFHLFFBQUEsVUFBVSxDQUFDLGFBQVgsQ0FBQSxDQUEwQixDQUFDLElBQTNCLEVBQUEsZUFBbUMsS0FBbkMsRUFBQSxJQUFBLE1BQUEsQ0FBQSxJQUNBLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FBc0IsQ0FBQyxjQUF2QixDQUFBLENBQXVDLENBQUMsYUFBeEMsQ0FBc0QsR0FBdEQsQ0FESDtBQUVFLFlBQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxVQUFULENBQUEsQ0FGRjtXQURGO0FBQUEsU0FERjtBQUFBLE9BREE7YUFPQSxJQVJ3QjtJQUFBLENBeEMxQixDQUFBOztBQUFBLG1DQXdEQSw0QkFBQSxHQUE4QixTQUFDLGNBQUQsRUFBaUIsWUFBakIsR0FBQTtBQUM1QixVQUFBLDBEQUFBO0FBQUEsTUFBQSxxQkFBQSxHQUF3QixFQUF4QixDQUFBO0FBRUE7OztBQUFBLFdBQUEsMkNBQUE7MEJBQUE7QUFDRSxRQUFBLElBQUcsV0FBQSxHQUFjLElBQUMsQ0FBQSxxQkFBc0IsQ0FBQSxNQUFNLENBQUMsRUFBUCxDQUF4QztBQUNFLFVBQUEscUJBQXNCLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBdEIsR0FBbUMsV0FBbkMsQ0FERjtTQURGO0FBQUEsT0FGQTthQU1BLHNCQVA0QjtJQUFBLENBeEQ5QixDQUFBOztBQUFBLG1DQWlHQSxjQUFBLEdBQWdCLFNBQUMsTUFBRCxFQUFTLGdCQUFULEdBQUE7QUFDZCxVQUFBLDZGQUFBO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxTQUFYO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFFQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFNLENBQUMsRUFBbEIsQ0FGVCxDQUFBO0FBR0EsTUFBQSxJQUFjLGNBQWQ7QUFBQSxjQUFBLENBQUE7T0FIQTtBQUtBLE1BQUEsSUFBSSxnQ0FBRCxJQUE2QixtQ0FBaEM7QUFDRSxRQUFBLEdBQUEsR0FBTSxnQkFBZ0IsQ0FBQyxPQUFELENBQU0sQ0FBQyxLQUF2QixDQUE2QixHQUE3QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLEdBQXZDLENBQU4sQ0FBQTtBQUFBLFFBQ0EsZ0JBQWdCLENBQUMsS0FBakIsR0FBMEIsWUFBQSxHQUFZLEdBRHRDLENBREY7T0FMQTs7dUJBU3NELE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUN4RSxLQUFDLENBQUEsNkJBQUQsQ0FBK0IsTUFBL0IsRUFEd0U7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtPQVR0RDs7eUJBWW9ELE1BQU0sQ0FBQyxXQUFQLENBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7QUFDckUsZ0JBQUEsbURBQUE7QUFBQSxZQUFBLFdBQUEsR0FBYyxLQUFDLENBQUEscUJBQXNCLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBckMsQ0FBQTtBQUlBLFlBQUEsSUFBRyxtQkFBSDtBQUNFLG1CQUFBLGtEQUFBOzZDQUFBO0FBQ0UsZ0JBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsdUJBQWQsRUFBdUM7QUFBQSxrQkFBQyxRQUFBLE1BQUQ7QUFBQSxrQkFBUyxZQUFBLFVBQVQ7QUFBQSxrQkFBcUIsT0FBQSxLQUFyQjtpQkFBdkMsQ0FBQSxDQURGO0FBQUEsZUFERjthQUpBO0FBQUEsWUFRQSxLQUFBLEdBQVEsS0FBSyxDQUFDLHFCQVJkLENBQUE7QUFBQSxZQVNBLEdBQUEsR0FBTSxLQUFLLENBQUMscUJBVFosQ0FBQTtBQVdBLFlBQUEsSUFBK0IsS0FBSyxDQUFDLEdBQU4sR0FBWSxHQUFHLENBQUMsR0FBL0M7QUFBQSxjQUFBLE9BQWUsQ0FBQyxHQUFELEVBQU0sS0FBTixDQUFmLEVBQUMsZUFBRCxFQUFRLGFBQVIsQ0FBQTthQVhBO21CQWFBLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQjtBQUFBLGNBQUMsT0FBQSxLQUFEO0FBQUEsY0FBUSxLQUFBLEdBQVI7QUFBQSxjQUFhLFdBQUEsRUFBYSxHQUFBLEdBQU0sS0FBaEM7YUFBbEIsRUFkcUU7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQjtPQVpwRDtBQUFBLE1BNEJBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsTUFBWCxFQUFtQixJQUFuQixFQUF5QixnQkFBekIsQ0E1QmpCLENBQUE7O3lCQTZCcUM7T0E3QnJDO0FBQUEsTUE4QkEsSUFBQyxDQUFBLHFCQUFzQixDQUFBLE1BQU0sQ0FBQyxFQUFQLENBQVUsQ0FBQyxJQUFsQyxDQUF1QyxVQUF2QyxDQTlCQSxDQUFBO0FBQUEsTUErQkEsSUFBQyxDQUFBLGVBQWdCLENBQUEsVUFBVSxDQUFDLEVBQVgsQ0FBakIsR0FBa0MsVUEvQmxDLENBQUE7O3lCQWlDa0QsVUFBVSxDQUFDLHFCQUFYLENBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7bUJBQ2pGLEtBQUMsQ0FBQSxxQkFBRCxDQUF1QixVQUF2QixFQURpRjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDO09BakNsRDs7eUJBb0NvRCxVQUFVLENBQUMsWUFBWCxDQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO21CQUMxRSxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsVUFBbEIsRUFEMEU7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtPQXBDcEQ7QUFBQSxNQXVDQSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsVUFBdkIsQ0F2Q0EsQ0FBQTtBQUFBLE1Bd0NBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLG9CQUFkLEVBQW9DO0FBQUEsUUFBQyxRQUFBLE1BQUQ7QUFBQSxRQUFTLFlBQUEsVUFBVDtPQUFwQyxDQXhDQSxDQUFBO2FBeUNBLFdBMUNjO0lBQUEsQ0FqR2hCLENBQUE7O0FBQUEsbUNBaUpBLHFCQUFBLEdBQXVCLFNBQUMsVUFBRCxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBVSxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFoQyxDQUFBLENBQVY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBbEIsQ0FBQSxDQURSLENBQUE7QUFFQSxNQUFBLElBQWMsYUFBZDtBQUFBLGNBQUEsQ0FBQTtPQUZBO2FBSUEsSUFBQyxDQUFBLGdCQUFELENBQWtCLEtBQWxCLEVBTHFCO0lBQUEsQ0FqSnZCLENBQUE7O0FBQUEsbUNBMkpBLGdCQUFBLEdBQWtCLFNBQUMsS0FBRCxHQUFBO0FBQ2hCLFVBQUEscUdBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUE3QixDQUFBO0FBQUEsTUFDQSxZQUFBLEdBQWUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUR6QixDQUFBO0FBQUEsTUFFQSxxQkFBQSxHQUF5QixJQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUZ6QixDQUFBO0FBQUEsTUFHQSxzQkFBQSxHQUF5QixJQUFDLENBQUEsd0JBQUQsQ0FBQSxDQUh6QixDQUFBO0FBQUEsTUFJQSxXQUFBLEdBQWMsQ0FBQyxxQkFBQSxHQUF3QixzQkFBekIsQ0FBQSxHQUFtRCxDQUFDLFlBQUEsR0FBZSxjQUFoQixDQUpqRSxDQUFBO0FBTUEsTUFBQSxJQUFtQixLQUFBLENBQU0sV0FBTixDQUFuQjtBQUFBLFFBQUEsV0FBQSxHQUFjLENBQWQsQ0FBQTtPQU5BO0FBQUEsTUFRQSxXQUFBLEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsUUFDQSxHQUFBLEVBQUssWUFETDtBQUFBLFFBRUEsV0FBQSxFQUFhLFdBRmI7T0FURixDQUFBO2FBYUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxXQUFiLEVBZGdCO0lBQUEsQ0EzSmxCLENBQUE7O0FBQUEsbUNBOEtBLGdCQUFBLEdBQWtCLFNBQUMsVUFBRCxHQUFBO0FBQ2hCLFVBQUEsMEJBQUE7QUFBQSxNQUFBLElBQWMsa0JBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0MsU0FBVSxXQUFWLE1BREQsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLENBQWMsV0FBQSxHQUFjLElBQUMsQ0FBQSxxQkFBc0IsQ0FBQSxNQUFNLENBQUMsRUFBUCxDQUFyQyxDQUFkO0FBQUEsY0FBQSxDQUFBO09BRkE7QUFBQSxNQUlBLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixVQUF2QixDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSw4QkFBK0IsQ0FBQSxVQUFVLENBQUMsRUFBWCxDQUFjLENBQUMsT0FBL0MsQ0FBQSxDQU5BLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxnQ0FBaUMsQ0FBQSxVQUFVLENBQUMsRUFBWCxDQUFjLENBQUMsT0FBakQsQ0FBQSxDQVBBLENBQUE7QUFBQSxNQVNBLE1BQUEsQ0FBQSxJQUFRLENBQUEsOEJBQStCLENBQUEsVUFBVSxDQUFDLEVBQVgsQ0FUdkMsQ0FBQTtBQUFBLE1BVUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxnQ0FBaUMsQ0FBQSxVQUFVLENBQUMsRUFBWCxDQVZ6QyxDQUFBO0FBQUEsTUFZQSxLQUFBLEdBQVEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsVUFBcEIsQ0FaUixDQUFBO0FBY0EsTUFBQSxJQUFHLEtBQUEsR0FBUSxDQUFBLENBQVg7QUFDRSxRQUFBLFdBQVcsQ0FBQyxNQUFaLENBQW1CLEtBQW5CLEVBQTBCLENBQTFCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFBLElBQVEsQ0FBQSxlQUFnQixDQUFBLFVBQVUsQ0FBQyxFQUFYLENBRHhCLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHVCQUFkLEVBQXVDO0FBQUEsVUFBQyxRQUFBLE1BQUQ7QUFBQSxVQUFTLFlBQUEsVUFBVDtTQUF2QyxDQUZBLENBQUE7QUFHQSxRQUFBLElBQXdDLFdBQVcsQ0FBQyxNQUFaLEtBQXNCLENBQTlEO2lCQUFBLElBQUMsQ0FBQSwyQkFBRCxDQUE2QixNQUE3QixFQUFBO1NBSkY7T0FmZ0I7SUFBQSxDQTlLbEIsQ0FBQTs7QUFBQSxtQ0FzTUEsNkJBQUEsR0FBK0IsU0FBQyxNQUFELEdBQUE7QUFDN0IsVUFBQSx1Q0FBQTtBQUFBLE1BQUEsSUFBYyxjQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLFdBQUEsZ0VBQStDLENBQUUsS0FBbkMsQ0FBQSxVQURkLENBQUE7QUFFQSxNQUFBLElBQUEsQ0FBQSxXQUFBO0FBQUEsY0FBQSxDQUFBO09BRkE7QUFHQSxXQUFBLGtEQUFBO3FDQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyx1QkFBZCxFQUF1QztBQUFBLFVBQUMsUUFBQSxNQUFEO0FBQUEsVUFBUyxZQUFBLFVBQVQ7U0FBdkMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsVUFBdkIsQ0FEQSxDQURGO0FBQUEsT0FIQTthQU9BLElBQUMsQ0FBQSwyQkFBRCxDQUE2QixNQUE3QixFQVI2QjtJQUFBLENBdE0vQixDQUFBOztBQUFBLG1DQW1OQSwyQkFBQSxHQUE2QixTQUFDLE1BQUQsR0FBQTtBQUMzQixNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsb0NBQXFDLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBVSxDQUFDLE9BQWpELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsc0NBQXVDLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBVSxDQUFDLE9BQW5ELENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFJQSxNQUFBLENBQUEsSUFBUSxDQUFBLHFCQUFzQixDQUFBLE1BQU0sQ0FBQyxFQUFQLENBSjlCLENBQUE7QUFBQSxNQUtBLE1BQUEsQ0FBQSxJQUFRLENBQUEsb0NBQXFDLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FMN0MsQ0FBQTthQU1BLE1BQUEsQ0FBQSxJQUFRLENBQUEsc0NBQXVDLENBQUEsTUFBTSxDQUFDLEVBQVAsRUFQcEI7SUFBQSxDQW5ON0IsQ0FBQTs7QUFBQSxtQ0E0TkEsb0JBQUEsR0FBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEscURBQUE7QUFBQTtBQUFBLFdBQUEsVUFBQTt1QkFBQTtBQUFBLFFBQUEsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFBLENBQUE7QUFBQSxPQUFBO0FBQ0E7QUFBQSxXQUFBLFdBQUE7d0JBQUE7QUFBQSxRQUFBLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FEQTtBQUVBO0FBQUEsV0FBQSxXQUFBO3dCQUFBO0FBQUEsUUFBQSxHQUFHLENBQUMsT0FBSixDQUFBLENBQUEsQ0FBQTtBQUFBLE9BRkE7QUFHQTtBQUFBLFdBQUEsV0FBQTt3QkFBQTtBQUFBLFFBQUEsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFBLENBQUE7QUFBQSxPQUhBO0FBSUE7QUFBQSxXQUFBLFdBQUE7K0JBQUE7QUFBQSxRQUFBLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FKQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsRUFObkIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLHFCQUFELEdBQXlCLEVBUHpCLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxvQ0FBRCxHQUF3QyxFQVJ4QyxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsc0NBQUQsR0FBMEMsRUFUMUMsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLDhCQUFELEdBQWtDLEVBVmxDLENBQUE7YUFXQSxJQUFDLENBQUEsZ0NBQUQsR0FBb0MsR0FaaEI7SUFBQSxDQTVOdEIsQ0FBQTs7QUFBQSxtQ0ErT0EsaUJBQUEsR0FBbUIsU0FBQyxVQUFELEdBQUE7YUFDakIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsdUJBQWQsRUFBdUMsVUFBdkMsRUFEaUI7SUFBQSxDQS9PbkIsQ0FBQTs7Z0NBQUE7O0tBRGlDLE1BUm5DLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/decoration-management.coffee