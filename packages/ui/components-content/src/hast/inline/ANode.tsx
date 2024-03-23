import { ContentLink } from '@innodoc/components-common/links'
import type { HastComponentProps } from '#hast'

function ANode({ href, children, title }: HastComponentProps<'a'>) {
  if (!href) {
    return <>{children}</>
  }

  const [to, hash] = href.split('#')

  if (to) {
    return (
      <ContentLink hash={hash} to={to} title={title}>
        {children}
      </ContentLink>
    )
  }

  return null
}

export default ANode
