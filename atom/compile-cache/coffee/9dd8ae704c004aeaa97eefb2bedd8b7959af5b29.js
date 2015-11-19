(function() {
  var Point, TagParser;

  Point = require('atom').Point;

  module.exports = TagParser = (function() {
    function TagParser(tags, grammar) {
      this.tags = tags;
      this.grammar = grammar;
      if (this.grammar === 'source.c++' || this.grammar === 'source.c' || this.grammar === 'source.cpp') {
        this.splitSymbol = '::';
      } else {
        this.splitSymbol = '.';
      }
    }

    TagParser.prototype.splitParentTag = function(parentTag) {
      var index;
      index = parentTag.indexOf(':');
      return {
        type: parentTag.substr(0, index),
        parent: parentTag.substr(index + 1)
      };
    };

    TagParser.prototype.splitNameTag = function(nameTag) {
      var index;
      index = nameTag.lastIndexOf(this.splitSymbol);
      if (index >= 0) {
        return nameTag.substr(index + this.splitSymbol.length);
      } else {
        return nameTag;
      }
    };

    TagParser.prototype.buildMissedParent = function(parents) {
      var i, name, now, parentTags, pre, type, _i, _len, _ref, _ref1, _results;
      parentTags = Object.keys(parents);
      parentTags.sort((function(_this) {
        return function(a, b) {
          var nameA, nameB, typeA, typeB, _ref, _ref1;
          _ref = _this.splitParentTag(a), typeA = _ref.typeA, nameA = _ref.parent;
          _ref1 = _this.splitParentTag(b), typeB = _ref1.typeB, nameB = _ref1.parent;
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        };
      })(this));
      _results = [];
      for (i = _i = 0, _len = parentTags.length; _i < _len; i = ++_i) {
        now = parentTags[i];
        _ref = this.splitParentTag(now), type = _ref.type, name = _ref.parent;
        if (parents[now] === null) {
          parents[now] = {
            name: name,
            type: type,
            position: null,
            parent: null
          };
          this.tags.push(parents[now]);
          if (i >= 1) {
            pre = parentTags[i - 1];
            _ref1 = this.splitParentTag(pre), type = _ref1.type, name = _ref1.parent;
            if (now.indexOf(name) >= 0) {
              parents[now].parent = pre;
              _results.push(parents[now].name = this.splitNameTag(parents[now].name));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    TagParser.prototype.parse = function() {
      var key, parent, parents, roots, tag, type, types, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
      roots = [];
      parents = {};
      types = {};
      this.tags.sort((function(_this) {
        return function(a, b) {
          return a.position.row - b.position.row;
        };
      })(this));
      _ref = this.tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        if (tag.parent) {
          parents[tag.parent] = null;
        }
      }
      _ref1 = this.tags;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tag = _ref1[_j];
        if (tag.parent) {
          _ref2 = this.splitParentTag(tag.parent), type = _ref2.type, parent = _ref2.parent;
          key = tag.type + ':' + parent + this.splitSymbol + tag.name;
        } else {
          key = tag.type + ':' + tag.name;
        }
        parents[key] = tag;
      }
      this.buildMissedParent(parents);
      _ref3 = this.tags;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        tag = _ref3[_k];
        if (tag.parent) {
          parent = parents[tag.parent];
          if (!parent.position) {
            parent.position = new Point(tag.position.row - 1);
          }
        }
      }
      this.tags.sort((function(_this) {
        return function(a, b) {
          return a.position.row - b.position.row;
        };
      })(this));
      _ref4 = this.tags;
      for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
        tag = _ref4[_l];
        tag.label = tag.name;
        tag.icon = "icon-" + tag.type;
        if (tag.parent) {
          parent = parents[tag.parent];
          if (parent.children == null) {
            parent.children = [];
          }
          parent.children.push(tag);
        } else {
          roots.push(tag);
        }
        types[tag.type] = null;
      }
      return {
        root: {
          label: 'root',
          icon: null,
          children: roots
        },
        types: Object.keys(types)
      };
    };

    TagParser.prototype.getNearestTag = function(row) {
      var left, mid, midRow, nearest, right;
      left = 0;
      right = this.tags.length - 1;
      while (left <= right) {
        mid = Math.floor((left + right) / 2);
        midRow = this.tags[mid].position.row;
        if (row < midRow) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      nearest = left - 1;
      return this.tags[nearest];
    };

    return TagParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvc3ltYm9scy10cmVlLXZpZXcvbGliL3RhZy1wYXJzZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDUyxJQUFBLG1CQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBUixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BRFgsQ0FBQTtBQUlBLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBRCxLQUFZLFlBQVosSUFBNEIsSUFBQyxDQUFBLE9BQUQsS0FBWSxVQUF4QyxJQUNBLElBQUMsQ0FBQSxPQUFELEtBQVksWUFEZjtBQUVFLFFBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFmLENBRkY7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQWYsQ0FKRjtPQUxXO0lBQUEsQ0FBYjs7QUFBQSx3QkFXQSxjQUFBLEdBQWdCLFNBQUMsU0FBRCxHQUFBO0FBQ2QsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsQ0FBUixDQUFBO2FBRUE7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFqQixFQUFvQixLQUFwQixDQUFOO0FBQUEsUUFDQSxNQUFBLEVBQVEsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsS0FBQSxHQUFNLENBQXZCLENBRFI7UUFIYztJQUFBLENBWGhCLENBQUE7O0FBQUEsd0JBaUJBLFlBQUEsR0FBYyxTQUFDLE9BQUQsR0FBQTtB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

//# sourceURL=/Users/lildude/.atom/packages/symbols-tree-view/lib/tag-parser.coffee
