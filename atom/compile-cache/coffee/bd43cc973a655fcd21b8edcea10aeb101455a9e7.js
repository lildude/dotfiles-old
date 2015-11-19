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
        scopes: ["source.coffee"]
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
    return it("tokenizes embedded JavaScript", function() {
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
  });

}).call(this);
