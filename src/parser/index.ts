import { parseHTML } from './html';

export interface IOptions {
  minimize?: boolean;
}

export interface INode {
  children?: INode[];
  tag?: string;
  text?: string;
  type: 1 | 2 | 3;
  attrs?: {};
  expression?: string;
}

export function createAST(html: string = '', opts: IOptions = {}) {
  opts.minimize = opts.minimize !== false;
  const stack = [];
  let ast;
  let curParent: INode = {
    children: [],
    type: 1
  };

  parseHTML(html.trim(), {
    start(raw, tag, attrs, selfClosing) {
      const node: INode = {
        attrs,
        tag,
        type: 1
      };

      if (!ast) {
        node.children = [];
        curParent = ast = node;
        return;
      }

      if (curParent.type === 1) {
        curParent.children.push(node);
      }

      if (!selfClosing) {
        node.children = [];
        curParent = node;
        stack.push(node);
      }
    },

    end(raw, tag) {
      curParent = stack.pop();
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

  console.log(JSON.stringify(ast, null, ' '));
  return ast;
}
