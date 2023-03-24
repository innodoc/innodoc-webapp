import GeneralLink from '#ui/components/common/link/GeneralLink'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function ANode({ href, children, title }: MarkdownComponentProps<'a'>) {
  if (!href) {
    return <>{children}</>
  }

  return (
    <GeneralLink to={href} title={title}>
      {children}
    </GeneralLink>
  )
}

export default ANode
