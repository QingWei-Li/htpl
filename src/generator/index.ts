import { INode } from '../parser/index';
import { NodeGen } from './node';

export function codeGen(ast: INode) {
  const code = new NodeGen(ast).compile();

  return {
    render: data => new Function(code).call(data)
  };
}
