import type { PhrasingContent } from 'mdast'

import {
  isLink,
  isLinkReference,
  isStaticPhrasingContent,
} from '#ui/components/content/mdast/typeGuards'

import LinkNode from './inline/LinkNode'
import LinkReferenceNode from './inline/LinkReferenceNode'
import UnknownNode from './inline/UnknownNode'
import StaticPhrasingContentNode from './StaticPhrasingContentNode'

function PhrasingContentNode({ node }: PhrasingContentNodeProps) {
  if (isStaticPhrasingContent(node)) {
    return <StaticPhrasingContentNode node={node} />
  }

  if (isLink(node)) {
    return <LinkNode node={node} />
  }

  if (isLinkReference(node)) {
    return <LinkReferenceNode node={node} />
  }

  return <UnknownNode node={node} />
}

interface PhrasingContentNodeProps {
  node: PhrasingContent
}

export default PhrasingContentNode
