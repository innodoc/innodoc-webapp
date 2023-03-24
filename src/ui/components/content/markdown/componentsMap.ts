import BlockquoteNode from './block/BlockquoteNode'
import DivNode from './block/DivNode'
import HeadingNode from './block/HeadingNode'
import HrNode from './block/HrNode'
import OlNode from './block/OlNode'
import PNode from './block/PNode'
import PreNode from './block/PreNode'
import UlNode from './block/UlNode'
import ANode from './inline/ANode'
import CodeNode from './inline/CodeNode'
import SpanNode from './inline/SpanNode'

// TODO
// block:
// - table
// - image
// - definition list?
// - footnotes?
// inline:
// - textDirective

const componentsMap = {
  // block
  blockquote: BlockquoteNode,
  div: DivNode,
  h1: HeadingNode,
  h2: HeadingNode,
  h3: HeadingNode,
  h4: HeadingNode,
  h5: HeadingNode,
  h6: HeadingNode,
  hr: HrNode,
  ol: OlNode,
  p: PNode,
  pre: PreNode,
  ul: UlNode,

  // inline
  a: ANode,
  code: CodeNode,
  span: SpanNode,
}

export default componentsMap
