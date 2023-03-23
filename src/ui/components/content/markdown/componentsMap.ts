import BlockquoteNode from './components/block/BlockquoteNode'
import DivNode from './components/block/DivNode/DivNode'
import HeadingNode from './components/block/HeadingNode'
import HrNode from './components/block/HrNode'
import OlNode from './components/block/OlNode'
import PNode from './components/block/PNode'
import PreNode from './components/block/PreNode'
import UlNode from './components/block/UlNode'
import ANode from './components/inline/ANode'
import CodeNode from './components/inline/CodeNode'
import SpanNode from './components/inline/SpanNode/SpanNode'

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
