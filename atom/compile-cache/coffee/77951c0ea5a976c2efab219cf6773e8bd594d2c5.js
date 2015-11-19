(function() {
  var Decoration, DecorationManagement, Emitter, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  path = require('path');

  Emitter = require('event-kit').Emitter;

  Decoration = null;

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
      this.decorationDestroyedSubscriptions = {};
      return Decoration != null ? Decoration : Decoration = require('../decoration');
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

    DecorationManagement.prototype.decorationsByTypeThenRows = function(startScreenRow, endScreenRow) {
      var cache, decoration, id, range, row, rows, type, _base, _i, _j, _len, _ref, _ref1, _ref2, _results;
      if (this.decorationsByTypeThenRowsCache != null) {
        return this.decorationsByTypeThenRowsCache;
      }
      cache = {};
      _ref = this.decorationsById;
      for (id in _ref) {
        decoration = _ref[id];
        range = decoration.marker.getScreenRange();
        rows = (function() {
          _results = [];
          for (var _i = _ref1 = range.start.row, _ref2 = range.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
        type = decoration.getProperties().type;
        if (cache[type] == null) {
          cache[type] = {};
        }
        for (_j = 0, _len = rows.length; _j < _len; _j++) {
          row = rows[_j];
          if ((_base = cache[type])[row] == null) {
            _base[row] = [];
          }
          cache[type][row].push(decoration);
        }
      }
      return this.decorationsByTypeThenRowsCache = cache;
    };

    DecorationManagement.prototype.invalidateDecorationForScreenRowsCache = function() {
      return this.decorationsByTypeThenRowsCache = null;
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
      if (decorationParams.type === 'highlight') {
        decorationParams.type = 'highlight-over';
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
            var decoration, decorations, end, newEnd, newStart, oldEnd, oldStart, rangesDiffs, start, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
            decorations = _this.decorationsByMarkerId[marker.id];
            _this.invalidateDecorationForScreenRowsCache();
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
            oldStart = event.oldTailScreenPosition;
            oldEnd = event.oldHeadScreenPosition;
            newStart = event.newTailScreenPosition;
            newEnd = event.newHeadScreenPosition;
            if (oldStart.row > oldEnd.row) {
              _ref = [oldEnd, oldStart], oldStart = _ref[0], oldEnd = _ref[1];
            }
            if (newStart.row > newEnd.row) {
              _ref1 = [newEnd, newStart], newStart = _ref1[0], newEnd = _ref1[1];
            }
            rangesDiffs = _this.computeRangesDiffs(oldStart, oldEnd, newStart, newEnd);
            _results = [];
            for (_j = 0, _len1 = rangesDiffs.length; _j < _len1; _j++) {
              _ref2 = rangesDiffs[_j], start = _ref2[0], end = _ref2[1];
              _results.push(_this.emitRangeChanges({
                start: start,
                end: end
              }, 0));
            }
            return _results;
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

    DecorationManagement.prototype.computeRangesDiffs = function(oldStart, oldEnd, newStart, newEnd) {
      var diffs;
      diffs = [];
      if (oldStart.isLessThan(newStart)) {
        diffs.push([oldStart, newStart]);
      } else if (newStart.isLessThan(oldStart)) {
        diffs.push([newStart, oldStart]);
      }
      if (oldEnd.isLessThan(newEnd)) {
        diffs.push([oldEnd, newEnd]);
      } else if (newEnd.isLessThan(oldEnd)) {
        diffs.push([newEnd, oldEnd]);
      }
      return diffs;
    };

    DecorationManagement.prototype.emitDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      this.invalidateDecorationForScreenRowsCache();
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.emitRangeChanges(range, 0);
    };

    DecorationManagement.prototype.emitRangeChanges = function(range, screenDelta) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      if (screenDelta == null) {
        screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      }
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.emitChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker, _ref, _ref1;
      if (decoration == null) {
        return;
      }
      marker = decoration.marker;
      delete this.decorationsById[decoration.id];
      if ((_ref = this.decorationUpdatedSubscriptions[decoration.id]) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.decorationDestroyedSubscriptions[decoration.id]) != null) {
        _ref1.dispose();
      }
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.emitDecorationChanges(decoration);
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
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

    DecorationManagement.prototype.decorationDidChangeType = function(decoration) {};

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);
