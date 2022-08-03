import { type ReactNode } from 'react'

function Link({ href, children }: LinkProps) {
  return <a href={href}>{children}</a>
}

type LinkProps = {
  children: ReactNode
  href: string
}

export default Link
