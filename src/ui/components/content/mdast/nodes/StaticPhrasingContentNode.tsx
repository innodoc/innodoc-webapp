import type { StaticPhrasingContent } from 'mdast'

import {
  isBreak,
  isDelete,
  isEmphasis,
  isFootnote,
  isFootnoteReference,
  isHTML,
  isImage,
  isImageReference,
  isInlineCode,
  isStrong,
  isText,
} from '#ui/components/content/mdast/typeGuards'

import BreakNode from './inline/BreakNode'
import DeleteNode from './inline/DeleteNode'
import EmphasisNode from './inline/EmphasisNode'
import FootnoteNode from './inline/FootnoteNode'
import FootnoteReferenceNode from './inline/FootnoteReferenceNode'
import HTMLNode from './inline/HTMLNode'
import ImageNode from './inline/ImageNode'
import ImageReferenceNode from './inline/ImageReferenceNode'
import InlineCodeNode from './inline/InlineCodeNode'
import StrongNode from './inline/StrongNode'
import TextNode from './inline/TextNode'
import UnknownNode from './inline/UnknownNode'

function StaticPhrasingContentNode({ node }: StaticPhrasingContentNodeProps) {
  if (isText(node)) {
    return <TextNode node={node} />
  }

  if (isEmphasis(node)) {
    return <EmphasisNode node={node} />
  }

  if (isStrong(node)) {
    return <StrongNode node={node} />
  }

  if (isDelete(node)) {
    return <DeleteNode node={node} />
  }

  if (isHTML(node)) {
    return <HTMLNode node={node} />
  }

  if (isInlineCode(node)) {
    return <InlineCodeNode node={node} />
  }

  if (isBreak(node)) {
    return <BreakNode />
  }

  if (isImage(node)) {
    return <ImageNode node={node} />
  }

  if (isImageReference(node)) {
    return <ImageReferenceNode node={node} />
  }

  if (isFootnote(node)) {
    return <FootnoteNode node={node} />
  }

  if (isFootnoteReference(node)) {
    return <FootnoteReferenceNode node={node} />
  }

  return <UnknownNode node={node} />
}

interface StaticPhrasingContentNodeProps {
  node: StaticPhrasingContent
}

export default StaticPhrasingContentNode
