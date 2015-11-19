(function() {
  var Decoration, DecorationManagement, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Mixin = require('mixto');

  path = require('path');

  Decoration = require(path.join(atom.config.resourcePath, 'src', 'decoration'));

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
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
            return _this.stackRangeChanges({
              start: start,
              end: end
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
            return _this.stackDecorationChanges(decoration);
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
      this.stackDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });
      return decoration;
    };

    DecorationManagement.prototype.stackDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.stackRangeChanges(range);
    };

    DecorationManagement.prototype.stackRangeChanges = function(range) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, screenDelta, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.stackChanges(changeEvent);
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
      this.stackDecorationChanges(decoration);
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
        this.stackDecorationChanges(decoration);
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

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBdEIsRUFBb0MsS0FBcEMsRUFBMkMsWUFBM0MsQ0FBUixDQUZiLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBO0FBQUEsZ0JBQUE7O0FBQUEsbUNBR0EscUJBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsRUFBbkIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHFCQUFELEdBQXlCLEVBRHpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxvQ0FBRCxHQUF3QyxFQUZ4QyxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsc0NBQUQsR0FBMEMsRUFIMUMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLDhCQUFELEdBQWtDLEVBSmxDLENBQUE7YUFLQSxJQUFDLENBQUEsZ0NBQUQsR0FBb0MsR0FOZjtJQUFBLENBSHZCLENBQUE7O0FBQUEsbUNBZ0JBLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFDZixJQUFDLENBQUEsZUFBZ0IsQ0FBQSxFQUFBLEVBREY7SUFBQSxDQWhCakIsQ0FBQTs7QUFBQSxtQ0EyQkEsd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsdUVBQUE7QUFBQSxNQUR5QixvQkFBSyxzR0FBVSw2QkFDeEMsQ0FBQTtB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
//# sourceURL=/Users/lildude/.atom/packages/minimap/lib/mixins/decoration-management.coffee