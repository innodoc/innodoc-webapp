import type { DefinitionContent } from 'mdast'

import UnknownNode from './block/UnknownNode'

function DefinitionContentNode({ node }: DefinitionContentNodeProps) {
  // TODO

  // if (isDefinition(node)) {
  //   return <Definition node={node} />
  // }

  // if (isFootnoteDefinition(node)) {
  //   return <FootnoteDefinition node={node} />
  // }

  return <UnknownNode node={node} />
}

type DefinitionContentNodeProps = {
  node: DefinitionContent
}

export default DefinitionContentNode
