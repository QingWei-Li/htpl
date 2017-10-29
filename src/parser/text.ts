const TAG_RE = /\{\{((?:.|\n)+?)\}\}/g;

export function parseText(text: string): string | void {
  if (!TAG_RE.test(text)) {
    return JSON.stringify(text);
  }

  const tokens = [];
  let lastIndex = (TAG_RE.lastIndex = 0);
  let match, index;
  while ((match = TAG_RE.exec(text))) {
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
