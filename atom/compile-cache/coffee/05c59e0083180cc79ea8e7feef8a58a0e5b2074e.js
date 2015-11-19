(function() {
  describe('validate', function() {
    var validate;
    validate = require('../lib/validate');
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          return validate.linter({
            lint: function() {}
          });
        }).toThrow('grammarScopes is not an Array. Got: undefined');
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: []
          });
        }).toThrow();
      });
      return it('throws if lint is not a function', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: [],
            lint: true
          });
        }).toThrow();
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow('Expected messages to be array, provided: undefined');
        return expect(function() {
          return validate.messages(true);
        }).toThrow('Expected messages to be array, provided: boolean');
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if type field is invalid', function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if html/text is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if trace is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 'a',
              trace: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            html: 'a',
            trace: false
          }
        ], {
          name: ''
        });
      });
      return it('throws if class is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error'
          }
        ], {
          name: ''
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdmFsaWRhdGUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsUUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQUFYLENBQUE7QUFBQSxJQUNBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7ZUFDbEQsTUFBQSxDQUFPLFNBQUEsR0FBQTtpQkFDTCxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUFBLFlBQUMsSUFBQSxFQUFNLFNBQUEsR0FBQSxDQUFQO1dBQWhCLEVBREs7UUFBQSxDQUFQLENBRUEsQ0FBQyxPQUZELENBRVMsK0NBRlQsRUFEa0Q7TUFBQSxDQUFwRCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7ZUFDOUIsTUFBQSxDQUFPLFNBQUEsR0FBQTtpQkFDTCxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUFBLFlBQUMsYUFBQSxFQUFlLEVBQWhCO1dBQWhCLEVBREs7UUFBQSxDQUFQLENBRUEsQ0FBQyxPQUZELENBQUEsRUFEOEI7TUFBQSxDQUFoQyxDQUpBLENBQUE7YUFRQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO2VBQ3JDLE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQ0wsUUFBUSxDQUFDLE1BQVQsQ0FBZ0I7QUFBQSxZQUFDLGFBQUEsRUFBZSxFQUFoQjtBQUFBLFlBQW9CLElBQUEsRUFBTSxJQUExQjtXQUFoQixFQURLO1FBQUEsQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFBLEVB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

//# sourceURL=/Users/lildude/.atom/packages/linter/spec/validate-spec.coffee
