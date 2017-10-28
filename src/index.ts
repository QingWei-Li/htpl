import { createAST, IOptions } from './parser';
import { compiler } from './compiler';

export default function htpl(html: string, opts: IOptions) {
  const ast = createAST(html, opts);
  const code = compiler(ast);

  return {
    ast,
    render: code.render
  };
}
