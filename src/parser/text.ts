/* @flow */

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

export function parseText(text: string): string | void {
  const tagRE = defaultTagRE;

  if (!tagRE.test(text)) {
    return JSON.stringify(text);
  }

  const tokens = [];
  let lastIndex = (tagRE.lastIndex = 0);
  let match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    const exp = match[1].trim();
    tokens.push(exp);
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }

  return tokens.join('+');
}
