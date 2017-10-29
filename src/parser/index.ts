import { parseHTML } from './html';

const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

export interface IOptions {
  minimize?: boolean;
  prefix?: string;
}

export interface IASTIfCondition {
  exp?: string;
  block: INode;
}

export interface INode {
  children?: INode[];
  tag?: string;
  text?: string;
  type: 1 | 2 | 3;
  attrs?: {};
  expression?: string;

  pre?: true;

  if?: string;
  elseif?: string;
  else?: boolean;
  ifConditions?: IASTIfCondition[];

  for?: string;
  key?: string;
  alias?: string;
  iterator1?: string;
  iterator2?: string;

  isUnaryTag?: boolean;
}

function getAndRemoveAttr(el: INode, key: string) {
  const val = el.attrs[key];
  if (val) {
    delete el.attrs[key];
  }
  return val;
}

function processFor(node: INode, prefix) {
  let exp;
  if ((exp = getAndRemoveAttr(node, prefix + 'for'))) {
    const inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      throw Error(`Invalid ${prefix}for expression: ${exp}`);
    }
    node.for = inMatch[2].trim();
    const alias = inMatch[1].trim();
    const iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      node.alias = iteratorMatch[1].trim();
      node.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        node.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      node.alias = alias;
    }
  }
}

function processIf(node: INode, prefix) {
  const exp = getAndRemoveAttr(node, prefix + 'if');
  if (exp) {
    node.if = exp;
    addIfCondition(node, {
      block: node,
      exp
    });
  } else {
    if (getAndRemoveAttr(node, prefix + 'else') != null) {
      node.else = true;
    }
    const elseif = getAndRemoveAttr(node, prefix + 'else-if');
    if (elseif) {
      node.elseif = elseif;
    }
  }
}

function addIfCondition(el: INode, condition: IASTIfCondition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

export function createAST(html: string = '', opts: IOptions = {}) {
  opts.minimize = opts.minimize !== false;
  const prefix = (opts.prefix = opts.prefix || 'h-');

  const stack = [];
  let ast;
  let curParent: INode = {
    children: [],
    type: 1
  };

  parseHTML(html.trim(), {
    start(raw, tag, attrs, isUnaryTag) {
      const node: INode = {
        attrs,
        isUnaryTag,
        tag,
        type: 1
      };

      processFor(node, prefix);
      processIf(node, prefix);

      if (!ast) {
        ast = node;
      } else if (curParent.type === 1) {
        curParent.children.push(node);
      }

      if (!isUnaryTag) {
        node.children = [];
        curParent = node;
        stack.push(node);
      }
    },

    end(raw, tag) {
      // pop stack
      stack.length -= 1;
      curParent = stack[stack.length - 1];
    },

    text(text) {
      if (curParent.type === 1) {
        curParent.children.push({
          text,
          type: 2
        } as INode);
      }
    },

    comment(text) {
      if (curParent.type === 1) {
        curParent.children.push({
          text,
          type: 3
        } as INode);
      }
    }
  });

  return ast;
}
