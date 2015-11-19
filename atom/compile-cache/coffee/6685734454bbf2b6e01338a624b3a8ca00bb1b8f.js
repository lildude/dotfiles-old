(function() {
  module.exports = {
    config: {
      coloured: {
        type: 'boolean',
        "default": true,
        description: "Untick this for colourless icons"
      },
      forceShow: {
        type: 'boolean',
        "default": false,
        description: "Force show icons - for themes that hide icons"
      }
    },
    activate: function(state) {
      var self;
      self = this;
      atom.config.onDidChange('file-icons.coloured', function(_arg) {
        var newValue, oldValue;
        newValue = _arg.newValue, oldValue = _arg.oldValue;
        return self.colour(newValue);
      });
      this.colour(atom.config.get('file-icons.coloured'));
      atom.config.onDidChange('file-icons.forceShow', function(_arg) {
        var newValue, oldValue;
        newValue = _arg.newValue, oldValue = _arg.oldValue;
        return self.forceShow(newValue);
      });
      return this.forceShow(atom.config.get('file-icons.forceShow'));
    },
    deactivate: function() {},
    serialize: function() {},
    colour: function(enable) {
      var body;
      body = document.querySelector('body');
      if (enable) {
        return body.className = body.className.replace(/\sfile-icons-colourless/, '');
      } else {
        return body.className = body.className + " " + 'file-icons-colourless';
      }
    },
    forceShow: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = className + " " + 'file-icons-force-show-icons';
      } else {
        return body.className = className.replace(/\sfile-icons-force-show-icons/, '');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxrQ0FGYjtPQURGO0FBQUEsTUFJQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLCtDQUZiO09BTEY7S0FERjtBQUFBLElBU0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IscUJBQXhCLEVBQStDLFNBQUMsSUFBRCxHQUFBO0FBQzdDLFlBQUEsa0JBQUE7QUFBQSxRQUQrQyxnQkFBQSxVQUFVLGdCQUFBLFFBQ3pELENBQUE7ZUFBQSxJQUFJLENBQUMsTUFBTCxDQUFZLFFBQVosRUFENkM7TUFBQSxDQUEvQyxDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFSLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHNCQUF4QixFQUFnRCxTQUFDLElBQUQsR0FBQTtBQUM5QyxZQUFBLGtCQUFBO0FBQUEsUUFEZ0QsZ0JBQUEsVUFBVSxnQkFBQSxRQUMxRCxDQUFBO2VBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxRQUFmLEVBRDhDO01BQUEsQ0FBaEQsQ0FMQSxDQUFBO2FBT0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBQVgsRUFSUTtJQUFBLENBVFY7QUFBQSxJQW1CQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBbkJaO0FBQUEsSUFxQkEsU0FBQSxFQUFXLFNBQUEsR0FBQSxDQXJCWDtBQUFBLElBdUJBLE1BQUEsRUFBUSxTQUFDLE1BQUQsR0FBQTtBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBRyxNQUFIO2VBQ0UsSUFBSSxDQUFDLFNBQUwsR0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFmLENBQXVCLHlCQUF2QixFQUFrRCxFQUFsRCxFQURuQjtPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsU0FBTCxHQUFpQixJQUFJLENBQUMsU0FBTCxHQUFpQixHQUFqQixHQUF1Qix3QkFIMUM7T0FGTTtJQUFBLENBdkJSO0FBQUEsSUE2QkEsU0FBQSxFQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsVUFBQSxlQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBUCxDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBRGpCLENBQUE7QUFFQSxNQUFBLElBQUcsTUFBSDtlQUNFLElBQUksQ0FBQyxTQUFMLEdBQWlCLFNBQUEsR0FBWSxHQUFaLEdBQWtCLDhCQURyQztPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsU0FBTCxHQUFpQixTQUFTLENBQUMsT0FBVixDQUFrQiwrQkFBbEIsRUFBbUQsRUFBbkQsRUFIbkI7T0FIUztJQUFBLENBN0JYO0dBREYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lildude/.atom/packages/file-icons/index.coffee