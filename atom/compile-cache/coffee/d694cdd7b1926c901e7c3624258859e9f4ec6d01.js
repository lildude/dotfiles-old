(function() {
  var OurSide, Side, TheirSide,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Side = (function() {
    function Side(originalText, ref, marker, refBannerMarker, position) {
      this.originalText = originalText;
      this.ref = ref;
      this.marker = marker;
      this.refBannerMarker = refBannerMarker;
      this.position = position;
      this.conflict = null;
      this.isDirty = false;
      this.followingMarker = null;
    }

    Side.prototype.resolve = function() {
      return this.conflict.resolveAs(this);
    };

    Side.prototype.wasChosen = function() {
      return this.conflict.resolution === this;
    };

    Side.prototype.lineClass = function() {
      if (this.wasChosen()) {
        return 'conflict-resolved';
      } else if (this.isDirty) {
        return 'conflict-dirty';
      } else {
        return "conflict-" + (this.klass());
      }
    };

    Side.prototype.markers = function() {
      return [this.marker, this.refBannerMarker];
    };

    Side.prototype.toString = function() {
      var chosenMark, dirtyMark, text;
      text = this.originalText.replace(/[\n\r]/, ' ');
      if (text.length > 20) {
        text = text.slice(0, 18) + "...";
      }
      dirtyMark = this.isDirty ? ' dirty' : '';
      chosenMark = this.wasChosen() ? ' chosen' : '';
      return "[" + (this.klass()) + ": " + text + " :" + dirtyMark + chosenMark + "]";
    };

    return Side;

  })();

  OurSide = (function(_super) {
    __extends(OurSide, _super);

    function OurSide() {
      return OurSide.__super__.constructor.apply(this, arguments);
    }

    OurSide.prototype.site = function() {
      return 1;
    };

    OurSide.prototype.klass = function() {
      return 'ours';
    };

    OurSide.prototype.description = function() {
      return 'our changes';
    };

    OurSide.prototype.eventName = function() {
      return 'merge-conflicts:accept-ours';
    };

    return OurSide;

  })(Side);

  TheirSide = (function(_super) {
    __extends(TheirSide, _super);

    function TheirSide() {
      return TheirSide.__super__.constructor.apply(this, arguments);
    }

    TheirSide.prototype.site = function() {
      return 2;
    };

    TheirSide.prototype.klass = function() {
      return 'theirs';
    };

    TheirSide.prototype.description = function() {
      return 'their changes';
    };

    TheirSide.prototype.eventName = function() {
      return 'merge-conflicts:accept-theirs';
    };

    return TheirSide;

  })(Side);

  module.exports = {
    Side: Side,
    OurSide: OurSide,
    TheirSide: TheirSide
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL2xpYi9zaWRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQU07QUFDUyxJQUFBLGNBQUUsWUFBRixFQUFpQixHQUFqQixFQUF1QixNQUF2QixFQUFnQyxlQUFoQyxFQUFrRCxRQUFsRCxHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsZUFBQSxZQUNiLENBQUE7QUFBQSxNQUQyQixJQUFDLENBQUEsTUFBQSxHQUM1QixDQUFBO0FBQUEsTUFEaUMsSUFBQyxDQUFBLFNBQUEsTUFDbEMsQ0FBQTtBQUFBLE1BRDBDLElBQUMsQ0FBQSxrQkFBQSxlQUMzQyxDQUFBO0FBQUEsTUFENEQsSUFBQyxDQUFBLFdBQUEsUUFDN0QsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUZuQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxtQkFLQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQW9CLElBQXBCLEVBQUg7SUFBQSxDQUxULENBQUE7O0FBQUEsbUJBT0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsVUFBVixLQUF3QixLQUEzQjtJQUFBLENBUFgsQ0FBQTs7QUFBQSxtQkFTQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBSDtlQUNFLG9CQURGO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxPQUFKO2VBQ0gsaUJBREc7T0FBQSxNQUFBO2VBR0YsV0FBQSxHQUFVLENBQUMsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFELEVBSFI7T0FISTtJQUFBLENBVFgsQ0FBQTs7QUFBQSxtQkFpQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUFHLENBQUMsSUFBQyxDQUFBLE1BQUYsRUFBVSxJQUFDLENBQUEsZUFBWCxFQUFIO0lBQUEsQ0FqQlQsQ0FBQTs7QUFBQSxtQkFtQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsMkJBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsUUFBdEIsRUFBZ0MsR0FBaEMsQ0FBUCxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsRUFBakI7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFLLGFBQUwsR0FBYyxLQUFyQixDQURGO09BREE7QUFBQSxNQUdBLFNBQUEsR0FBZSxJQUFDLENBQUEsT0FBSixHQUFpQixRQUFqQixHQUErQixFQUgzQyxDQUFBO0FBQUEsTUFJQSxVQUFBLEdBQWdCLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBSCxHQUFxQixTQUFyQixHQUFvQyxFQUpqRCxDQUFBO2FBS0MsR0FBQSxHQUFFLENBQUMsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFELENBQUYsR0FBWSxJQUFaLEdBQWdCLElBQWhCLEdBQXFCLElBQXJCLEdBQXlCLFNBQXpCLEdBQXFDLFVBQXJDLEdBQWdELElBTnpDO0lBQUEsQ0FuQlYsQ0FBQTs7Z0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQTZCTTtBQUVKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQUcsRUFBSDtJQUFBLENBQU4sQ0FBQTs7QUFBQSxzQkFFQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBRlAsQ0FBQTs7QUFBQSxzQkFJQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQUcsY0FBSDtJQUFBLENBSmIsQ0FBQTs7QUFBQSxzQkFNQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsOEJBQUg7SUFBQSxDQU5YLENBQUE7O21CQUFBOztLQUZvQixLQTdCdEIsQ0FBQTs7QUFBQSxFQXVDTTtBQUVKLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3QkFBQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQUcsRUFBSDtJQUFBLENBQU4sQ0FBQTs7QUFBQSx3QkFFQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQUcsU0FBSDtJQUFBLENBRlAsQ0FBQTs7QUFBQSx3QkFJQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQUcsZ0JBQUg7SUFBQSxDQUpiLENBQUE7O0FBQUEsd0JBTUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUFHLGdDQUFIO0lBQUEsQ0FOWCxDQUFBOztxQkFBQTs7S0FGc0IsS0F2Q3hCLENBQUE7O0FBQUEsRUFpREEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxJQUNBLE9BQUEsRUFBUyxPQURUO0FBQUEsSUFFQSxTQUFBLEVBQVcsU0FGWDtHQWxERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/lildude/.atom/packages/merge-conflicts/lib/side.coffee
