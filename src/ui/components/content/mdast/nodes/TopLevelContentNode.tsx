import type { TopLevelContent } from 'mdast'

import { isBlockContent, isDefinitionContent } from '#ui/components/content/mdast/typeGuards'

import UnknownNode from './block/UnknownNode'
import BlockContentNode from './BlockContentNode'
import DefinitionContentNode from './DefinitionContentNode'

function TopLevelContentNode({ node }: TopLevelContentNodeProps) {
  if (isBlockContent(node)) {
    return <BlockContentNode node={node} />
  }

  if (isDefinitionContent(node)) {
    return <DefinitionContentNode node={node} />
  }

  return <UnknownNode node={node} />
}

type TopLevelContentNodeProps = {
  node: TopLevelContent
}

export default TopLevelContentNode
