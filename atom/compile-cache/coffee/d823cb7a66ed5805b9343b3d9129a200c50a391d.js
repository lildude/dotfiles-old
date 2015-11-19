(function() {
  var fs, path;

  fs = require('fs');

  path = require('path');

  describe("CoffeeScript grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-coffee-script");
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.coffee");
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe("source.coffee");
    });
    it("tokenizes classes", function() {
      var tokens;
      tokens = grammar.tokenizeLine("class Foo").tokens;
      expect(tokens[0]).toEqual({
        value: "class",
        scopes: ["source.coffee", "meta.class.coffee", "storage.type.class.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "Foo",
        scopes: ["source.coffee", "meta.class.coffee", "entity.name.type.class.coffee"]
      });
      tokens = grammar.tokenizeLine("subclass Foo").tokens;
      expect(tokens[0]).toEqual({
        value: "subclass Foo",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("[class Foo]").tokens;
      expect(tokens[0]).toEqual({
        value: "[",
        scopes: ["source.coffee", "meta.brace.square.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "class",
        scopes: ["source.coffee", "meta.class.coffee", "storage.type.class.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "Foo",
        scopes: ["source.coffee", "meta.class.coffee", "entity.name.type.class.coffee"]
      });
      expect(tokens[4]).toEqual({
        value: "]",
        scopes: ["source.coffee", "meta.brace.square.coffee"]
      });
      tokens = grammar.tokenizeLine("bar(class Foo)").tokens;
      expect(tokens[0]).toEqual({
        value: "bar",
        scopes: ["source.coffee", "entity.name.function.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "(",
        scopes: ["source.coffee", "meta.brace.round.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "class",
        scopes: ["source.coffee", "meta.class.coffee", "storage.type.class.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      expect(tokens[4]).toEqual({
        value: "Foo",
        scopes: ["source.coffee", "meta.class.coffee", "entity.name.type.class.coffee"]
      });
      return expect(tokens[5]).toEqual({
        value: ")",
        scopes: ["source.coffee", "meta.brace.round.coffee"]
      });
    });
    it("tokenizes named subclasses", function() {
      var tokens;
      tokens = grammar.tokenizeLine("class Foo extends Bar").tokens;
      expect(tokens[0]).toEqual({
        value: "class",
        scopes: ["source.coffee", "meta.class.coffee", "storage.type.class.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "Foo",
        scopes: ["source.coffee", "meta.class.coffee", "entity.name.type.class.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      expect(tokens[4]).toEqual({
        value: "extends",
        scopes: ["source.coffee", "meta.class.coffee", "keyword.control.inheritance.coffee"]
      });
      expect(tokens[5]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      return expect(tokens[6]).toEqual({
        value: "Bar",
        scopes: ["source.coffee", "meta.class.coffee", "entity.other.inherited-class.coffee"]
      });
    });
    it("tokenizes anonymous subclasses", function() {
      var tokens;
      tokens = grammar.tokenizeLine("class extends Foo").tokens;
      expect(tokens[0]).toEqual({
        value: "class",
        scopes: ["source.coffee", "meta.class.coffee", "storage.type.class.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "extends",
        scopes: ["source.coffee", "meta.class.coffee", "keyword.control.inheritance.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.coffee"]
      });
      return expect(tokens[4]).toEqual({
        value: "Foo",
        scopes: ["source.coffee", "meta.class.coffee", "entity.other.inherited-class.coffee"]
      });
    });
    it("tokenizes instantiated anonymous classes", function() {
      var tokens;
      tokens = grammar.tokenizeLine("new class").tokens;
      expect(tokens[0]).toEqual({
        value: "new",
        scopes: ["source.coffee", "meta.class.instance.constructor", "keyword.operator.new.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.instance.constructor"]
      });
      return expect(tokens[2]).toEqual({
        value: "class",
        scopes: ["source.coffee", "meta.class.instance.constructor", "storage.type.class.coffee"]
      });
    });
    it("tokenizes instantiated named classes", function() {
      var tokens;
      tokens = grammar.tokenizeLine("new class Foo").tokens;
      expect(tokens[0]).toEqual({
        value: "new",
        scopes: ["source.coffee", "meta.class.instance.constructor", "keyword.operator.new.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.instance.constructor"]
      });
      expect(tokens[2]).toEqual({
        value: "class",
        scopes: ["source.coffee", "meta.class.instance.constructor", "storage.type.class.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.instance.constructor"]
      });
      expect(tokens[4]).toEqual({
        value: "Foo",
        scopes: ["source.coffee", "meta.class.instance.constructor", "entity.name.type.instance.coffee"]
      });
      tokens = grammar.tokenizeLine("new Foo").tokens;
      expect(tokens[0]).toEqual({
        value: "new",
        scopes: ["source.coffee", "meta.class.instance.constructor", "keyword.operator.new.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee", "meta.class.instance.constructor"]
      });
      return expect(tokens[2]).toEqual({
        value: "Foo",
        scopes: ["source.coffee", "meta.class.instance.constructor", "entity.name.type.instance.coffee"]
      });
    });
    it("tokenizes annotations in block comments", function() {
      var lines;
      lines = grammar.tokenizeLines("###\n  @foo - food\n@bar - bart");
      expect(lines[1][0]).toEqual({
        value: '  ',
        scopes: ["source.coffee", "comment.block.coffee"]
      });
      expect(lines[1][1]).toEqual({
        value: '@foo',
        scopes: ["source.coffee", "comment.block.coffee", "storage.type.annotation.coffee"]
      });
      return expect(lines[2][0]).toEqual({
        value: '@bar',
        scopes: ["source.coffee", "comment.block.coffee", "storage.type.annotation.coffee"]
      });
    });
    it("tokenizes this as a special variable", function() {
      var tokens;
      tokens = grammar.tokenizeLine("this").tokens;
      return expect(tokens[0]).toEqual({
        value: "this",
        scopes: ["source.coffee", "variable.language.this.coffee"]
      });
    });
    it("tokenizes variable assignments", function() {
      var tokens;
      tokens = grammar.tokenizeLine("a = b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a and= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "and=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a or= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "or=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a -= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "-=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a += b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "+=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a /= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "/=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a &= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "&=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a %= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "%=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a *= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "*=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a ?= b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "?=",
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("a == b").tokens;
      expect(tokens[0]).toEqual({
        value: "a ",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "==",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("false == b").tokens;
      expect(tokens[0]).toEqual({
        value: "false",
        scopes: ["source.coffee", "constant.language.boolean.false.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "==",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("true == b").tokens;
      expect(tokens[0]).toEqual({
        value: "true",
        scopes: ["source.coffee", "constant.language.boolean.true.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "==",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("null == b").tokens;
      expect(tokens[0]).toEqual({
        value: "null",
        scopes: ["source.coffee", "constant.language.null.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "==",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("this == b").tokens;
      expect(tokens[0]).toEqual({
        value: "this",
        scopes: ["source.coffee", "variable.language.this.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: " ",
        scopes: ["source.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "==",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      return expect(tokens[3]).toEqual({
        value: " b",
        scopes: ["source.coffee"]
      });
    });
    it("does not confuse prototype properties with constants and keywords", function() {
      var tokens;
      tokens = grammar.tokenizeLine("Foo::true").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "true",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("Foo::on").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "on",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("Foo::yes").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "yes",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("Foo::false").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "false",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("Foo::off").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "off",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("Foo::no").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "no",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("Foo::null").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: "null",
        scopes: ["source.coffee"]
      });
      tokens = grammar.tokenizeLine("Foo::extends").tokens;
      expect(tokens[0]).toEqual({
        value: "Foo",
        scopes: ["source.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: ":",
        scopes: ["source.coffee", "keyword.operator.coffee"]
      });
      return expect(tokens[3]).toEqual({
        value: "extends",
        scopes: ["source.coffee"]
      });
    });
    it("verifies that regular expressions have explicit count modifiers", function() {
      var source;
      source = fs.readFileSync(path.resolve(__dirname, '..', 'grammars', 'coffeescript.cson'), 'utf8');
      expect(source.search(/{,/)).toEqual(-1);
      source = fs.readFileSync(path.resolve(__dirname, '..', 'grammars', 'coffeescript (literate).cson'), 'utf8');
      return expect(source.search(/{,/)).toEqual(-1);
    });
    it("tokenizes embedded JavaScript", function() {
      var lines, tokens;
      tokens = grammar.tokenizeLine("`;`").tokens;
      expect(tokens[0]).toEqual({
        value: "`",
        scopes: ["source.coffee", "string.quoted.script.coffee", "punctuation.definition.string.begin.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: ";",
        scopes: ["source.coffee", "string.quoted.script.coffee", "constant.character.escape.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "`",
        scopes: ["source.coffee", "string.quoted.script.coffee", "punctuation.definition.string.end.coffee"]
      });
      lines = grammar.tokenizeLines("`var a = 1;`\na = 2");
      expect(lines[0][0]).toEqual({
        value: '`',
        scopes: ["source.coffee", "string.quoted.script.coffee", "punctuation.definition.string.begin.coffee"]
      });
      expect(lines[0][1]).toEqual({
        value: 'v',
        scopes: ["source.coffee", "string.quoted.script.coffee", "constant.character.escape.coffee"]
      });
      return expect(lines[1][0]).toEqual({
        value: 'a ',
        scopes: ["source.coffee", "variable.assignment.coffee", "variable.assignment.coffee"]
      });
    });
    return it("tokenizes functions", function() {
      var tokens;
      tokens = grammar.tokenizeLine("foo = -> 1").tokens;
      expect(tokens[0]).toEqual({
        value: "foo ",
        scopes: ["source.coffee", "meta.function.coffee", "entity.name.function.coffee"]
      });
      tokens = grammar.tokenizeLine("foo bar").tokens;
      expect(tokens[0]).toEqual({
        value: "foo ",
        scopes: ["source.coffee", "entity.name.function.coffee"]
      });
      tokens = grammar.tokenizeLine("eat food for food in foods").tokens;
      expect(tokens[0]).toEqual({
        value: "eat ",
        scopes: ["source.coffee", "entity.name.function.coffee"]
      });
      expect(tokens[1]).toEqual({
        value: "food ",
        scopes: ["source.coffee"]
      });
      expect(tokens[2]).toEqual({
        value: "for",
        scopes: ["source.coffee", "keyword.control.coffee"]
      });
      expect(tokens[3]).toEqual({
        value: " food ",
        scopes: ["source.coffee"]
      });
      expect(tokens[4]).toEqual({
        value: "in",
        scopes: ["source.coffee", "keyword.control.coffee"]
      });
      return expect(tokens[5]).toEqual({
        value: " foods",
        scopes: ["source.coffee"]
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtY29mZmVlLXNjcmlwdC9zcGVjL2NvZmZlZS1zY3JpcHQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO2FBR0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUNILE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLGVBQWxDLEVBRFA7TUFBQSxDQUFMLEVBSlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBU0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxVQUFoQixDQUFBLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBZixDQUF5QixDQUFDLElBQTFCLENBQStCLGVBQS9CLEVBRnVCO0lBQUEsQ0FBekIsQ0FUQSxDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsTUFBQTtBQUFBLE1BQUMsU0FBVSxP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

//# sourceURL=/Users/lildude/.atom/packages/language-coffee-script/spec/coffee-script-spec.coffee
