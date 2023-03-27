import ContentLink from '#ui/components/content/ContentLink'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function ANode({ href, children, title }: MarkdownComponentProps<'a'>) {
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
