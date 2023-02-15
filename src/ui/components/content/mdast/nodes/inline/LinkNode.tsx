import type { Link as MdastLink } from 'mdast'

import Link from '#ui/components/common/link/Link'
import StaticPhrasingContentNode from '#ui/components/content/mdast/nodes/StaticPhrasingContentNode'

function LinkNode({ node: { children, url, title } }: LinkNodeProps) {
  const content = children.map((child, idx) => (
    <StaticPhrasingContentNode key={child?.data?.uuid ?? idx.toString()} node={child} />
  ))

  return (
    <Link to={url} title={title === null ? undefined : title}>
      {content}
    </Link>
  )
}

interface LinkNodeProps {
  node: MdastLink
}

export default LinkNode
