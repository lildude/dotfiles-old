(function() {
  var $, CSON, InsertLinkView, TextEditorView, View, config, fs, posts, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

  CSON = require("season");

  fs = require("fs-plus");

  posts = null;

  module.exports = InsertLinkView = (function(_super) {
    __extends(InsertLinkView, _super);

    function InsertLinkView() {
      return InsertLinkView.__super__.constructor.apply(this, arguments);
    }

    InsertLinkView.prototype.editor = null;

    InsertLinkView.prototype.range = null;

    InsertLinkView.prototype.links = null;

    InsertLinkView.prototype.referenceId = false;

    InsertLinkView.prototype.previouslyFocusedElement = null;

    InsertLinkView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Link", {
            "class": "icon icon-globe"
          });
          _this.div(function() {
            _this.label("Text to be displayed", {
              "class": "message"
            });
            _this.subview("textEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Web Address", {
              "class": "message"
            });
            _this.subview("urlEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.div({
            "class": "dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-save-link-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-save-link-checkbox",
                type: "checkbox",
                outlet: "saveCheckbox"
              });
              return _this.span("Automatically link to this text next time", {
                "class": "side-label"
              });
            });
          });
          return _this.div({
            outlet: "searchBox"
          }, function() {
            _this.label("Search Posts", {
              "class": "icon icon-search"
            });
            _this.subview("searchEditor", new TextEditorView({
              mini: true
            }));
            return _this.ul({
              "class": "markdown-writer-list",
              outlet: "searchResult"
            });
          });
        };
      })(this));
    };

    InsertLinkView.prototype.initialize = function() {
      this.searchEditor.getModel().onDidChange((function(_this) {
        return function() {
          if (posts) {
            return _this.updateSearch(_this.searchEditor.getText());
          }
        };
      })(this));
      this.searchResult.on("click", "li", (function(_this) {
        return function(e) {
          return _this.useSearchResult(e);
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    InsertLinkView.prototype.onConfirm = function() {
      var text, title, url;
      text = this.textEditor.getText();
      url = this.urlEditor.getText().trim();
      title = this.titleEditor.getText().trim();
      this.editor.transact((function(_this) {
        return function() {
          if (url) {
            return _this.insertLink(text, title, url);
          } else {
            return _this.removeLink(text);
          }
        };
      })(this));
      this.updateSavedLink(text, title, url);
      return this.detach();
    };

    InsertLinkView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.panel.show();
      this.fetchPosts();
      return this.loadSavedLinks((function(_this) {
        return function() {
          _this.setFieldsFromSelection();
          if (_this.textEditor.getText()) {
            _this.urlEditor.getModel().selectAll();
            return _this.urlEditor.focus();
          } else {
            return _this.textEditor.focus();
          }
        };
      })(this));
    };

    InsertLinkView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return InsertLinkView.__super__.detach.apply(this, arguments);
    };

    InsertLinkView.prototype.setFieldsFromSelection = function() {
      var selection;
      this.range = utils.getSelectedTextBufferRange(this.editor, "link");
      selection = this.editor.getTextInRange(this.range);
      if (selection) {
        return this._setFieldsFromSelection(selection);
      }
    };

    InsertLinkView.prototype._setFieldsFromSelection = function(selection) {
      var link;
      if (utils.isInlineLink(selection)) {
        link = utils.parseInlineLink(selection);
        this.setLink(link.text, link.url, link.title);
        if (this.isInSavedLink(link)) {
          return this.saveCheckbox.prop("checked", true);
        }
      } else if (utils.isReferenceLink(selection)) {
        link = utils.parseReferenceLink(selection, this.editor.getText());
        this.referenceId = link.id;
        this.setLink(link.text, link.url, link.title);
        if (this.isInSavedLink(link)) {
          return this.saveCheckbox.prop("checked", true);
        }
      } else if (this.getSavedLink(selection)) {
        link = this.getSavedLink(selection);
        this.setLink(selection, link.url, link.title);
        return this.saveCheckbox.prop("checked", true);
      } else {
        return this.setLink(selection, "", "");
      }
    };

    InsertLinkView.prototype.updateSearch = function(query) {
      var results;
      query = query.trim().toLowerCase();
      results = posts.filter(function(post) {
        return query && post.title.toLowerCase().contains(query);
      });
      results = results.map(function(post) {
        return "<li data-url='" + post.url + "'>" + post.title + "</li>";
      });
      return this.searchResult.empty().append(results.join(""));
    };

    InsertLinkView.prototype.useSearchResult = function(e) {
      this.titleEditor.setText(e.target.textContent);
      this.urlEditor.setText(e.target.dataset.url);
      if (!this.textEditor.getText()) {
        this.textEditor.setText(e.target.textContent);
      }
      return this.titleEditor.focus();
    };

    InsertLinkView.prototype.insertLink = function(text, title, url) {
      if (this.referenceId) {
        return this.updateReferenceLink(text, title, url);
      } else if (title) {
        return this.insertReferenceLink(text, title, url);
      } else {
        return this.editor.setTextInBufferRange(this.range, "[" + text + "](" + url + ")");
      }
    };

    InsertLinkView.prototype.updateReferenceLink = function(text, title, url) {
      var position, referenceTagRegex;
      if (title) {
        position = this.editor.getCursorBufferPosition();
        referenceTagRegex = RegExp("^ *\\[" + (utils.regexpEscape(this.referenceId)) + "\\]: +([\\S ]+)$");
        this.editor.buffer.scan(referenceTagRegex, (function(_this) {
          return function(match) {
            var indent;
            indent = _this.getReferenceIndentLength();
            title = _this.getFormattedReferenceTitle(title);
            return _this.editor.setTextInBufferRange(match.range, "" + indent + "[" + _this.referenceId + "]: " + url + title);
          };
        })(this));
        return this.editor.setCursorBufferPosition(position);
      } else {
        return this.removeReferenceLink("[" + text + "](" + url + ")");
      }
    };

    InsertLinkView.prototype.insertReferenceLink = function(text, title, url) {
      var cursorRow, eol, id, indent, line, position;
      id = require("guid").raw().slice(0, 8);
      this.editor.setTextInBufferRange(this.range, "[" + text + "][" + id + "]");
      position = this.editor.getCursorBufferPosition();
      if (position.row === this.editor.getLastBufferRow()) {
        this.editor.insertNewline();
      } else {
        this.editor.moveToBeginningOfNextParagraph();
      }
      cursorRow = this.editor.getCursorBufferPosition().row;
      if (cursorRow === position.row + 1) {
        this.editor.insertNewline();
        cursorRow += 1;
      }
      indent = this.getReferenceIndentLength();
      title = this.getFormattedReferenceTitle(title);
      eol = this.editor.lineTextForBufferRow(cursorRow) ? "\n" : "";
      this.editor.setTextInBufferRange([[cursorRow, 0], [cursorRow, 0]], "" + indent + "[" + id + "]: " + url + title + eol);
      this.editor.setCursorBufferPosition([cursorRow + 1, 0]);
      line = this.editor.lineTextForBufferRow(cursorRow + 1);
      if (!utils.isReferenceDefinition(line)) {
        this.editor.insertNewline();
      }
      return this.editor.setCursorBufferPosition(position);
    };

    InsertLinkView.prototype.getReferenceIndentLength = function() {
      return " ".repeat(config.get("referenceIndentLength"));
    };

    InsertLinkView.prototype.getFormattedReferenceTitle = function(title) {
      if (/^[-\*\!]$/.test(title)) {
        return "";
      } else {
        return " \"" + title + "\"";
      }
    };

    InsertLinkView.prototype.removeLink = function(text) {
      if (this.referenceId) {
        return this.removeReferenceLink(text);
      } else {
        return this.editor.setTextInBufferRange(this.range, text);
      }
    };

    InsertLinkView.prototype.removeReferenceLink = function(text) {
      var position, referenceTagRegex;
      this.editor.setTextInBufferRange(this.range, text);
      position = this.editor.getCursorBufferPosition();
      referenceTagRegex = RegExp("^ *\\[" + (utils.regexpEscape(this.referenceId)) + "\\]: +");
      this.editor.buffer.scan(referenceTagRegex, (function(_this) {
        return function(match) {
          var emptyLineAbove, emptyLineBelow, lineNum;
          lineNum = match.range.getRows()[0];
          emptyLineAbove = _this.editor.lineTextForBufferRow(lineNum - 1).trim() === "";
          emptyLineBelow = _this.editor.lineTextForBufferRow(lineNum + 1).trim() === "";
          _this.editor.setSelectedBufferRange(match.range);
          _this.editor.deleteLine();
          if (emptyLineAbove && emptyLineBelow) {
            return _this.editor.deleteLine();
          }
        };
      })(this));
      return this.editor.setCursorBufferPosition(position);
    };

    InsertLinkView.prototype.setLink = function(text, url, title) {
      this.textEditor.setText(text);
      this.urlEditor.setText(url);
      return this.titleEditor.setText(title);
    };

    InsertLinkView.prototype.getSavedLink = function(text) {
      var _ref1;
      return (_ref1 = this.links) != null ? _ref1[text.toLowerCase()] : void 0;
    };

    InsertLinkView.prototype.isInSavedLink = function(link) {
      var savedLink;
      savedLink = this.getSavedLink(link.text);
      return savedLink && savedLink.title === link.title && savedLink.url === link.url;
    };

    InsertLinkView.prototype.updateSavedLink = function(text, title, url) {
      var file;
      if (this.saveCheckbox.prop("checked")) {
        if (url) {
          this.links[text.toLowerCase()] = {
            title: title,
            url: url
          };
        }
      } else if (this.isInSavedLink({
        text: text,
        title: title,
        url: url
      })) {
        delete this.links[text.toLowerCase()];
      }
      file = config.get("siteLinkPath");
      return fs.exists(file, (function(_this) {
        return function(exists) {
          if (exists) {
            return CSON.writeFile(file, _this.links);
          }
        };
      })(this));
    };

    InsertLinkView.prototype.loadSavedLinks = function(callback) {
      var file, readFile, setLinks;
      setLinks = (function(_this) {
        return function(data) {
          _this.links = data || {};
          return callback();
        };
      })(this);
      readFile = function(file) {
        return CSON.readFile(file, function(error, data) {
          return setLinks(data);
        });
      };
      file = config.get("siteLinkPath");
      return fs.exists(file, function(exists) {
        if (exists) {
          return readFile(file);
        } else {
          return setLinks();
        }
      });
    };

    InsertLinkView.prototype.fetchPosts = function() {
      var error, succeed, uri;
      if (posts) {
        if (!(posts.length > 0)) {
          return this.searchBox.hide();
        }
      } else {
        uri = config.get("urlForPosts");
        succeed = (function(_this) {
          return function(body) {
            posts = body.posts;
            if (posts.length > 0) {
              _this.searchBox.show();
              _this.searchEditor.setText(_this.textEditor.getText());
              return _this.updateSearch(_this.textEditor.getText());
            }
          };
        })(this);
        error = (function(_this) {
          return function(err) {
            return _this.searchBox.hide();
          };
        })(this);
        return utils.getJSON(uri, succeed, error);
      }
    };

    return InsertLinkView;

  })(View);

}).call(this);
