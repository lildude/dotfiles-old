(function() {
  var $, InsertImageView, TextEditorView, View, config, dialog, fs, imageExtensions, lastInsertImageDir, path, remote, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("./config");

  utils = require("./utils");

  remote = require("remote");

  dialog = remote.require("dialog");

  path = require("path");

  fs = require("fs-plus");

  imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".ico"];

  lastInsertImageDir = null;

  module.exports = InsertImageView = (function(_super) {
    __extends(InsertImageView, _super);

    function InsertImageView() {
      return InsertImageView.__super__.constructor.apply(this, arguments);
    }

    InsertImageView.prototype.imageOnPreview = "";

    InsertImageView.prototype.editor = null;

    InsertImageView.prototype.range = null;

    InsertImageView.prototype.previouslyFocusedElement = null;

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
          return alert("Error:\nImage " + destPath + " already exists!");
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
        return alert("Error:\n" + error.message);
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
      this.range = utils.getSelectedTextBufferRange(this.editor, "link");
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
