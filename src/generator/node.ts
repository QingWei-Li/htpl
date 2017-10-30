import { IASTIfCondition, INode } from '../parser/index';
import { listHelper } from './helper';

export class NodeGen {
  private hasFor: boolean;
  private ast: INode;

  constructor(ast: INode) {
    this.ast = ast;
  }

  public compile() {
    const code = this.createNode(this.ast);
    const helpers = [];

    if (this.hasFor) {
      helpers.push(listHelper);
    }

    return `with(this){${helpers.join()}return ${code}}`;
  }

  private createNode(node: INode) {
    if (node.for) {
      this.hasFor = true;
      return this.genFor(node);
    } else if (node.if) {
      return this.genIf(node.ifConditions.slice());
    } else {
      return this.genTag(node);
    }
  }

  private genFor(node: INode) {
    return `$list(${node.for}, function(${node.alias}${node.iterator1
      ? ',' + node.iterator1
      : ''}${node.iterator1 ? ',' + node.iterator2 : ''}){return ${this.genTag(
      node
    )}}).join(" ")`;
  }

  private genIf(conditions: IASTIfCondition[]) {
    if (!conditions.length) {
      return '""';
    }
    const condition = conditions.shift();

    if (condition.exp) {
      return `((${condition.exp})?${this.genTag(condition.block)}:${this.genIf(
        conditions
      )})`;
    } else {
      return this.genTag(condition.block);
    }
  }

  private genTag(node: INode) {
    if (node.type === 1) {
      let child = '""';
      if (Array.isArray(node.children)) {
        child = node.children.map(c => this.createNode(c)).join('+');
      }
      const { tag, attrs, isUnaryTag } = node;
      let attr = '';

      if (attrs) {
        attr = Object.keys(attrs)
          .map(a => `${a}=${attrs[a]}`)
          .join(' ');
        attr = attr && ' ' + attr;
      }

      return `"<${tag}${attr}>"+${child}` + (isUnaryTag ? '' : `+"</${tag}>"`);
    } else {
      return node.text;
    }
  }
}
