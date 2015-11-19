/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Generated by CoffeeScript 2.0.0-beta8
void function () {
  var CS, CSON, csr, find, isLiteral, LiteralTypes, nodeTransforms, nodeTypeString, parse, stringify, syntaxErrorMessage, transformKey, transformNode;
  csr = require('coffee-script-redux');
  CS = csr.Nodes;
  find = function (arr, testFn) {
    var element;
    for (var i$ = 0, length$ = arr.length; i$ < length$; ++i$) {
      element = arr[i$];
      if (testFn(element))
        return element;
    }
    return null;
  };
  nodeTypeString = function (csNode) {
    return csNode.toBasicObject().type;
  };
  syntaxErrorMessage = function (csNode, msg) {
    return 'Syntax error on line ' + csNode.line + ', column ' + csNode.column + ': ' + msg;
  };
  nodeTransforms = [
    [
      CS.Program,
      function (node) {
        var body;
        body = node.body;
        if (!body || !body.statements || body.statements.length !== 1)
          throw new SyntaxError(syntaxErrorMessage(node, 'One top level value expected'));
        return transformNode(body.statements[0]);
      }
    ],
    [
      CS.ObjectInitialiser,
      function (node) {
        return node.members.reduce(function (outObject, param$) {
          var cache$, expression, key, keyName, value;
          {
            cache$ = param$;
            key = cache$.key;
            expression = cache$.expression;
          }
          keyName = transformKey(key);
          value = transformNode(expression);
          outObject[keyName] = value;
          return outObject;
        }, {});
      }
    ],
    [
      CS.ArrayInitialiser,
      function (node) {
        return node.members.map(transformNode);
      }
    ],
    [
      CS.Null,
      function () {
        return null;
      }
    ],
    [
      CS.UnaryNegateOp,
      function (node) {
        return -transformNode(node.expression);
      }
    ],
    [
      CS.MultiplyOp,
      function (node) {
        return transformNode(node.left) * transformNode(node.right);
      }
    ],
    [
      CS.PlusOp,
      function (node) {
        return transformNode(node.left) + transformNode(node.right);
      }
    ],
    [
      CS.DivideOp,
      function (node) {
        return transformNode(node.left) / transformNode(node.right);
      }
    ],
    [
      CS.SubtractOp,
      function (node) {
        return transformNode(node.left) - transformNode(node.right);
      }
    ],
    [
      CS.RemOp,
      function (node) {
        return transformNode(node.left) % transformNode(node.right);
      }
    ],
    [
      CS.BitAndOp,
      function (node) {
        return transformNode(node.left) & transformNode(node.right);
      }
    ],
    [
      CS.BitOrOp,
      function (node) {
        return transformNode(node.left) | transformNode(node.right);
      }
    ],
    [
      CS.BitXorOp,
      function (node) {
        return transformNode(node.left) ^ transformNode(node.right);
      }
    ],
    [
      CS.BitNotOp,
      function (node) {
        return ~transformNode(node.expression);
      }
    ],
    [
      CS.LeftShiftOp,
      function (node) {
        return transformNode(node.left) << transformNode(node.right);
      }
    ],
    [
      CS.SignedRightShiftOp,
      function (node) {
        return transformNode(node.left) >> transformNode(node.right);
      }
    ],
    [
      CS.UnsignedRightShiftOp,
      function (node) {
        return transformNode(node.left) >>> transformNode(node.right);
      }
    ]
  ];
  LiteralTypes = [
    CS.Bool,
    CS.Float,
    CS.Int,
    CS.String
  ];
  LiteralTypes.forEach(function (LiteralType) {
    return nodeTransforms.unshift([
      LiteralType,
      function (param$) {
        var data;
        data = param$.data;
        return data;
      }
    ]);
  });
  isLiteral = function (csNode) {
    return LiteralTypes.some(function (LiteralType) {
      return csNode instanceof LiteralType;
    });
  };
  transformKey = function (csNode) {
    if (!(csNode instanceof CS.Identifier || isLiteral(csNode)))
      throw new SyntaxError(syntaxErrorMessage(csNode, '' + nodeTypeString(csNode) + ' used as key'));
    return csNode.data;
  };
  transformNode = function (csNode) {
    var transform;
    transform = find(nodeTransforms, function (param$) {
      var NodeType;
      NodeType = param$[0];
      return csNode instanceof NodeType;
    });
    if (!transform)
      throw new SyntaxError(syntaxErrorMessage(csNode, 'Unexpected ' + nodeTypeString(csNode)));
    return transform[1](csNode);
  };
  stringify = function (obj, visitor, indent) {
    return JSON.stringify(obj, visitor, indent);
  };
  parse = function (source, reviver) {
    var coffeeAst;
    if (reviver)
      throw new Error('The reviver parameter is not implemented yet');
    coffeeAst = csr.parse(source.toString(), {
      bare: true,
      raw: true
    });
    return transformNode(coffeeAst);
  };
  module.exports = CSON = {
    stringify: stringify,
    parse: parse
  };
}.call(this);
