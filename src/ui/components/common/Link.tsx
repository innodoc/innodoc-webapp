import { useContext } from 'react'

import PageContext from '@/ui/contexts/PageContext'

export { Link }

function Link(props: { href?: string; className?: string; children: React.ReactNode }) {
  const { urlPathname } = useContext(PageContext)
  const className = [props.className, urlPathname === props.href && 'is-active']
    .filter(Boolean)
    .join(' ')
  return <a {...props} className={className} />
}
