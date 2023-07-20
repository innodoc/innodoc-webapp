import type { HastComponentProps } from '#components/content/hast'
import { ContentLink } from '#components/content/misc'

function ANode({ href, children, title }: HastComponentProps<'a'>) {
  if (!href) {
    return <>{children}</>
  }

  const [to, hash] = href.split('#')

  return (
    <ContentLink hash={hash} to={to} title={title}>
      {children}
    </ContentLink>
  )
}

export default ANode
