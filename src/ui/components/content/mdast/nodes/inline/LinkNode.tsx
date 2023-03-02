import type { Link as MdastLink } from 'mdast'

import GeneralLink from '#ui/components/common/link/GeneralLink'
import StaticPhrasingContentNode from '#ui/components/content/mdast/nodes/StaticPhrasingContentNode'

function LinkNode({ node: { children, url, title } }: LinkNodeProps) {
  const content = children.map((child, idx) => (
    <StaticPhrasingContentNode key={child?.data?.id ?? idx.toString()} node={child} />
  ))

  return (
    <GeneralLink to={url} title={title === null ? undefined : title}>
      {content}
    </GeneralLink>
  )
}

interface LinkNodeProps {
  node: MdastLink
}

export default LinkNode
