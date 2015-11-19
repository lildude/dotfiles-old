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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2xpbGR1ZGUvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi9pbnNlcnQtaW1hZ2Utdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEhBQUE7SUFBQTs7eUpBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxzQkFBQSxjQUFWLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FEVCxDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRlIsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUhULENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFmLENBSlQsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUxQLENBQUE7O0FBQUEsRUFNQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FOTCxDQUFBOztBQUFBLEVBUUEsZUFBQSxHQUFrQixDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCLE1BQTFCLEVBQWtDLE1BQWxDLENBUmxCLENBQUE7O0FBQUEsRUFTQSxrQkFBQSxHQUFxQixJQVRyQixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHdDQUFQO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwRCxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sY0FBUCxFQUF1QjtBQUFBLFlBQUEsT0FBQSxFQUFPLHlCQUFQO1dBQXZCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sa0JBQVAsRUFBMkI7QUFBQSxjQUFBLE9BQUEsRUFBTyxTQUFQO2FBQTNCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQTRCLElBQUEsY0FBQSxDQUFlO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjthQUFmLENBQTVCLENBREEsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLFlBQVA7YUFBTCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsY0FBQSxLQUFDLENBQUEsTUFBRCxDQUFRLG9CQUFSLEVBQThCO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLGlCQUFSO0FBQUEsZ0JBQTJCLE9BQUEsRUFBTyxLQUFsQztlQUE5QixDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGdCQUFBLE1BQUEsRUFBUSxTQUFSO0FBQUEsZ0JBQW1CLE9BQUEsRUFBTyxZQUExQjtlQUFQLEVBRndCO1lBQUEsQ0FBMUIsQ0FGQSxDQUFBO0FBQUEsWUFLQSxLQUFDLENBQUEsS0FBRCxDQUFPLGFBQVAsRUFBc0I7QUFBQSxjQUFBLE9BQUEsRUFBTyxTQUFQO2FBQXRCLENBTEEsQ0FBQTtBQUFBLFlBTUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQTRCLElBQUEsY0FBQSxDQUFlO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjthQUFmLENBQTVCLENBTkEsQ0FBQTtBQUFBLFlBT0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLE9BQVA7YUFBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPLFlBQVAsRUFBcUI7QUFBQSxnQkFBQSxPQUFBLEVBQU8sU0FBUDtlQUFyQixDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQTRCLElBQUEsY0FBQSxDQUFlO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLElBQU47ZUFBZixDQUE1QixFQUZtQjtZQUFBLENBQXJCLENBUEEsQ0FBQTtBQUFBLFlBVUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLE9BQVA7YUFBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPLGFBQVAsRUFBc0I7QUFBQSxnQkFBQSxPQUFBLEVBQU8sU0FBUDtlQUF0QixDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxjQUFULEVBQTZCLElBQUEsY0FBQSxDQUFlO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLElBQU47ZUFBZixDQUE3QixFQUZtQjtZQUFBLENBQXJCLENBVkEsQ0FBQTttQkFhQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sT0FBUDthQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sV0FBUCxFQUFvQjtBQUFBLGdCQUFBLE9BQUEsRUFBTyxTQUFQO2VBQXBCLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLGFBQVQsRUFBNEIsSUFBQSxjQUFBLENBQWU7QUFBQSxnQkFBQSxJQUFBLEVBQU0sSUFBTjtlQUFmLENBQTVCLEVBRm1CO1lBQUEsQ0FBckIsRUFkRztVQUFBLENBQUwsQ0FEQSxDQUFBO0FBQUEsVUFrQkEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLGdCQUFSO0FBQUEsWUFBMEIsT0FBQSxFQUFPLG1CQUFqQztXQUFMLEVBQTJELFNBQUEsR0FBQTttQkFDekQsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGNBQUEsS0FBQSxFQUFLLHFDQUFMO2FBQVAsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELGNBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGdCQUFBLEVBQUEsRUFBSSxxQ0FBSjtlQUFQLEVBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQUssVUFBTDtBQUFBLGdCQUFpQixNQUFBLEVBQVEsbUJBQXpCO2VBREYsQ0FBQSxDQUFBO3FCQUVBLEtBQUMsQ0FBQSxJQUFELENBQU0sb0NBQU4sRUFBNEM7QUFBQSxnQkFBQSxPQUFBLEVBQU8sWUFBUDtlQUE1QyxFQUhpRDtZQUFBLENBQW5ELEVBRHlEO1VBQUEsQ0FBM0QsQ0FsQkEsQ0FBQTtpQkF1QkEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGlCQUFQO1dBQUwsRUFBK0IsU0FBQSxHQUFBO21CQUM3QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxNQUFBLEVBQVEsY0FBUjthQUFMLEVBRDZCO1VBQUEsQ0FBL0IsRUF4Qm9EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw4QkE0QkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGlCQUFELENBQW1CLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQXNCLENBQUMsSUFBdkIsQ0FBQSxDQUFuQixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBZSxDQUFDLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0IsQ0FEQSxDQUFBO2FBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNFO0FBQUEsUUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO0FBQUEsUUFDQSxhQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGhCO09BREYsRUFKVTtJQUFBLENBNUJaLENBQUE7O0FBQUEsOEJBb0NBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBc0IsQ0FBQyxJQUF2QixDQUFBLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLE1BQUE7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BR0EsUUFBQSxHQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFBRyxVQUFBLEtBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFBO2lCQUFnQixLQUFDLENBQUEsTUFBRCxDQUFBLEVBQW5CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIWCxDQUFBO0FBSUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxJQUFuQixDQUF3QixTQUF4QixDQUFIO2VBQ0UsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFqQixDQUFYLEVBQXFDLFFBQXJDLEVBREY7T0FBQSxNQUFBO2VBR0UsUUFBQSxDQUFBLEVBSEY7T0FMUztJQUFBLENBcENYLENBQUE7O0FBQUEsOEJBOENBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLFNBQUE7QUFBQSxNQUFBLEdBQUEsR0FDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFzQixDQUFDLElBQXZCLENBQUEsQ0FBbEIsQ0FBTDtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBREw7QUFBQSxRQUVBLEtBQUEsRUFBTyxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUZQO0FBQUEsUUFHQSxNQUFBLEVBQVEsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FIUjtBQUFBLFFBSUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBSlA7QUFBQSxRQUtBLElBQUEsRUFBTSxLQUFLLENBQUMsWUFBTixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFuQixDQUxOO0FBQUEsUUFNQSxJQUFBLEVBQU0sTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFYLENBTk47T0FERixDQUFBO0FBQUEsTUFRQSxJQUFBLEdBQVUsR0FBRyxDQUFDLEdBQVAsR0FBZ0IsSUFBQyxDQUFBLGdCQUFELENBQWtCLEdBQWxCLENBQWhCLEdBQTRDLEdBQUcsQ0FBQyxHQVJ2RCxDQUFBO2FBU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixJQUFDLENBQUEsS0FBOUIsRUFBcUMsSUFBckMsRUFWVztJQUFBLENBOUNiLENBQUE7O0FBQUEsOEJBMERBLFNBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDVCxVQUFBLGVBQUE7QUFBQSxNQUFBLElBQXFCLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixDQUFBLElBQXFCLENBQUEsRUFBRyxDQUFDLFVBQUgsQ0FBYyxJQUFkLENBQTNDO0FBQUEsZUFBTyxRQUFBLENBQUEsQ0FBUCxDQUFBO09BQUE7QUFFQTtBQUNFLFFBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBTSxDQUFDLEdBQVAsQ0FBVyxjQUFYLENBQVYsRUFDVCxJQUFDLENBQUEsU0FBRCxDQUFBLENBRFMsRUFDSyxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsQ0FETCxDQUFYLENBQUE7QUFHQSxRQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQUg7aUJBQ0UsS0FBQSxDQUFPLGdCQUFBLEdBQWdCLFFBQWhCLEdBQXlCLGtCQUFoQyxFQURGO1NBQUEsTUFBQTtpQkFHRSxFQUFFLENBQUMsSUFBSCxDQUFRLElBQVIsRUFBYyxRQUFkLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQSxHQUFBO0FBQ3RCLGNBQUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLFFBQXJCLENBQUEsQ0FBQTtxQkFDQSxRQUFBLENBQUEsRUFGc0I7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQUhGO1NBSkY7T0FBQSxjQUFBO0FBV0UsUUFESSxjQUNKLENBQUE7ZUFBQSxLQUFBLENBQU8sVUFBQSxHQUFVLEtBQUssQ0FBQyxPQUF2QixFQVhGO09BSFM7SUFBQSxDQTFEWCxDQUFBOztBQUFBLDhCQTBFQSxPQUFBLEdBQVMsU0FBQSxHQUFBOztRQUNQLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxVQUFZLE9BQUEsRUFBUyxLQUFyQjtTQUE3QjtPQUFWO0FBQUEsTUFDQSxJQUFDLENBQUEsd0JBQUQsR0FBNEIsQ0FBQSxDQUFFLFFBQVEsQ0FBQyxhQUFYLENBRDVCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRlYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUpBLENBQUE7YUFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQSxFQU5PO0lBQUEsQ0ExRVQsQ0FBQTs7QUFBQSw4QkFrRkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFBLENBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FEQSxDQUFBOzthQUV5QixDQUFFLEtBQTNCLENBQUE7T0FGQTthQUdBLDZDQUFBLFNBQUEsRUFKTTtJQUFBLENBbEZSLENBQUE7O0FBQUEsOEJBd0ZBLHNCQUFBLEdBQXdCLFNBQUEsR0FBQTtBQUN0QixVQUFBLFNBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBSyxDQUFDLGtCQUFOLENBQXlCLElBQUMsQ0FBQSxNQUExQixFQUFrQyxNQUFsQyxDQUFULENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLEtBQXhCLENBRFosQ0FBQTtBQUVBLE1BQUEsSUFBdUMsU0FBdkM7ZUFBQSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsU0FBekIsRUFBQTtPQUhzQjtJQUFBLENBeEZ4QixDQUFBOztBQUFBLDhCQTZGQSx1QkFBQSxHQUF5QixTQUFDLFNBQUQsR0FBQTtBQUN2QixVQUFBLEdBQUE7QUFBQSxNQUFBLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxTQUFkLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxLQUFLLENBQUMsVUFBTixDQUFpQixTQUFqQixDQUFOLENBREY7T0FBQSxNQUVLLElBQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsU0FBakIsQ0FBSDtBQUNILFFBQUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxhQUFOLENBQW9CLFNBQXBCLENBQU4sQ0FERztPQUFBLE1BQUE7QUFHSCxRQUFBLEdBQUEsR0FBTTtBQUFBLFVBQUUsR0FBQSxFQUFLLFNBQVA7U0FBTixDQUhHO09BRkw7QUFBQSxNQU9BLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixHQUFHLENBQUMsR0FBSixJQUFXLEVBQWhDLENBUEEsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLEdBQUcsQ0FBQyxLQUFKLElBQWEsRUFBbEMsQ0FSQSxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsR0FBRyxDQUFDLE1BQUosSUFBYyxFQUFwQyxDQVRBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixHQUFHLENBQUMsR0FBSixJQUFXLEVBQWhDLENBVkEsQ0FBQTthQVdBLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixHQUFHLENBQUMsR0FBdkIsRUFadUI7SUFBQSxDQTdGekIsQ0FBQTs7QUFBQSw4QkEyR0EsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxNQUFNLENBQUMsY0FBUCxDQUNOO0FBQUEsUUFBQSxVQUFBLEVBQVksQ0FBQyxVQUFELENBQVo7QUFBQSxRQUNBLFdBQUEsRUFBYSxrQkFBQSxJQUFzQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FEM0Q7T0FETSxDQUFSLENBQUE7QUFHQSxNQUFBLElBQUEsQ0FBQSxLQUFBO0FBQUEsY0FBQSxDQUFBO09BSEE7QUFBQSxNQUlBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBTSxDQUFBLENBQUEsQ0FBbkIsQ0FKckIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLEtBQU0sQ0FBQSxDQUFBLENBQTNCLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGlCQUFELENBQW1CLEtBQU0sQ0FBQSxDQUFBLENBQXpCLENBTkEsQ0FBQTthQU9BLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixDQUFBLEVBUmU7SUFBQSxDQTNHakIsQ0FBQTs7QUFBQSw4QkFxSEEsaUJBQUEsR0FBbUIsU0FBQyxJQUFELEdBQUE7QUFDakIsTUFBQSxJQUFBLENBQUEsSUFBQTtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBckIsQ0FGQSxDQUFBO0FBR0EsTUFBQSxJQUFHLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixDQUFBLElBQXFCLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBakIsQ0FBYixDQUF4QjtlQUNFLElBQUMsQ0FBQSxjQUFjLENBQUMsUUFBaEIsQ0FBeUIsUUFBekIsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsY0FBYyxDQUFDLFdBQWhCLENBQTRCLFFBQTVCLEVBSEY7T0FKaUI7SUFBQSxDQXJIbkIsQ0FBQTs7QUFBQSw4QkE4SEEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEdBQUE7QUFDbkIsTUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFELEtBQW1CLElBQTdCO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFFQSxNQUFBLElBQUcsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQWxCLENBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLDJCQUFkLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLEtBQW5CLEVBQTBCLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLENBQTFCLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQUcsWUFBQSxLQUFDLENBQUEsZUFBRCxDQUFBLENBQUEsQ0FBQTttQkFBb0IsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsRUFBZCxFQUF2QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CLENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ2xCLFlBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsOEJBQWQsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixLQUFuQixFQUEwQixFQUExQixFQUZrQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLENBSEEsQ0FERjtPQUFBLE1BQUE7QUFRRSxRQUFBLElBQStDLElBQS9DO0FBQUEsVUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyw0QkFBZCxDQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLEtBQW5CLEVBQTBCLEVBQTFCLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLEVBQXJCLENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQXNCLEVBQXRCLENBSEEsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLEVBQXJCLENBSkEsQ0FSRjtPQUZBO2FBZ0JBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEtBakJDO0lBQUEsQ0E5SHJCLENBQUE7O0FBQUEsOEJBaUpBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO0FBQ2hCLFVBQUEsS0FBQTthQUFBLElBQUEsSUFBUSxTQUFDLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixDQUFrQixDQUFDLFdBQW5CLENBQUEsQ0FBQSxFQUFBLGVBQW9DLGVBQXBDLEVBQUEsS0FBQSxNQUFELEVBRFE7SUFBQSxDQWpKbEIsQ0FBQTs7QUFBQSw4QkFvSkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLDRDQUFBO0FBQUEsTUFBQSxRQUFrQyxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWhELEVBQUUscUJBQUEsWUFBRixFQUFnQixzQkFBQSxhQUFoQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsRUFBQSxHQUFLLFlBQTFCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQXNCLEVBQUEsR0FBSyxhQUEzQixDQUZBLENBQUE7QUFBQSxNQUlBLFFBQUEsR0FBYyxZQUFBLEdBQWUsR0FBbEIsR0FBMkIsUUFBM0IsR0FBeUMsT0FKcEQsQ0FBQTthQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixRQUFyQixFQU5lO0lBQUEsQ0FwSmpCLENBQUE7O0FBQUEsOEJBNEpBLFdBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTthQUFVLElBQUEsSUFBUSxJQUFJLENBQUMsVUFBTCxDQUFnQixNQUFNLENBQUMsR0FBUCxDQUFXLGNBQVgsQ0FBaEIsRUFBbEI7SUFBQSxDQTVKYixDQUFBOztBQUFBLDhCQThKQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsTUFBTSxDQUFDLEdBQVAsQ0FBVyxlQUFYLENBQWxCLEVBQUg7SUFBQSxDQTlKWCxDQUFBOztBQUFBLDhCQWdLQSxlQUFBLEdBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQ2YsTUFBQSxJQUFhLENBQUEsSUFBYjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWUsS0FBSyxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQUEsSUFBcUIsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFkLENBQXBDO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FEQTtBQUVBLGFBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFNLENBQUMsR0FBUCxDQUFXLGNBQVgsQ0FBVixFQUFzQyxJQUF0QyxDQUFQLENBSGU7SUFBQSxDQWhLakIsQ0FBQTs7QUFBQSw4QkFxS0EsZ0JBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7QUFDaEIsVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFhLENBQUEsSUFBYjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWUsS0FBSyxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQWY7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBR0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBYixDQUFIO0FBQ0UsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFNLENBQUMsR0FBUCxDQUFXLGNBQVgsQ0FBZCxFQUEwQyxJQUExQyxDQUFYLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQVYsRUFBd0IsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkLENBQXhCLENBQVgsQ0FIRjtPQUhBO0FBT0EsYUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxRQUFmLENBQVAsQ0FSZ0I7SUFBQSxDQXJLbEIsQ0FBQTs7QUFBQSw4QkErS0EsZ0JBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7YUFBVSxLQUFLLENBQUMsUUFBTixDQUFlLE1BQU0sQ0FBQyxHQUFQLENBQVcsVUFBWCxDQUFmLEVBQXVDLElBQXZDLEVBQVY7SUFBQSxDQS9LbEIsQ0FBQTs7MkJBQUE7O0tBRDRCLEtBWjlCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/lildude/.atom/packages/markdown-writer/lib/insert-image-view.coffee
