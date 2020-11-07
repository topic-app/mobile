function createHTML(options = {}) {
  const {
    backgroundColor = '#FFF',
    color = '#000033',
    placeholderColor = '#a9a9a9',
    contentCSSText = '',
    cssText = '',
  } = options;
  // ERROR: HTML height not 100%;
  return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <style>
        * {outline: 0px solid transparent;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-touch-callout: none;}
        html, body { margin: 0; padding: 0;font-family: Arial, Helvetica, sans-serif; font-size:1em;}
        body { overflow-y: hidden; -webkit-overflow-scrolling: touch;height: 100%;background-color: ${backgroundColor};}
        img {max-width: 98%;margin-left:auto;margin-right:auto;display: block;}
        video {max-width: 98%;margin-left:auto;margin-right:auto;display: block;}
        .content {font-family: Arial, Helvetica, sans-serif;color: ${color}; width: 100%;height: 100%;-webkit-overflow-scrolling: touch;padding-left: 0;padding-right: 0;}
        .pell { height: 100%;} .pell-content { outline: 0; overflow-y: auto;padding: 10px;height: 100%;${contentCSSText}}
        table {width: 100% !important;}
        table td {width: inherit;}
        table span { font-size: 12px !important; }
        ${cssText}
    </style>
    <style>
        [placeholder]:empty:before { content: attr(placeholder); color: ${placeholderColor};}
        [placeholder]:empty:focus:before { content: attr(placeholder);color: ${placeholderColor};}
    </style>
</head>
<body>
<div class="content"><div id="editor" class="pell"></div></div>
<script>
var TurndownService = (function () {
'use strict';

function extend (destination) {
for (var i = 1; i < arguments.length; i++) {
  var source = arguments[i];
  for (var key in source) {
    if (source.hasOwnProperty(key)) destination[key] = source[key];
  }
}
return destination
}

function repeat (character, count) {
return Array(count + 1).join(character)
}

var blockElements = [
'ADDRESS', 'ARTICLE', 'ASIDE', 'AUDIO', 'BLOCKQUOTE', 'BODY', 'CANVAS',
'CENTER', 'DD', 'DIR', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE',
'FOOTER', 'FORM', 'FRAMESET', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER',
'HGROUP', 'HR', 'HTML', 'ISINDEX', 'LI', 'MAIN', 'MENU', 'NAV', 'NOFRAMES',
'NOSCRIPT', 'OL', 'OUTPUT', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD',
'TFOOT', 'TH', 'THEAD', 'TR', 'UL'
];

function isBlock (node) {
return is(node, blockElements)
}

var voidElements = [
'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
];

function isVoid (node) {
return is(node, voidElements)
}

function hasVoid (node) {
return has(node, voidElements)
}

var meaningfulWhenBlankElements = [
'A', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TH', 'TD', 'IFRAME', 'SCRIPT',
'AUDIO', 'VIDEO'
];

function isMeaningfulWhenBlank (node) {
return is(node, meaningfulWhenBlankElements)
}

function hasMeaningfulWhenBlank (node) {
return has(node, meaningfulWhenBlankElements)
}

function is (node, tagNames) {
return tagNames.indexOf(node.nodeName) >= 0
}

function has (node, tagNames) {
return (
  node.getElementsByTagName &&
  tagNames.some(function (tagName) {
    return node.getElementsByTagName(tagName).length
  })
)
}

var rules = {};

rules.paragraph = {
filter: 'p',

replacement: function (content) {
  return '\\n\\n' + content + '\\n\\n'
}
};

rules.lineBreak = {
filter: 'br',

replacement: function (content, node, options) {
  return options.br + '\\n'
}
};

rules.heading = {
filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

replacement: function (content, node, options) {
  var hLevel = Number(node.nodeName.charAt(1));

  if (options.headingStyle === 'setext' && hLevel < 3) {
    var underline = repeat((hLevel === 1 ? '=' : '-'), content.length);
    return (
      '\\n\\n' + content + '\\n' + underline + '\\n\\n'
    )
  } else {
    return '\\n\\n' + repeat('#', hLevel) + ' ' + content + '\\n\\n'
  }
}
};

rules.blockquote = {
filter: 'blockquote',

replacement: function (content) {
  content = content.replace(/^\\n+|\\n+$/g, '');
  content = content.replace(/^/gm, '> ');
  return '\\n\\n' + content + '\\n\\n'
}
};

rules.list = {
filter: ['ul', 'ol'],

replacement: function (content, node) {
  var parent = node.parentNode;
  if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
    return '\\n' + content
  } else {
    return '\\n\\n' + content + '\\n\\n'
  }
}
};

rules.listItem = {
filter: 'li',

replacement: function (content, node, options) {
  content = content
    .replace(/^\\n+/, '') // remove leading newlines
    .replace(/\\n+$/, '\\n') // replace trailing newlines with just a single one
    .replace(/\\n/gm, '\\n    '); // indent
  var prefix = options.bulletListMarker + '   ';
  var parent = node.parentNode;
  if (parent.nodeName === 'OL') {
    var start = parent.getAttribute('start');
    var index = Array.prototype.indexOf.call(parent.children, node);
    prefix = (start ? Number(start) + index : index + 1) + '.  ';
  }
  return (
    prefix + content + (node.nextSibling && !/\\n$/.test(content) ? '\\n' : '')
  )
}
};

rules.indentedCodeBlock = {
filter: function (node, options) {
  return (
    options.codeBlockStyle === 'indented' &&
    node.nodeName === 'PRE' &&
    node.firstChild &&
    node.firstChild.nodeName === 'CODE'
  )
},

replacement: function (content, node, options) {
  return (
    '\\n\\n    ' +
    node.firstChild.textContent.replace(/\\n/g, '\\n    ') +
    '\\n\\n'
  )
}
};

rules.fencedCodeBlock = {
filter: function (node, options) {
  return (
    options.codeBlockStyle === 'fenced' &&
    node.nodeName === 'PRE' &&
    node.firstChild &&
    node.firstChild.nodeName === 'CODE'
  )
},

replacement: function (content, node, options) {
  var className = node.firstChild.getAttribute('class') || '';
  var language = (className.match(/language-(\\S+)/) || [null, ''])[1];
  var code = node.firstChild.textContent;

  var fenceChar = options.fence.charAt(0);
  var fenceSize = 3;
  var fenceInCodeRegex = new RegExp('^' + fenceChar + '{3,}', 'gm');

  var match;
  while ((match = fenceInCodeRegex.exec(code))) {
    if (match[0].length >= fenceSize) {
      fenceSize = match[0].length + 1;
    }
  }

  var fence = repeat(fenceChar, fenceSize);

  return (
    '\\n\\n' + fence + language + '\\n' +
    code.replace(/\\n$/, '') +
    '\\n' + fence + '\\n\\n'
  )
}
};

rules.horizontalRule = {
filter: 'hr',

replacement: function (content, node, options) {
  return '\\n\\n' + options.hr + '\\n\\n'
}
};

rules.inlineLink = {
filter: function (node, options) {
  return (
    options.linkStyle === 'inlined' &&
    node.nodeName === 'A' &&
    node.getAttribute('href')
  )
},

replacement: function (content, node) {
  var href = node.getAttribute('href');
  var title = cleanAttribute(node.getAttribute('title'));
  if (title) title = ' "' + title + '"';
  return '[' + content + '](' + href + title + ')'
}
};

rules.referenceLink = {
filter: function (node, options) {
  return (
    options.linkStyle === 'referenced' &&
    node.nodeName === 'A' &&
    node.getAttribute('href')
  )
},

replacement: function (content, node, options) {
  var href = node.getAttribute('href');
  var title = cleanAttribute(node.getAttribute('title'));
  if (title) title = ' "' + title + '"';
  var replacement;
  var reference;

  switch (options.linkReferenceStyle) {
    case 'collapsed':
      replacement = '[' + content + '][]';
      reference = '[' + content + ']: ' + href + title;
      break
    case 'shortcut':
      replacement = '[' + content + ']';
      reference = '[' + content + ']: ' + href + title;
      break
    default:
      var id = this.references.length + 1;
      replacement = '[' + content + '][' + id + ']';
      reference = '[' + id + ']: ' + href + title;
  }

  this.references.push(reference);
  return replacement
},

references: [],

append: function (options) {
  var references = '';
  if (this.references.length) {
    references = '\\n\\n' + this.references.join('\\n') + '\\n\\n';
    this.references = []; // Reset references
  }
  return references
}
};

rules.emphasis = {
filter: ['em', 'i'],

replacement: function (content, node, options) {
  if (!content.trim()) return ''
  return options.emDelimiter + content + options.emDelimiter
}
};

rules.strong = {
filter: ['strong', 'b'],

replacement: function (content, node, options) {
  if (!content.trim()) return ''
  return options.strongDelimiter + content + options.strongDelimiter
}
};

rules.code = {
filter: function (node) {
  var hasSiblings = node.previousSibling || node.nextSibling;
  var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

  return node.nodeName === 'CODE' && !isCodeBlock
},

replacement: function (content) {
  if (!content.trim()) return ''

  var delimiter = '\`';
  var leadingSpace = '';
  var trailingSpace = '';
  var matches = content.match(/\`+/gm);
  if (matches) {
    if (/^\`/.test(content)) leadingSpace = ' ';
    if (/\`$/.test(content)) trailingSpace = ' ';
    while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '\`';
  }

  return delimiter + leadingSpace + content + trailingSpace + delimiter
}
};

rules.image = {
filter: 'img',

replacement: function (content, node) {
  var alt = cleanAttribute(node.getAttribute('alt'));
  var src = node.getAttribute('src') || '';
  var title = cleanAttribute(node.getAttribute('title'));
  var titlePart = title ? ' "' + title + '"' : '';
  return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
}
};

function cleanAttribute (attribute) {
return attribute ? attribute.replace(/(\\n+\\s*)+/g, '\\n') : ''
}

/**
* Manages a collection of rules used to convert HTML to Markdown
*/

function Rules (options) {
this.options = options;
this._keep = [];
this._remove = [];

this.blankRule = {
  replacement: options.blankReplacement
};

this.keepReplacement = options.keepReplacement;

this.defaultRule = {
  replacement: options.defaultReplacement
};

this.array = [];
for (var key in options.rules) this.array.push(options.rules[key]);
}

Rules.prototype = {
add: function (key, rule) {
  this.array.unshift(rule);
},

keep: function (filter) {
  this._keep.unshift({
    filter: filter,
    replacement: this.keepReplacement
  });
},

remove: function (filter) {
  this._remove.unshift({
    filter: filter,
    replacement: function () {
      return ''
    }
  });
},

forNode: function (node) {
  if (node.isBlank) return this.blankRule
  var rule;

  if ((rule = findRule(this.array, node, this.options))) return rule
  if ((rule = findRule(this._keep, node, this.options))) return rule
  if ((rule = findRule(this._remove, node, this.options))) return rule

  return this.defaultRule
},

forEach: function (fn) {
  for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
}
};

function findRule (rules, node, options) {
for (var i = 0; i < rules.length; i++) {
  var rule = rules[i];
  if (filterValue(rule, node, options)) return rule
}
return void 0
}

function filterValue (rule, node, options) {
var filter = rule.filter;
if (typeof filter === 'string') {
  if (filter === node.nodeName.toLowerCase()) return true
} else if (Array.isArray(filter)) {
  if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
} else if (typeof filter === 'function') {
  if (filter.call(rule, node, options)) return true
} else {
  throw new TypeError('\`filter\` needs to be a string, array, or function')
}
}

/**
* The collapseWhitespace function is adapted from collapse-whitespace
* by Luc Thevenard.
*
* The MIT License (MIT)
*
* Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

/**
* collapseWhitespace(options) removes extraneous whitespace from an the given element.
*
* @param {Object} options
*/
function collapseWhitespace (options) {
var element = options.element;
var isBlock = options.isBlock;
var isVoid = options.isVoid;
var isPre = options.isPre || function (node) {
  return node.nodeName === 'PRE'
};

if (!element.firstChild || isPre(element)) return

var prevText = null;
var prevVoid = false;

var prev = null;
var node = next(prev, element, isPre);

while (node !== element) {
  if (node.nodeType === 3 || node.nodeType === 4) { // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
    var text = node.data.replace(/[ \\r\\n\\t]+/g, ' ');

    if ((!prevText || / $/.test(prevText.data)) &&
        !prevVoid && text[0] === ' ') {
      text = text.substr(1);
    }

    // \`text\` might be empty at this point.
    if (!text) {
      node = remove(node);
      continue
    }

    node.data = text;

    prevText = node;
  } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
    if (isBlock(node) || node.nodeName === 'BR') {
      if (prevText) {
        prevText.data = prevText.data.replace(/ $/, '');
      }

      prevText = null;
      prevVoid = false;
    } else if (isVoid(node)) {
      // Avoid trimming space around non-block, non-BR void elements.
      prevText = null;
      prevVoid = true;
    }
  } else {
    node = remove(node);
    continue
  }

  var nextNode = next(prev, node, isPre);
  prev = node;
  node = nextNode;
}

if (prevText) {
  prevText.data = prevText.data.replace(/ $/, '');
  if (!prevText.data) {
    remove(prevText);
  }
}
}

/**
* remove(node) removes the given node from the DOM and returns the
* next node in the sequence.
*
* @param {Node} node
* @return {Node} node
*/
function remove (node) {
var next = node.nextSibling || node.parentNode;

node.parentNode.removeChild(node);

return next
}

/**
* next(prev, current, isPre) returns the next node in the sequence, given the
* current and previous nodes.
*
* @param {Node} prev
* @param {Node} current
* @param {Function} isPre
* @return {Node}
*/
function next (prev, current, isPre) {
if ((prev && prev.parentNode === current) || isPre(current)) {
  return current.nextSibling || current.parentNode
}

return current.firstChild || current.nextSibling || current.parentNode
}

/*
* Set up window for Node.js
*/

var root = (typeof window !== 'undefined' ? window : {});

/*
* Parsing HTML strings
*/

function canParseHTMLNatively () {
var Parser = root.DOMParser;
var canParse = false;

// Adapted from https://gist.github.com/1129031
// Firefox/Opera/IE throw errors on unsupported types
try {
  // WebKit returns null on unsupported types
  if (new Parser().parseFromString('', 'text/html')) {
    canParse = true;
  }
} catch (e) {}

return canParse
}

function createHTMLParser () {
var Parser = function () {};

{
  if (shouldUseActiveX()) {
    Parser.prototype.parseFromString = function (string) {
      var doc = new window.ActiveXObject('htmlfile');
      doc.designMode = 'on'; // disable on-page scripts
      doc.open();
      doc.write(string);
      doc.close();
      return doc
    };
  } else {
    Parser.prototype.parseFromString = function (string) {
      var doc = document.implementation.createHTMLDocument('');
      doc.open();
      doc.write(string);
      doc.close();
      return doc
    };
  }
}
return Parser
}

function shouldUseActiveX () {
var useActiveX = false;
try {
  document.implementation.createHTMLDocument('').open();
} catch (e) {
  if (window.ActiveXObject) useActiveX = true;
}
return useActiveX
}

var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

function RootNode (input) {
var root;
if (typeof input === 'string') {
  var doc = htmlParser().parseFromString(
    // DOM parsers arrange elements in the <head> and <body>.
    // Wrapping in a custom element ensures elements are reliably arranged in
    // a single element.
    '<x-turndown id="turndown-root">' + input + '</x-turndown>',
    'text/html'
  );
  root = doc.getElementById('turndown-root');
} else {
  root = input.cloneNode(true);
}
collapseWhitespace({
  element: root,
  isBlock: isBlock,
  isVoid: isVoid
});

return root
}

var _htmlParser;
function htmlParser () {
_htmlParser = _htmlParser || new HTMLParser();
return _htmlParser
}

function Node (node) {
node.isBlock = isBlock(node);
node.isCode = node.nodeName.toLowerCase() === 'code' || node.parentNode.isCode;
node.isBlank = isBlank(node);
node.flankingWhitespace = flankingWhitespace(node);
return node
}

function isBlank (node) {
return (
  !isVoid(node) &&
  !isMeaningfulWhenBlank(node) &&
  /^\\s*$/i.test(node.textContent) &&
  !hasVoid(node) &&
  !hasMeaningfulWhenBlank(node)
)
}

function flankingWhitespace (node) {
var leading = '';
var trailing = '';

if (!node.isBlock) {
  var hasLeading = /^\\s/.test(node.textContent);
  var hasTrailing = /\\s$/.test(node.textContent);
  var blankWithSpaces = node.isBlank && hasLeading && hasTrailing;

  if (hasLeading && !isFlankedByWhitespace('left', node)) {
    leading = ' ';
  }

  if (!blankWithSpaces && hasTrailing && !isFlankedByWhitespace('right', node)) {
    trailing = ' ';
  }
}

return { leading: leading, trailing: trailing }
}

function isFlankedByWhitespace (side, node) {
var sibling;
var regExp;
var isFlanked;

if (side === 'left') {
  sibling = node.previousSibling;
  regExp = / $/;
} else {
  sibling = node.nextSibling;
  regExp = /^ /;
}

if (sibling) {
  if (sibling.nodeType === 3) {
    isFlanked = regExp.test(sibling.nodeValue);
  } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
    isFlanked = regExp.test(sibling.textContent);
  }
}
return isFlanked
}

var reduce = Array.prototype.reduce;
var leadingNewLinesRegExp = /^\\n*/;
var trailingNewLinesRegExp = /\\n*$/;
var escapes = [
[/\\\\/g, '\\\\\\\\'],
[/\\*/g, '\\\\*'],
[/^-/g, '\\\\-'],
[/^\\+ /g, '\\\\+ '],
[/^(=+)/g, '\\\\$1'],
[/^(#{1,6}) /g, '\\\\$1 '],
[/\`/g, '\\\\\`'],
[/^~~~/g, '\\\\~~~'],
[/\\[/g, '\\\\['],
[/\\]/g, '\\\\]'],
[/^>/g, '\\\\>'],
[/_/g, '\\\\_'],
[/^(\\d+)\\. /g, '$1\\\\. ']
];

function TurndownService (options) {
if (!(this instanceof TurndownService)) return new TurndownService(options)

var defaults = {
  rules: rules,
  headingStyle: 'setext',
  hr: '* * *',
  bulletListMarker: '*',
  codeBlockStyle: 'indented',
  fence: '\`\`\`',
  emDelimiter: '_',
  strongDelimiter: '**',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
  br: '  ',
  blankReplacement: function (content, node) {
    return node.isBlock ? '\\n\\n' : ''
  },
  keepReplacement: function (content, node) {
    return node.isBlock ? '\\n\\n' + node.outerHTML + '\\n\\n' : node.outerHTML
  },
  defaultReplacement: function (content, node) {
    return node.isBlock ? '\\n\\n' + content + '\\n\\n' : content
  }
};
this.options = extend({}, defaults, options);
this.rules = new Rules(this.options);
}

TurndownService.prototype = {
/**
 * The entry point for converting a string or DOM node to Markdown
 * @public
 * @param {String|HTMLElement} input The string or DOM node to convert
 * @returns A Markdown representation of the input
 * @type String
 */

turndown: function (input) {
  if (!canConvert(input)) {
    throw new TypeError(
      input + ' is not a string, or an element/document/fragment node.'
    )
  }

  if (input === '') return ''

  var output = process.call(this, new RootNode(input));
  return postProcess.call(this, output)
},

/**
 * Add one or more plugins
 * @public
 * @param {Function|Array} plugin The plugin or array of plugins to add
 * @returns The Turndown instance for chaining
 * @type Object
 */

use: function (plugin) {
  if (Array.isArray(plugin)) {
    for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
  } else if (typeof plugin === 'function') {
    plugin(this);
  } else {
    throw new TypeError('plugin must be a Function or an Array of Functions')
  }
  return this
},

/**
 * Adds a rule
 * @public
 * @param {String} key The unique key of the rule
 * @param {Object} rule The rule
 * @returns The Turndown instance for chaining
 * @type Object
 */

addRule: function (key, rule) {
  this.rules.add(key, rule);
  return this
},

/**
 * Keep a node (as HTML) that matches the filter
 * @public
 * @param {String|Array|Function} filter The unique key of the rule
 * @returns The Turndown instance for chaining
 * @type Object
 */

keep: function (filter) {
  this.rules.keep(filter);
  return this
},

/**
 * Remove a node that matches the filter
 * @public
 * @param {String|Array|Function} filter The unique key of the rule
 * @returns The Turndown instance for chaining
 * @type Object
 */

remove: function (filter) {
  this.rules.remove(filter);
  return this
},

/**
 * Escapes Markdown syntax
 * @public
 * @param {String} string The string to escape
 * @returns A string with Markdown syntax escaped
 * @type String
 */

escape: function (string) {
  return escapes.reduce(function (accumulator, escape) {
    return accumulator.replace(escape[0], escape[1])
  }, string)
}
};

/**
* Reduces a DOM node down to its Markdown string equivalent
* @private
* @param {HTMLElement} parentNode The node to convert
* @returns A Markdown representation of the node
* @type String
*/

function process (parentNode) {
var self = this;
return reduce.call(parentNode.childNodes, function (output, node) {
  node = new Node(node);

  var replacement = '';
  if (node.nodeType === 3) {
    replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
  } else if (node.nodeType === 1) {
    replacement = replacementForNode.call(self, node);
  }

  return join(output, replacement)
}, '')
}

/**
* Appends strings as each rule requires and trims the output
* @private
* @param {String} output The conversion output
* @returns A trimmed version of the ouput
* @type String
*/

function postProcess (output) {
var self = this;
this.rules.forEach(function (rule) {
  if (typeof rule.append === 'function') {
    output = join(output, rule.append(self.options));
  }
});

return output.replace(/^[\\t\\r\\n]+/, '').replace(/[\\t\\r\\n\\s]+$/, '')
}

/**
* Converts an element node to its Markdown equivalent
* @private
* @param {HTMLElement} node The node to convert
* @returns A Markdown representation of the node
* @type String
*/

function replacementForNode (node) {
var rule = this.rules.forNode(node);
var content = process.call(this, node);
var whitespace = node.flankingWhitespace;
if (whitespace.leading || whitespace.trailing) content = content.trim();
return (
  whitespace.leading +
  rule.replacement(content, node, this.options) +
  whitespace.trailing
)
}

/**
* Determines the new lines between the current output and the replacement
* @private
* @param {String} output The current conversion output
* @param {String} replacement The string to append to the output
* @returns The whitespace to separate the current output and the replacement
* @type String
*/

function separatingNewlines (output, replacement) {
var newlines = [
  output.match(trailingNewLinesRegExp)[0],
  replacement.match(leadingNewLinesRegExp)[0]
].sort();
var maxNewlines = newlines[newlines.length - 1];
return maxNewlines.length < 2 ? maxNewlines : '\\n\\n'
}

function join (string1, string2) {
var separator = separatingNewlines(string1, string2);

// Remove trailing/leading newlines and replace with separator
string1 = string1.replace(trailingNewLinesRegExp, '');
string2 = string2.replace(leadingNewLinesRegExp, '');

return string1 + separator + string2
}

/**
* Determines whether an input can be converted
* @private
* @param {String|HTMLElement} input Describe this parameter
* @returns Describe what it returns
* @type String|Object|Array|Boolean|Number
*/

function canConvert (input) {
return (
  input != null && (
    typeof input === 'string' ||
    (input.nodeType && (
      input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
    ))
  )
)
}

return TurndownService;

}());
</script>
<script>
    var placeholderColor = '${placeholderColor}';
    var __DEV__ = !!${window.__DEV__};
    (function (exports) {
        var body = document.body, docEle = document.documentElement;
        var defaultParagraphSeparatorString = 'defaultParagraphSeparator';
        var formatBlock = 'formatBlock';
        var editor = null, o_height = 0;
        var addEventListener = function addEventListener(parent, type, listener) {
            return parent.addEventListener(type, listener);
        };
        var appendChild = function appendChild(parent, child) {
            return parent.appendChild(child);
        };
        var createElement = function createElement(tag) {
            return document.createElement(tag);
        };
        var queryCommandState = function queryCommandState(command) {
            return document.queryCommandState(command);
        };
        var queryCommandValue = function queryCommandValue(command) {
            return document.queryCommandValue(command);
        };

        var exec = function exec(command) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            return document.execCommand(command, false, value);
        };

        var postAction = function(data){
            editor.content.contentEditable === 'true' && exports.window.postMessage(JSON.stringify(data));
        };

        console.log = function (){
            __DEV__ && postAction({type: 'LOG', data: Array.prototype.slice.call(arguments)});
        }

        var anchorNode = void 0, focusNode = void 0, anchorOffset = 0, focusOffset = 0;
        var saveSelection = function(){
            var sel = window.getSelection();
            anchorNode = sel.anchorNode;
            anchorOffset = sel.anchorOffset;
            focusNode = sel.focusNode;
            focusOffset = sel.focusOffset;
        }

        var focusCurrent = function (){
            editor.content.focus();
            try {
                var selection = window.getSelection();
                if (anchorNode){
                    var range = document.createRange();
                    range.setStart(anchorNode, anchorOffset);
                    range.setEnd(focusNode, focusOffset);
                    focusOffset === anchorOffset && range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    selection.selectAllChildren(editor.content);
                    selection.collapseToEnd();
                }
            } catch(e){
                console.log(e)
            }
        }

        var Actions = {
            bold: { state: function() { return queryCommandState('bold'); }, result: function() { return exec('bold'); }},
            italic: { state: function() { return queryCommandState('italic'); }, result: function() { return exec('italic'); }},
            underline: { state: function() { return queryCommandState('underline'); }, result: function() { return exec('underline'); }},
            strikeThrough: { state: function() { return queryCommandState('strikeThrough'); }, result: function() { return exec('strikeThrough'); }},
            heading1: { result: function() { return exec(formatBlock, '<h1>'); }},
            heading2: { result: function() { return exec(formatBlock, '<h2>'); }},
            heading3: { result: function() { return exec(formatBlock, '<h3>'); }},
            heading4: { result: function() { return exec(formatBlock, '<h4>'); }},
            heading5: { result: function() { return exec(formatBlock, '<h5>'); }},
            heading6: { result: function() { return exec(formatBlock, '<h6>'); }},
            paragraph: { result: function() { return exec(formatBlock, '<p>'); }},
            quote: { result: function() { return exec(formatBlock, '<blockquote>'); }},
            orderedList: { state: function() { return queryCommandState('insertOrderedList'); }, result: function() { return exec('insertOrderedList'); }},
            unorderedList: { state: function() { return queryCommandState('insertUnorderedList'); },result: function() { return exec('insertUnorderedList'); }},
            code: { result: function() { return exec(formatBlock, '<pre>'); }},
            line: { result: function() { return exec('insertHorizontalRule'); }},
            link: {
                result: function(data) {
                    data = data || {};
                    var title = data.title;
                    // title = title || window.prompt('Enter the link title');
                    var url = data.url || window.prompt('Enter the link URL');
                    if (url){
                        exec('insertHTML', "<a href='"+ url +"'>"+(title || url)+"</a>");
                    }
                }
            },
            image: {
                result: function(url) {
                    if (url){
                        exec('insertHTML', "<br><div><img src='"+ url +"'/></div><br>");
                        Actions.UPDATE_HEIGHT();
                    }
                }
            },
            html: {
                result: function (html){
                    if (html){
                        exec('insertHTML', html);
                        Actions.UPDATE_HEIGHT();
                    }
                }
            },
            text: { result: function (text){ text && exec('insertText', text); }},
            video: {
                result: function(url) {
                    if (url) {
                        var thumbnail = url.replace(/.(mp4|m3u8)/g, '') + '-thumbnail';
                        exec('insertHTML', "<br><div><video src='"+ url +"' poster='"+ thumbnail + "' controls><source src='"+ url +"' type='video/mp4'>No video tag support</video></div><br>");
                        Actions.UPDATE_HEIGHT();
                    }
                }
            },
            content: {
                setDisable: function(dis){ this.blur(); editor.content.contentEditable = !dis},
                setHtml: function(html) { editor.content.innerHTML = html; },
                getHtml: function() { return editor.content.innerHTML; },
                getMarkdown: function() {
                  const turndownService = new TurndownService();
                  return turndownService.turndown(editor.content.innerHTML)
                },
                blur: function() { editor.content.blur(); },
                focus: function() { focusCurrent(); },
                postHtml: function (){ postAction({type: 'CONTENT_HTML_RESPONSE', data: editor.content.innerHTML}); },
                setPlaceholder: function(placeholder){ editor.content.setAttribute("placeholder", placeholder) },

                setContentStyle: function(styles) {
                    styles = styles || {};
                    var bgColor = styles.backgroundColor, color = styles.color, pColor = styles.placeholderColor;
                    if (bgColor && bgColor !== body.style.backgroundColor) body.style.backgroundColor = bgColor;
                    if (color && color !== editor.content.style.color) editor.content.style.color = color;
                    if (pColor && pColor !== placeholderColor){
                        var rule1="[placeholder]:empty:before {content:attr(placeholder);color:"+pColor+";}";
                        var rule2="[placeholder]:empty:focus:before{content:attr(placeholder);color:"+pColor+";}";
                        try {
                            document.styleSheets[1].deleteRule(0);document.styleSheets[1].deleteRule(0);
                            document.styleSheets[1].insertRule(rule1); document.styleSheets[1].insertRule(rule2);
                            placeholderColor = pColor;
                        } catch (e){
                            console.log("set placeholderColor error!")
                        }
                    }
                }
            },

            init: function (){
                setInterval(Actions.UPDATE_HEIGHT, 150);
                Actions.UPDATE_HEIGHT();
            },

            UPDATE_HEIGHT: function() {
                var height = Math.max(docEle.scrollHeight, body.scrollHeight);
                if (o_height !== height){
                    postAction({type: 'OFFSET_HEIGHT', data: o_height = height});
                }
            }
        };

        var init = function init(settings) {
            var defaultParagraphSeparator = settings[defaultParagraphSeparatorString] || 'div';
            var content = settings.element.content = createElement('div');
            content.id = 'content';
            content.contentEditable = true;
            content.spellcheck = false;
            content.autocapitalize = 'off';
            content.autocorrect = 'off';
            content.autocomplete = 'off';
            content.className = "pell-content";
            content.oninput = function (_ref) {
                // var firstChild = _ref.target.firstChild;
                // if (firstChild && firstChild.nodeType === 3) exec(formatBlock, '<' + defaultParagraphSeparator + '>');else if (content.innerHTML === '<br>') content.innerHTML = '';
                settings.onChange(content.innerHTML);
                saveSelection();
            };
            content.onkeydown = function (event) {
                if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
                    setTimeout(function () {
                        return exec(formatBlock, '<' + defaultParagraphSeparator + '>');
                    }, 0);
                }
            };
            appendChild(settings.element, content);

            if (settings.styleWithCSS) exec('styleWithCSS');
            exec(defaultParagraphSeparatorString, defaultParagraphSeparator);

            var actionsHandler = [];
            for (var k in Actions){
                if (typeof Actions[k] === 'object' && Actions[k].state){
                    actionsHandler[k] = Actions[k]
                }
            }

            var handler = function () {
                var activeTools = [];
                for(var k in actionsHandler){
                    if ( Actions[k].state() ){
                        activeTools.push(k);
                    }
                }
                postAction({type: 'SELECTION_CHANGE', data: activeTools});
                return true;
            };

            var _handleTouchDT = null;
            var handleTouch = function (event){
                event.stopPropagation();
                _handleTouchDT && clearTimeout(_handleTouchDT);
                _handleTouchDT = setTimeout(function (){
                    handler();
                    saveSelection();
                }, 50);
            }
            addEventListener(content, 'touchcancel', handleTouch);
            addEventListener(content, 'mouseup', handleTouch);
            addEventListener(content, 'touchend', handleTouch);
            addEventListener(content, 'blur', function () {
                postAction({type: 'SELECTION_CHANGE', data: []});
            });
            addEventListener(content, 'focus', function () {
                postAction({type: 'CONTENT_FOCUSED'});
            });

            var message = function (event){
                var msgData = JSON.parse(event.data), action = Actions[msgData.type];
                if (action ){
                    if ( action[msgData.name]){
                        var flag = msgData.name === 'result';
                        flag && focusCurrent();
                        action[msgData.name](msgData.data);
                        flag && handler();
                    } else {
                        action(msgData.data);
                    }
                }
            };
            document.addEventListener("message", message , false);
            window.addEventListener("message", message , false);
            document.addEventListener('mouseup', function (event) {
                event.preventDefault();
                Actions.content.focus();
            });
            return settings.element;
        };

        editor = init({
            element: document.getElementById('editor'),
            defaultParagraphSeparator: 'div',
            onChange: function (){
                setTimeout(function(){
                    postAction({type: 'CONTENT_CHANGE', data: Actions.content.getHtml()});
                    postAction({type: 'CONTENT_CHANGE_MARKDOWN', data: Actions.content.getMarkdown()});
                }, 10);
            }
        })
    })({
        window: window.ReactNativeWebView || window.parent,
    });
</script>
</body>
</html>
`;
}

const HTML = createHTML();
export { HTML, createHTML };
