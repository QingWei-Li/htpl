import { codeGen } from './generator';
import { createAST, IOptions } from './parser';

export default function htpl(html: string, opts: IOptions) {
  const ast = createAST(html, opts);
  const code = codeGen(ast);

  return {
    ast,
    render: code.render
  };
}
