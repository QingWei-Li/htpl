/*!
 * Fork from https://github.com/derbyjs/html-util
 * Original code by Nate Smith and Brian Noguchi, MIT Public License
 * https://github.com/derbyjs/html-util/blob/master/lib/index.js
 */
const startTag = /^<([^\s=\/!>]+)((?:\s+[^\s=\/>]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+)?)?)*)\s*(\/?)\s*>/,
  endTag = /^<\/([^\s=\/!>]+)[^>]*>/,
  comment = /^<!--([\s\S]*?)-->/,
  commentInside = /<!--[\s\S]*?-->/,
  other = /^<([\s\S]*?)>/,
  attr = /([^\s=]+)(?:\s*(=)\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+))?)?/g,
  rawTagsDefault = /^(style|script)$/i,
  unaryTag = /^(area|base|br|col|embed|frame|hr|img|input|isindex|keygen|link|meta|param|source|track|wbr)$/;

function no() {}

function matchEndDefault(tagName) {
  return new RegExp('</' + tagName, 'i');
}

function onStartTag(html, match, handler) {
  const attrs = {},
    tag = match[0],
    tagName = match[1],
    remainder = match[2],
    selfClosing = !!match[3] || unaryTag.test(tagName);
  html = html.slice(tag.length);

  remainder.replace(attr, (m, name, equals, attr0, attr1, attr2) => {
    attrs[name] = attr0 || attr1 || attr2 || (equals ? '' : true);
  });
  handler(tag, tagName, attrs, selfClosing, html);

  return html;
}

function onTag(html, match, handler) {
  const tag = match[0],
    tagName = match[1];
  html = html.slice(tag.length);

  handler(tag, tagName, html);

  return html;
}

function onText(html, index, isRawText, handler) {
  let text;
  if (~index) {
    text = html.slice(0, index);
    html = html.slice(index);
  } else {
    text = html;
    html = '';
  }

  if (text) {
    handler(text, isRawText, html);
  }

  return html;
}

function rawEnd(html, ending, offset = 0) {
  const index = html.search(ending),
    commentMatch = html.match(commentInside);
  let commentEnd;
  // Make sure that the ending condition isn't inside of an HTML comment
  if (commentMatch && commentMatch.index < index) {
    commentEnd = commentMatch.index + commentMatch[0].length;
    offset += commentEnd;
    html = html.slice(commentEnd);
    return rawEnd(html, ending, offset);
  }
  return index + offset;
}

export function parseHTML(html: string, options: any = {}) {
  const startHandler = options.start || no,
    endHandler = options.end || no,
    textHandler = options.text || no,
    commentHandler = options.comment || no,
    otherHandler = options.other || no,
    matchEnd = options.matchEnd || matchEndDefault,
    errorHandler = options.error,
    rawTags = options.rawTags || rawTagsDefault;
  let index, last, match, tagName, err;

  while (html) {
    if (html === last) {
      err = new Error('HTML parse error: ' + html);
      if (errorHandler) {
        errorHandler(err);
      } else {
        throw err;
      }
    }
    last = html;

    if (html[0] === '<') {
      if ((match = html.match(startTag))) {
        html = onStartTag(html, match, startHandler);

        tagName = match[1];
        if (rawTags.test(tagName)) {
          index = rawEnd(html, matchEnd(tagName));
          html = onText(html, index, true, textHandler);
        }
        continue;
      }

      if ((match = html.match(endTag))) {
        match[1] = match[1]; // tagName
        html = onTag(html, match, endHandler);
        continue;
      }

      if ((match = html.match(comment))) {
        html = onTag(html, match, commentHandler);
        continue;
      }

      if ((match = html.match(other))) {
        html = onTag(html, match, otherHandler);
        continue;
      }
    }

    index = html.indexOf('<');
    html = onText(html, index, false, textHandler);
  }
}
