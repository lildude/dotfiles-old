(function() {
  var $, DATE_REGEX, FRONT_MATTER_REGEX, IMG_REGEX, IMG_TAG_ATTRIBUTE, IMG_TAG_REGEX, INLINE_LINK_REGEX, REFERENCE_LINK_REGEX, SLUG_REGEX, TABLE_LINE_SEPARATOR_REGEX, URL_REGEX, dasherize, dirTemplate, getCursorScopeRange, getDate, getDateStr, getFrontMatter, getFrontMatterText, getJSON, getSelectedTextBufferRange, getTimeStr, getTitleSlug, hasCursorScope, hasFrontMatter, isImage, isImageTag, isInlineLink, isReferenceDefinition, isReferenceLink, isTableSeparator, isUrl, os, parseDateStr, parseImage, parseImageTag, parseInlineLink, parseReferenceLink, path, reference_def_regex, regexpEscape, template, updateFrontMatter, yaml;

  $ = require("atom-space-pen-views").$;

  os = require("os");

  path = require("path");

  yaml = require("js-yaml");

  getJSON = function(uri, succeed, error) {
    return $.getJSON(uri).done(succeed).fail(error);
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

  IMG_TAG_REGEX = /<img(.*?)\/?>/i;

  IMG_TAG_ATTRIBUTE = /([a-z]+?)=('|")(.*?)\2/ig;

  IMG_REGEX = /!\[(.+?)\]\(([^\)\s]+)\s?[\"\']?([^)]*?)[\"\']?\)/;

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

  isImage = function(input) {
    return IMG_REGEX.test(input);
  };

  parseImage = function(input) {
    var image;
    image = IMG_REGEX.exec(input);
    return {
      alt: image[1],
      src: image[2],
      title: image[3]
    };
  };

  INLINE_LINK_REGEX = /\[(.+?)\]\(([^\)\s]+)\s?[\"\']?([^)]*?)[\"\']?\)/;

  REFERENCE_LINK_REGEX = /\[(.+?)\]\s?\[(.*)\]/;

  reference_def_regex = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = regexpEscape(id);
    }
    return RegExp("^ *\\[" + id + "\\]: +([^\\s]*?)(?: +\"?(.+?)\"?)?$", "m");
  };

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
      throw new Error("Invalid or incomplete inline link");
    }
  };

  isReferenceLink = function(input) {
    return REFERENCE_LINK_REGEX.test(input);
  };

  isReferenceDefinition = function(input) {
    return reference_def_regex(".+?", {
      noEscape: true
    }).test(input);
  };

  parseReferenceLink = function(input, content) {
    var id, link, refn;
    refn = REFERENCE_LINK_REGEX.exec(input);
    id = refn[2] || refn[1];
    link = reference_def_regex(id).exec(content);
    if (link && link.length >= 2) {
      return {
        id: id,
        text: refn[1],
        url: link[1],
        title: link[2] || ""
      };
    } else {
      throw new Error("Cannot find reference tag for specified link");
    }
  };

  URL_REGEX = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/i;

  isUrl = function(url) {
    return URL_REGEX.test(url);
  };

  TABLE_LINE_SEPARATOR_REGEX = /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)\|?$/;

  isTableSeparator = function(line) {
    return TABLE_LINE_SEPARATOR_REGEX.test(line);
  };

  regexpEscape = function(str) {
    return str && str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  dasherize = function(str) {
    return str.trim().toLowerCase().replace(/[^-\w\s]|_/g, "").replace(/\s+/g, "-");
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

  hasCursorScope = function(editor, scope) {
    return editor.getLastCursor().getScopeDescriptor().getScopesArray().indexOf(scope) !== -1;
  };

  getCursorScopeRange = function(editor, wordRegex) {
    if (wordRegex) {
      return editor.getLastCursor().getCurrentWordBufferRange({
        wordRegex: wordRegex
      });
    } else {
      return editor.getLastCursor().getCurrentWordBufferRange();
    }
  };

  getSelectedTextBufferRange = function(editor, scope) {
    if (editor.getSelectedText()) {
      return editor.getSelectedBufferRange();
    } else if (hasCursorScope(editor, scope)) {
      return editor.bufferRangeForScopeAtCursor(scope);
    } else {
      return getCursorScopeRange(editor);
    }
  };

  module.exports = {
    getJSON: getJSON,
    getDate: getDate,
    parseDateStr: parseDateStr,
    getDateStr: getDateStr,
    getTimeStr: getTimeStr,
    hasFrontMatter: hasFrontMatter,
    getFrontMatter: getFrontMatter,
    getFrontMatterText: getFrontMatterText,
    updateFrontMatter: updateFrontMatter,
    frontMatterRegex: FRONT_MATTER_REGEX,
    isImageTag: isImageTag,
    parseImageTag: parseImageTag,
    isImage: isImage,
    parseImage: parseImage,
    isInlineLink: isInlineLink,
    parseInlineLink: parseInlineLink,
    isReferenceLink: isReferenceLink,
    isReferenceDefinition: isReferenceDefinition,
    parseReferenceLink: parseReferenceLink,
    isUrl: isUrl,
    isTableSeparator: isTableSeparator,
    regexpEscape: regexpEscape,
    dasherize: dasherize,
    getTitleSlug: getTitleSlug,
    dirTemplate: dirTemplate,
    template: template,
    hasCursorScope: hasCursorScope,
    getCursorScopeRange: getCursorScopeRange,
    getSelectedTextBufferRange: getSelectedTextBufferRange
  };

}).call(this);
