
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
          this.disposables.add(autoDisposables);
          return autoDisposables;
        } catch (_error) {
          e = _error;
          return console.log('SubAtom::add, invalid dispose event', disposeEventObj, disposeEventType, e);
        }
      } else {
        this.disposables.add(disposable);
        return disposable;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24tc2Nyb2xsLXN5bmMvbm9kZV9tb2R1bGVzL3N1Yi1hdG9tL2xpYi9zdWItYXRvbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsaURBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUlBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0Isa0JBQUEsVUFKdEIsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUxKLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRVMsSUFBQSxpQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQURXO0lBQUEsQ0FBYjs7QUFBQSxzQkFHQSxhQUFBLEdBQWUsU0FBQyxVQUFELEVBQWEsZUFBYixFQUE4QixnQkFBOUIsR0FBQTtBQUNiLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQUcsZUFBSDtBQUNFO0FBQ0UsVUFBQSxlQUFBLEdBQWtCLEdBQUEsQ0FBQSxtQkFBbEIsQ0FBQTtBQUFBLFVBQ0EsZUFBZSxDQUFDLEdBQWhCLENBQW9CLFVBQXBCLENBREEsQ0FBQTtBQUFBLFVBRUEsZUFBZSxDQUFDLEdBQWhCLENBQW9CLGVBQWdCLENBQUEsZ0JBQUEsQ0FBaEIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFBLEdBQUE7QUFDcEQsY0FBQSxlQUFlLENBQUMsT0FBaEIsQ0FBQSxDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLGVBQXBCLEVBRm9EO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFB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

//# sourceURL=/Users/lildude/.atom/packages/markdown-scroll-sync/node_modules/sub-atom/lib/sub-atom.coffee
