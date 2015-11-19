(function() {
  var $, InsertImageView, TextEditorView, View, config, dialog, fs, imageExtensions, lastInsertImageDir, path, remote, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  remote = require("remote");

  dialog = remote.require("dialog");

  config = require("../config");

  utils = require("../utils");

  imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".ico"];

  lastInsertImageDir = null;

  module.exports = InsertImageView = (function(_super) {
    __extends(InsertImageView, _super);

    function InsertImageView() {
      return InsertImageView.__super__.constructor.apply(this, arguments);
    }

    InsertImageView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Image", {
            "class": "icon icon-device-camera"
          });
          _this.div(function() {
            _this.label("Image Path (src)", {
              "class": "message"
            });
            _this.subview("imageEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "dialog-row"
            }, function() {
              _this.button("Choose Local Image", {
                outlet: "openImageButton",
                "class": "btn"
              });
              return _this.label({
                outlet: "message",
                "class": "side-label"
              });
            });
            _this.label("Title (alt)", {
              "class": "message"
            });
            _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Width (px)", {
                "class": "message"
              });
              return _this.subview("widthEditor", new TextEditorView({
                mini: true
              }));
            });
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Height (px)", {
                "class": "message"
              });
              return _this.subview("heightEditor", new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": "col-2"
            }, function() {
              _this.label("Alignment", {
                "class": "message"
              });
              return _this.subview("alignEditor", new TextEditorView({
                mini: true
              }));
            });
          });
          _this.div({
            outlet: "copyImagePanel",
            "class": "hidden dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-copy-image-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-copy-image-checkbox"
              }, {
                type: "checkbox",
                outlet: "copyImageCheckbox"
              });
              return _this.span("Copy Image to Site Image Directory", {
                "class": "side-label"
              });
            });
          });
          return _this.div({
            "class": "image-container"
          }, function() {
            return _this.img({
              outlet: 'imagePreview'
            });
          });
        };
      })(this));
    };

    InsertImageView.prototype.initialize = function() {
      utils.setTabIndex([this.imageEditor, this.openImageButton, this.titleEditor, this.widthEditor, this.heightEditor, this.alignEditor, this.copyImageCheckbox]);
      this.imageEditor.on("blur", (function(_this) {
        return function() {
          return _this.updateImageSource(_this.imageEditor.getText().trim());
        };
      })(this));
      this.openImageButton.on("click", (function(_this) {
        return function() {
          return _this.openImageDialog();
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

    InsertImageView.prototype.onConfirm = function() {
      var callback, imgUrl;
      imgUrl = this.imageEditor.getText().trim();
      if (!imgUrl) {
        return;
      }
      callback = (function(_this) {
        return function() {
          _this.insertImage();
          return _this.detach();
        };
      })(this);
      if (this.copyImageCheckbox.prop("checked")) {
        return this.copyImage(this.resolveImageUrl(imgUrl), callback);
      } else {
        return callback();
      }
    };

    InsertImageView.prototype.insertImage = function() {
      var img, text;
      img = {
        src: this.generateImageUrl(this.imageEditor.getText().trim()),
        alt: this.titleEditor.getText(),
        width: this.widthEditor.getText(),
        height: this.heightEditor.getText(),
        align: this.alignEditor.getText(),
        slug: utils.getTitleSlug(this.editor.getPath()),
        site: config.get("siteUrl")
      };
      text = img.src ? this.generateImageTag(img) : img.alt;
      return this.editor.setTextInBufferRange(this.range, text);
    };

    InsertImageView.prototype.copyImage = function(file, callback) {
      var destFile, error;
      if (utils.isUrl(file) || !fs.existsSync(file)) {
        return callback();
      }
      try {
        destFile = path.join(config.get("siteLocalDir"), this.imagesDir(), path.basename(file));
        if (fs.existsSync(destFile)) {
          return atom.confirm({
            message: "File already exists!",
            detailedMessage: "Another file already exists at:\n" + destPath,
            buttons: ['OK']
          });
        } else {
          return fs.copy(file, destFile, (function(_this) {
            return function() {
              _this.imageEditor.setText(destFile);
              return callback();
            };
          })(this));
        }
      } catch (_error) {
        error = _error;
        return atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Copy Image:\n" + error.message,
          buttons: ['OK']
        });
      }
    };

    InsertImageView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.setFieldsFromSelection();
      this.panel.show();
      return this.imageEditor.focus();
    };

    InsertImageView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return InsertImageView.__super__.detach.apply(this, arguments);
    };

    InsertImageView.prototype.setFieldsFromSelection = function() {
      var selection;
      this.range = utils.getTextBufferRange(this.editor, "link");
      selection = this.editor.getTextInRange(this.range);
      if (selection) {
        return this._setFieldsFromSelection(selection);
      }
    };

    InsertImageView.prototype._setFieldsFromSelection = function(selection) {
      var img;
      if (utils.isImage(selection)) {
        img = utils.parseImage(selection);
      } else if (utils.isImageTag(selection)) {
        img = utils.parseImageTag(selection);
      } else {
        img = {
          alt: selection
        };
      }
      this.titleEditor.setText(img.alt || "");
      this.widthEditor.setText(img.width || "");
      this.heightEditor.setText(img.height || "");
      this.imageEditor.setText(img.src || "");
      return this.updateImageSource(img.src);
    };

    InsertImageView.prototype.openImageDialog = function() {
      var files;
      files = dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: lastInsertImageDir || atom.project.getPaths()[0]
      });
      if (!files) {
        return;
      }
      lastInsertImageDir = path.dirname(files[0]);
      this.imageEditor.setText(files[0]);
      this.updateImageSource(files[0]);
      return this.titleEditor.focus();
    };

    InsertImageView.prototype.updateImageSource = function(file) {
      if (!file) {
        return;
      }
      this.displayImagePreview(file);
      if (utils.isUrl(file) || this.isInSiteDir(this.resolveImageUrl(file))) {
        return this.copyImagePanel.addClass("hidden");
      } else {
        return this.copyImagePanel.removeClass("hidden");
      }
    };

    InsertImageView.prototype.displayImagePreview = function(file) {
      if (this.imageOnPreview === file) {
        return;
      }
      if (this.isValidImageFile(file)) {
        this.message.text("Opening Image Preview ...");
        this.imagePreview.attr("src", this.resolveImageUrl(file));
        this.imagePreview.load((function(_this) {
          return function() {
            _this.setImageContext();
            return _this.message.text("");
          };
        })(this));
        this.imagePreview.error((function(_this) {
          return function() {
            _this.message.text("Error: Failed to Load Image.");
            return _this.imagePreview.attr("src", "");
          };
        })(this));
      } else {
        if (file) {
          this.message.text("Error: Invalid Image File.");
        }
        this.imagePreview.attr("src", "");
        this.widthEditor.setText("");
        this.heightEditor.setText("");
        this.alignEditor.setText("");
      }
      return this.imageOnPreview = file;
    };

    InsertImageView.prototype.isValidImageFile = function(file) {
      var _ref1;
      return file && (_ref1 = path.extname(file).toLowerCase(), __indexOf.call(imageExtensions, _ref1) >= 0);
    };

    InsertImageView.prototype.setImageContext = function() {
      var naturalHeight, naturalWidth, position, _ref1;
      _ref1 = this.imagePreview.context, naturalWidth = _ref1.naturalWidth, naturalHeight = _ref1.naturalHeight;
      this.widthEditor.setText("" + naturalWidth);
      this.heightEditor.setText("" + naturalHeight);
      position = naturalWidth > 300 ? "center" : "right";
      return this.alignEditor.setText(position);
    };

    InsertImageView.prototype.isInSiteDir = function(file) {
      return file && file.startsWith(config.get("siteLocalDir"));
    };

    InsertImageView.prototype.imagesDir = function() {
      return utils.dirTemplate(config.get("siteImagesDir"));
    };

    InsertImageView.prototype.resolveImageUrl = function(file) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file) || fs.existsSync(file)) {
        return file;
      }
      return path.join(config.get("siteLocalDir"), file);
    };

    InsertImageView.prototype.generateImageUrl = function(file) {
      var filePath;
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      if (this.isInSiteDir(file)) {
        filePath = path.relative(config.get("siteLocalDir"), file);
      } else {
        filePath = path.join(this.imagesDir(), path.basename(file));
      }
      return path.join("/", filePath);
    };

    InsertImageView.prototype.generateImageTag = function(data) {
      return utils.template(config.get("imageTag"), data);
    };

    return InsertImageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtaW1hZ2Utdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEhBQUE7SUFBQTs7eUpBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxzQkFBQSxjQUFWLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUhULENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFmLENBSlQsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQU5ULENBQUE7O0FBQUEsRUFPQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FQUixDQUFBOztBQUFBLEVBU0EsZUFBQSxHQUFrQixDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCLE1BQTFCLEVBQWtDLE1BQWxDLENBVGxCLENBQUE7O0FBQUEsRUFVQSxrQkFBQSxHQUFxQixJQVZyQixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHdDQUFQO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtl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

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/views/insert-image-view.coffee
