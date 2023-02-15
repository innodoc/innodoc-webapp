import type { BlockContent } from 'mdast'

import {
  isBlockquote,
  isCode,
  isContainerDirective,
  isHeading,
  isHTML,
  isLeafDirective,
  isList,
  isParagraph,
  isTable,
  isThematicBreak,
} from '#ui/components/content/mdast/typeGuards'

import BlockquoteNode from './block/BlockquoteNode'
import CodeNode from './block/CodeNode'
import ContainerDirectiveNode from './block/ContainerDirectiveNode'
import HeadingNode from './block/HeadingNode'
import HTMLNode from './block/HTMLNode'
import LeafDirectiveNode from './block/LeafDirectiveNode'
import ListNode from './block/ListNode'
import ParagraphNode from './block/ParagraphNode'
import TableNode from './block/TableNode'
import ThematicBreakNode from './block/ThematicBreakNode'
import UnknownNode from './block/UnknownNode'

function BlockContentNode({ node }: BlockContentNodeProps) {
  if (isParagraph(node)) {
    return <ParagraphNode node={node} />
  }

  if (isHeading(node)) {
    return <HeadingNode node={node} />
  }

  if (isThematicBreak(node)) {
    return <ThematicBreakNode node={node} />
  }

  if (isBlockquote(node)) {
    return <BlockquoteNode node={node} />
  }

  if (isList(node)) {
    return <ListNode node={node} />
  }

  if (isTable(node)) {
    return <TableNode node={node} />
  }

  if (isHTML(node)) {
    return <HTMLNode node={node} />
  }

  if (isCode(node)) {
    return <CodeNode node={node} />
  }

  if (isLeafDirective(node)) {
    return <LeafDirectiveNode node={node} />
  }

  if (isContainerDirective(node)) {
    return <ContainerDirectiveNode node={node} />
  }

  return <UnknownNode node={node} />
}

interface BlockContentNodeProps {
  node: BlockContent
}

export default BlockContentNode
