(function() {
  describe('legacy.coffee', function() {
    var legacyAdapter;
    legacyAdapter = require('../lib/legacy.coffee');
    it('Adapts plain string `syntax` property', function() {
      var adapted, clasicLinter;
      clasicLinter = {
        syntax: 'source.js'
      };
      adapted = legacyAdapter(clasicLinter);
      return expect(adapted.grammarScopes).toEqual(['source.js']);
    });
    return it('Adapts array `syntax` property', function() {
      var adapted, clasicLinter;
      clasicLinter = {
        syntax: ['source.js']
      };
      adapted = legacyAdapter(clasicLinter);
      return expect(adapted.grammarScopes).toEqual(['source.js']);
    });
  });

}).call(this);
