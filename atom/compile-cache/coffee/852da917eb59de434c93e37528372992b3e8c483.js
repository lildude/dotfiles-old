(function() {
  var $, DATE_REGEX, FRONT_MATTER_REGEX, IMG_REGEX, IMG_TAG_ATTRIBUTE, IMG_TAG_REGEX, INLINE_LINK_REGEX, REFERENCE_DEF_REGEX, REFERENCE_DEF_REGEX_OF, REFERENCE_LINK_REGEX, REFERENCE_LINK_REGEX_OF, SLUG_REGEX, TABLE_ONE_COLUMN_ROW_REGEX, TABLE_ONE_COLUMN_SEPARATOR_REGEX, TABLE_ROW_REGEX, TABLE_SEPARATOR_REGEX, URL_REGEX, createTableRow, createTableSeparator, dasherize, dirTemplate, getBufferRangeForScope, getDate, getDateStr, getFrontMatter, getFrontMatterText, getJSON, getPackagePath, getScopeDescriptor, getTextBufferRange, getTimeStr, getTitleSlug, hasFrontMatter, isImage, isImageTag, isInlineLink, isReferenceDefinition, isReferenceLink, isTableRow, isTableSeparator, isUrl, os, parseDateStr, parseImage, parseImageTag, parseInlineLink, parseReferenceDefinition, parseReferenceLink, parseTableRow, parseTableSeparator, path, regexpEscape, template, updateFrontMatter, wcswidth, yaml,
    __slice = [].slice;

  $ = require("atom-space-pen-views").$;

  os = require("os");

  path = require("path");

  yaml = require("js-yaml");

  wcswidth = require("wcwidth");

  getJSON = function(uri, succeed, error) {
    if (uri.length === 0) {
      return error();
    }
    return $.getJSON(uri).done(succeed).fail(error);
  };

  regexpEscape = function(str) {
    return str && str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  dasherize = function(str) {
    return str.trim().toLowerCase().replace(/[^-\w\s]|_/g, "").replace(/\s+/g, "-");
  };

  getPackagePath = function() {
    var segments;
    segments = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    segments.unshift(atom.packages.resolvePackagePath("markdown-writer"));
    return path.join.apply(null, segments);
  };

  dirTemplate = function(directory, date) {
    return template(directory, getDate(date));
  };

  template = function(text, data, matcher) {
    if (matcher == null) {
      matcher = /[<{]([\w-]+?)[>}]/g;
    }
    return text.replace(matcher, function(match, attr) {
      if (data[attr] != null) {
        return data[attr];
      } else {
        return match;
      }
    });
  };

  DATE_REGEX = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/g;

  parseDateStr = function(str) {
    var date, matches;
    date = new Date();
    matches = DATE_REGEX.exec(str);
    if (matches) {
      date.setYear(parseInt(matches[1], 10));
      date.setMonth(parseInt(matches[2], 10) - 1);
      date.setDate(parseInt(matches[3], 10));
    }
    return getDate(date);
  };

  getDateStr = function(date) {
    date = getDate(date);
    return "" + date.year + "-" + date.month + "-" + date.day;
  };

  getTimeStr = function(date) {
    date = getDate(date);
    return "" + date.hour + ":" + date.minute;
  };

  getDate = function(date) {
    if (date == null) {
      date = new Date();
    }
    return {
      year: "" + date.getFullYear(),
      i_month: "" + (date.getMonth() + 1),
      month: ("0" + (date.getMonth() + 1)).slice(-2),
      i_day: "" + date.getDate(),
      day: ("0" + date.getDate()).slice(-2),
      hour: ("0" + date.getHours()).slice(-2),
      minute: ("0" + date.getMinutes()).slice(-2),
      seconds: ("0" + date.getSeconds()).slice(-2)
    };
  };

  FRONT_MATTER_REGEX = /^(?:---\s*)?([^:]+:[\s\S]*?)\s*---\s*$/m;

  hasFrontMatter = function(content) {
    return !!content && FRONT_MATTER_REGEX.test(content);
  };

  getFrontMatter = function(content) {
    var matches, yamlText;
    matches = content.match(FRONT_MATTER_REGEX);
    if (!matches) {
      return {};
    }
    yamlText = matches[1].trim();
    return yaml.safeLoad(yamlText) || {};
  };

  getFrontMatterText = function(obj, noLeadingFence) {
    var yamlText;
    yamlText = yaml.safeDump(obj);
    if (noLeadingFence) {
      return ["" + yamlText + "---", ""].join(os.EOL);
    } else {
      return ["---", "" + yamlText + "---", ""].join(os.EOL);
    }
  };

  updateFrontMatter = function(editor, frontMatter) {
    return editor.buffer.scan(FRONT_MATTER_REGEX, function(match) {
      var noLeadingFence;
      noLeadingFence = !match.matchText.startsWith("---");
      return match.replace(getFrontMatterText(frontMatter, noLeadingFence));
    });
  };

  SLUG_REGEX = /^(\d{1,4}-\d{1,2}-\d{1,4}-)(.+)$/;

  getTitleSlug = function(str) {
    var matches;
    str = path.basename(str, path.extname(str));
    if (matches = SLUG_REGEX.exec(str)) {
      return matches[2];
    } else {
      return str;
    }
  };

  IMG_TAG_REGEX = /<img(.*?)\/?>/i;

  IMG_TAG_ATTRIBUTE = /([a-z]+?)=('|")(.*?)\2/ig;

  isImageTag = function(input) {
    return IMG_TAG_REGEX.test(input);
  };

  parseImageTag = function(input) {
    var attributes, img, pattern;
    img = {};
    attributes = IMG_TAG_REGEX.exec(input)[1].match(IMG_TAG_ATTRIBUTE);
    pattern = RegExp("" + IMG_TAG_ATTRIBUTE.source, "i");
    attributes.forEach(function(attr) {
      var elem;
      elem = pattern.exec(attr);
      if (elem) {
        return img[elem[1]] = elem[3];
      }
    });
    return img;
  };

  IMG_REGEX = /!\[(.+?)\]\(([^\)\s]+)\s?[\"\']?([^)]*?)[\"\']?\)/;

  isImage = function(input) {
    return IMG_REGEX.test(input);
  };

  parseImage = function(input) {
    var image;
    image = IMG_REGEX.exec(input);
    if (image && image.length >= 3) {
      return {
        alt: image[1],
        src: image[2],
        title: image[3]
      };
    } else {
      return {
        alt: input,
        src: "",
        title: ""
      };
    }
  };

  INLINE_LINK_REGEX = /\[(.+?)\]\(([^\)\s]+)\s?[\"\']?([^)]*?)[\"\']?\)/;

  isInlineLink = function(input) {
    return INLINE_LINK_REGEX.test(input) && !isImage(input);
  };

  parseInlineLink = function(input) {
    var link;
    link = INLINE_LINK_REGEX.exec(input);
    if (link && link.length >= 2) {
      return {
        text: link[1],
        url: link[2],
        title: link[3] || ""
      };
    } else {
      return {
        text: input,
        url: "",
        title: ""
      };
    }
  };

  REFERENCE_LINK_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = regexpEscape(id);
    }
    return RegExp("\\[(" + id + ")\\] ?\\[\\]|\\[([^\\[\\]]+?)\\] ?\\[(" + id + ")\\]");
  };

  REFERENCE_LINK_REGEX = REFERENCE_LINK_REGEX_OF(".+?", {
    noEscape: true
  });

  REFERENCE_DEF_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = regexpEscape(id);
    }
    return RegExp("^ *\\[(" + id + ")\\]: +(\\S*?)(?: +['\"\\(]?(.+?)['\"\\)]?)?$", "m");
  };

  REFERENCE_DEF_REGEX = REFERENCE_DEF_REGEX_OF(".+?", {
    noEscape: true
  });

  isReferenceLink = function(input) {
    return REFERENCE_LINK_REGEX.test(input);
  };

  parseReferenceLink = function(input, editor) {
    var def, id, link, text;
    link = REFERENCE_LINK_REGEX.exec(input);
    text = link[2] || link[1];
    id = link[3] || link[1];
    def = void 0;
    editor.buffer.scan(REFERENCE_DEF_REGEX_OF(id), function(match) {
      return def = match;
    });
    if (def) {
      return {
        id: id,
        text: text,
        url: def.match[2],
        title: def.match[3] || "",
        definitionRange: def.computedRange
      };
    } else {
      return {
        id: id,
        text: text,
        url: "",
        title: "",
        definitionRange: null
      };
    }
  };

  isReferenceDefinition = function(input) {
    return REFERENCE_DEF_REGEX.test(input);
  };

  parseReferenceDefinition = function(input, editor) {
    var def, id, link;
    def = REFERENCE_DEF_REGEX.exec(input);
    id = def[1];
    link = void 0;
    editor.buffer.scan(REFERENCE_LINK_REGEX_OF(id), function(match) {
      return link = match;
    });
    if (link) {
      return {
        id: id,
        text: link.match[2] || link.match[1],
        url: def[2],
        title: def[3] || "",
        linkRange: link.computedRange
      };
    } else {
      return {
        id: id,
        text: "",
        url: def[2],
        title: def[3] || "",
        linkRange: null
      };
    }
  };

  TABLE_SEPARATOR_REGEX = /^(\|)?((?:\s*:?-+:?\s*\|)+(?:\s*:?-+:?\s*))(\|)?$/;

  TABLE_ONE_COLUMN_SEPARATOR_REGEX = /^(\|)(\s*:?-+:?\s*)(\|)$/;

  isTableSeparator = function(line) {
    return TABLE_SEPARATOR_REGEX.test(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.test(line);
  };

  parseTableSeparator = function(line) {
    var columns, matches;
    matches = TABLE_SEPARATOR_REGEX.exec(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.exec(line);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: true,
      extraPipes: !!(matches[1] || matches[matches.length - 1]),
      columns: columns,
      columnWidths: columns.map(function(col) {
        return col.length;
      }),
      alignments: columns.map(function(col) {
        var head, tail;
        head = col[0] === ":";
        tail = col[col.length - 1] === ":";
        if (head && tail) {
          return "center";
        } else if (head) {
          return "left";
        } else if (tail) {
          return "right";
        } else {
          return "empty";
        }
      })
    };
  };

  TABLE_ROW_REGEX = /^(\|)?(.+?\|.+?)(\|)?$/;

  TABLE_ONE_COLUMN_ROW_REGEX = /^(\|)([^\|]+?)(\|)$/;

  isTableRow = function(line) {
    return TABLE_ROW_REGEX.test(line) || TABLE_ONE_COLUMN_ROW_REGEX.test(line);
  };

  parseTableRow = function(line) {
    var columns, matches;
    if (isTableSeparator(line)) {
      return parseTableSeparator(line);
    }
    matches = TABLE_ROW_REGEX.exec(line) || TABLE_ONE_COLUMN_ROW_REGEX.exec(line);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: false,
      extraPipes: !!(matches[1] || matches[matches.length - 1]),
      columns: columns,
      columnWidths: columns.map(function(col) {
        return wcswidth(col);
      })
    };
  };

  createTableSeparator = function(options) {
    var columnWidth, i, row, _i, _ref;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = _i = 0, _ref = options.numOfColumns - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(":" + "-".repeat(columnWidth - 2) + ":");
          break;
        case "left":
          row.push(":" + "-".repeat(columnWidth - 1));
          break;
        case "right":
          row.push("-".repeat(columnWidth - 1) + ":");
          break;
        default:
          row.push("-".repeat(columnWidth));
      }
    }
    row = row.join("|");
    if (options.extraPipes) {
      return "|" + row + "|";
    } else {
      return row;
    }
  };

  createTableRow = function(columns, options) {
    var columnWidth, i, len, row, _i, _ref;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = _i = 0, _ref = options.numOfColumns - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      if (!options.extraPipes && (i === 0 || i === options.numOfColumns - 1)) {
        columnWidth -= 1;
      } else {
        columnWidth -= 2;
      }
      if (!columns[i]) {
        row.push(" ".repeat(columnWidth));
        continue;
      }
      len = columnWidth - wcswidth(columns[i]);
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(" ".repeat(len / 2) + columns[i] + " ".repeat((len + 1) / 2));
          break;
        case "left":
          row.push(columns[i] + " ".repeat(len));
          break;
        case "right":
          row.push(" ".repeat(len) + columns[i]);
          break;
        default:
          row.push(columns[i] + " ".repeat(len));
      }
    }
    row = row.join(" | ");
    if (options.extraPipes) {
      return "| " + row + " |";
    } else {
      return row;
    }
  };

  URL_REGEX = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/i;

  isUrl = function(url) {
    return URL_REGEX.test(url);
  };

  getScopeDescriptor = function(cursor, scopeSelector) {
    var scopes;
    scopes = cursor.getScopeDescriptor().getScopesArray().filter(function(scope) {
      return scope.indexOf(scopeSelector) >= 0;
    });
    if (scopes.indexOf(scopeSelector) >= 0) {
      return scopeSelector;
    } else if (scopes.length > 0) {
      return scopes[0];
    }
  };

  getBufferRangeForScope = function(editor, cursor, scopeSelector) {
    var pos, range;
    pos = cursor.getBufferPosition();
    range = editor.displayBuffer.bufferRangeForScopeAtPosition(scopeSelector, pos);
    if (range) {
      return range;
    }
    pos = [pos.row, Math.max(0, pos.column - 1)];
    return editor.displayBuffer.bufferRangeForScopeAtPosition(scopeSelector, pos);
  };

  getTextBufferRange = function(editor, scopeSelector, selection) {
    var cursor, scope, wordRegex;
    if (selection == null) {
      selection = editor.getLastSelection();
    }
    cursor = selection.cursor;
    if (selection.getText()) {
      return selection.getBufferRange();
    } else if ((scope = getScopeDescriptor(cursor, scopeSelector))) {
      return getBufferRangeForScope(editor, cursor, scope);
    } else {
      wordRegex = cursor.wordRegExp({
        includeNonWordCharacters: false
      });
      return cursor.getCurrentWordBufferRange({
        wordRegex: wordRegex
      });
    }
  };

  module.exports = {
    getJSON: getJSON,
    regexpEscape: regexpEscape,
    dasherize: dasherize,
    getPackagePath: getPackagePath,
    dirTemplate: dirTemplate,
    template: template,
    getDate: getDate,
    parseDateStr: parseDateStr,
    getDateStr: getDateStr,
    getTimeStr: getTimeStr,
    hasFrontMatter: hasFrontMatter,
    getFrontMatter: getFrontMatter,
    getFrontMatterText: getFrontMatterText,
    updateFrontMatter: updateFrontMatter,
    getTitleSlug: getTitleSlug,
    isImageTag: isImageTag,
    parseImageTag: parseImageTag,
    isImage: isImage,
    parseImage: parseImage,
    isInlineLink: isInlineLink,
    parseInlineLink: parseInlineLink,
    isReferenceLink: isReferenceLink,
    parseReferenceLink: parseReferenceLink,
    isReferenceDefinition: isReferenceDefinition,
    parseReferenceDefinition: parseReferenceDefinition,
    isTableSeparator: isTableSeparator,
    parseTableSeparator: parseTableSeparator,
    createTableSeparator: createTableSeparator,
    isTableRow: isTableRow,
    parseTableRow: parseTableRow,
    createTableRow: createTableRow,
    isUrl: isUrl,
    getTextBufferRange: getTextBufferRange
  };

}).call(this);
