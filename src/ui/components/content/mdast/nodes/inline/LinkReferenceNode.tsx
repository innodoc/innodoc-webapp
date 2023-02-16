import type { LinkReference } from 'mdast'
import { useContext } from 'react'

import Link from '#ui/components/common/link/Link'
import IndexContext from '#ui/components/content/mdast/IndexContext'
import StaticPhrasingContentNode from '#ui/components/content/mdast/nodes/StaticPhrasingContentNode'

function LinkReferenceNode({ node }: LinkReferenceNodeProps) {
  const getEntry = useContext(IndexContext)
  const definition = getEntry('definition', node.identifier)

  const content = node.children.map((child, idx) => (
    <StaticPhrasingContentNode key={child?.data?.id ?? idx.toString()} node={child} />
  ))

  if (definition) {
    return (
      <Link to={definition.url} title={definition.title === null ? undefined : definition.title}>
        {content}
      </Link>
    )
  }

  return content
}

interface LinkReferenceNodeProps {
  node: LinkReference
}

export default LinkReferenceNode
