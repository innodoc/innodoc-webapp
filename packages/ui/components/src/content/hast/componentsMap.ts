import type { Components } from 'hast-util-to-jsx-runtime'

import BlockquoteNode from './block/BlockquoteNode.js'
import DivNode from './block/DivNode.js'
import HeadingNode from './block/HeadingNode.js'
import HrNode from './block/HrNode.js'
import OlNode from './block/OlNode.js'
import PNode from './block/PNode.js'
import PreNode from './block/PreNode.js'
import TableNode from './block/table/TableNode.js'
import TBodyNode from './block/table/TBodyNode.js'
import TdNode from './block/table/TdNode.js'
import ThNode from './block/table/ThNode.js'
import TrNode from './block/table/TrNode.js'
import UlNode from './block/UlNode.js'
import ANode from './inline/ANode.js'
import CodeNode from './inline/CodeNode.js'
import SpanNode from './inline/SpanNode.js'

// TODO
// block:
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
  table: TableNode,
  tbody: TBodyNode,
  td: TdNode,
  th: ThNode,
  tr: TrNode,
  ul: UlNode,

  // inline
  a: ANode,
  code: CodeNode,
  span: SpanNode,
} as Partial<Components>

export default componentsMap
