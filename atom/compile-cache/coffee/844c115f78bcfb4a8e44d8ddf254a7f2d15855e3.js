
/*
  lib/sub-atom.coffee
 */

(function() {
  var $, CompositeDisposable, Disposable, SubAtom, _ref,
    __slice = [].slice;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  $ = require('jquery');

  module.exports = SubAtom = (function() {
    function SubAtom() {
      this.disposables = new CompositeDisposable;
    }

    SubAtom.prototype.addDisposable = function(disposable, disposeEventObj, disposeEventType) {
      var autoDisposables, e;
      if (disposeEventObj) {
        try {
          autoDisposables = new CompositeDisposable;
          autoDisposables.add(disposable);
          autoDisposables.add(disposeEventObj[disposeEventType]((function(_this) {
            return function() {
              autoDisposables.dispose();
              return _this.disposables.remove(autoDisposables);
            };
          })(this)));
          return this.disposables.add(autoDisposables);
        } catch (_error) {
          e = _error;
          return console.log('SubAtom::add, invalid dispose event', disposeEventObj, disposeEventType, e);
        }
      } else {
        return this.disposables.add(disposable);
      }
    };

    SubAtom.prototype.addElementListener = function(ele, events, selector, disposeEventObj, disposeEventType, handler) {
      var disposable, subscription;
      if (selector) {
        subscription = $(ele).on(events, selector, handler);
      } else {
        subscription = $(ele).on(events, handler);
      }
      disposable = new Disposable(function() {
        return subscription.off(events, handler);
      });
      return this.addDisposable(disposable, disposeEventObj, disposeEventType);
    };

    SubAtom.prototype.add = function() {
      var arg, args, disposeEventObj, disposeEventType, ele, events, handler, selector, signature, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      signature = '';
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        switch (typeof arg) {
          case 'string':
            signature += 's';
            break;
          case 'object':
            signature += 'o';
            break;
          case 'function':
            signature += 'f';
        }
      }
      switch (signature) {
        case 'o':
        case 'oos':
          return this.addDisposable.apply(this, args);
        case 'ssf':
        case 'osf':
          ele = args[0], events = args[1], handler = args[2];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossf':
        case 'sssf':
          ele = args[0], events = args[1], selector = args[2], handler = args[3];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ososf':
        case 'ssosf':
          ele = args[0], events = args[1], disposeEventObj = args[2], disposeEventType = args[3], handler = args[4];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossosf':
        case 'sssosf':
          ele = args[0], events = args[1], selector = args[2], disposeEventObj = args[3], disposeEventType = args[4], handler = args[5];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        default:
          console.log('SubAtom::add, invalid call signature', args);
      }
    };

    SubAtom.prototype.remove = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.disposables).remove.apply(_ref1, args);
    };

    SubAtom.prototype.clear = function() {
      return this.disposables.clear();
    };

    SubAtom.prototype.dispose = function() {
      return this.disposables.dispose();
    };

    return SubAtom;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFJQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBSnRCLENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FMSixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsaUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsbUJBQWYsQ0FEVztJQUFBLENBQWI7O0FBQUEsc0JBR0EsYUFBQSxHQUFlLFNBQUMsVUFBRCxFQUFhLGVBQWIsRUFBOEIsZ0JBQTlCLEdBQUE7QUFDYixVQUFBLGtCQUFBO0FBQUEsTUFBQSxJQUFHLGVBQUg7QUFDRTtBQUNFLFVBQUEsZUFBQSxHQUFrQixHQUFBLENBQUEsbUJBQWxCLENBQUE7QUFBQSxVQUNBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixVQUFwQixDQURBLENBQUE7QUFBQSxVQUVBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixlQUFnQixDQUFBLGdCQUFBLENBQWhCLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQSxHQUFBO0FBQ3BELGNBQUEsZUFBZSxDQUFDLE9BQWhCLENBQUEsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixlQUFwQixFQUZvRDtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQXBCLENBRkEsQ0FBQTtpQkFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsZUFBakIsRUFORjtTQUFBLGNBQUE7QUFRRSxVQURJLFVBQ0osQ0FBQTtpQkFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHFDQUFaLEVBQW1ELGVBQW5ELEVBQW9FLGdCQUFwRSxFQUFzRixDQUF0RixFQVJGO1NBREY7T0FBQSxNQUFBO2VBV0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLFVBQWpCLEVBWEY7T0FEYTtJQUFBLENBSGYsQ0FBQTs7QUFBQSxzQkFpQkEsa0JBQUEsR0FBb0IsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLFFBQWQsRUFBd0IsZUFBeEIsRUFBeUMsZ0JBQXpDLEVBQTJELE9BQTNELEdBQUE7QUFDbEIsVUFBQSx3QkFBQTtBQUFBLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxZQUFBLEdBQWUsQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLENBQWYsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLFlBQUEsR0FBZSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsT0FBbEIsQ0FBZixDQUhGO09BQUE7QUFBQSxNQUlBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQUcsWUFBWSxDQUFDLEdBQWIsQ0FBaUIsTUFBakIsRUFBeUIsT0FBekIsRUFBSDtNQUFBLENBQVgsQ0FKakIsQ0FBQTthQUtBLElBQUMsQ0FBQSxhQUFELENBQWUsVUFBZixFQUEyQixlQUEzQixFQUE0QyxnQkFBNUMsRUFOa0I7SUFBQSxDQWpCcEIsQ0FBQTs7QUFBQSxzQkF5QkEsR0FBQSxHQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsaUdBQUE7QUFBQSxNQURJLDhEQUNKLENBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxFQUFaLENBQUE7QUFDQSxXQUFBLDJDQUFBO3VCQUFBO0FBQ0UsZ0JBQU8sTUFBQSxDQUFBLEdBQVA7QUFBQSxlQUNPLFFBRFA7QUFDdUIsWUFBQSxTQUFBLElBQWEsR0FBYixDQUR2QjtBQUNPO0FBRFAsZUFFTyxRQUZQO0FBRXVCLFlBQUEsU0FBQSxJQUFhLEdBQWIsQ0FGdkI7QUFFTztBQUZQLGVBR08sVUFIUDtBQUd1QixZQUFBLFNBQUEsSUFBYSxHQUFiLENBSHZCO0FBQUEsU0FERjtBQUFBLE9BREE7QUFNQSxjQUFPLFNBQVA7QUFBQSxhQUNPLEdBRFA7QUFBQSxhQUNZLEtBRFo7aUJBQ3VCLElBQUMsQ0FBQSxhQUFELGFBQWUsSUFBZixFQUR2QjtBQUFBLGFBRU8sS0FGUDtBQUFBLGFBRWMsS0FGZDtBQUdJLFVBQUMsYUFBRCxFQUFNLGdCQUFOLEVBQWMsaUJBQWQsQ0FBQTtpQkFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsR0FBcEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkMsZUFBM0MsRUFBNEQsZ0JBQTVELEVBQThFLE9BQTlFLEVBSko7QUFBQSxhQUtPLE1BTFA7QUFBQSxhQUtlLE1BTGY7QUFNSSxVQUFDLGFBQUQsRUFBTSxnQkFBTixFQUFjLGtCQUFkLEVBQXdCLGlCQUF4QixDQUFBO2lCQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixHQUFwQixFQUF5QixNQUF6QixFQUFpQyxRQUFqQyxFQUEyQyxlQUEzQyxFQUE0RCxnQkFBNUQsRUFBOEUsT0FBOUUsRUFQSjtBQUFBLGFBUU8sT0FSUDtBQUFBLGFBUWdCLE9BUmhCO0FBU0ksVUFBQyxhQUFELEVBQU0sZ0JBQU4sRUFBYyx5QkFBZCxFQUErQiwwQkFBL0IsRUFBaUQsaUJBQWpELENBQUE7aUJBQ0EsSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDLGVBQTNDLEVBQTRELGdCQUE1RCxFQUE4RSxPQUE5RSxFQVZKO0FBQUEsYUFXTyxRQVhQO0FBQUEsYUFXaUIsUUFYakI7QUFZSSxVQUFDLGFBQUQsRUFBTSxnQkFBTixFQUFjLGtCQUFkLEVBQXdCLHlCQUF4QixFQUF5QywwQkFBekMsRUFBMkQsaUJBQTNELENBQUE7aUJBQ0EsSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDLGVBQTNDLEVBQTRELGdCQUE1RCxFQUE4RSxPQUE5RSxFQWJKO0FBQUE7QUFlSSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksc0NBQVosRUFBb0QsSUFBcEQsQ0FBQSxDQWZKO0FBQUEsT0FQRztJQUFBLENBekJMLENBQUE7O0FBQUEsc0JBa0RBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLFdBQUE7QUFBQSxNQURPLDhEQUNQLENBQUE7YUFBQSxTQUFBLElBQUMsQ0FBQSxXQUFELENBQVksQ0FBQyxNQUFiLGNBQW9CLElBQXBCLEVBRE07SUFBQSxDQWxEUixDQUFBOztBQUFBLHNCQXFEQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUEsRUFESztJQUFBLENBckRQLENBQUE7O0FBQUEsc0JBd0RBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQURPO0lBQUEsQ0F4RFQsQ0FBQTs7bUJBQUE7O01BVkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lildude/.atom/packages/markdown-scroll-sync/node_modules/sub-atom/lib/sub-atom.coffee