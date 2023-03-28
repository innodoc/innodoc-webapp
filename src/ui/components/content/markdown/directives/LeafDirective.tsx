import type { Element as HastElement } from 'hast'
import type { ReactNode } from 'react'

const componentMap = {}

type ContainerDirectiveName = keyof typeof componentMap

const containerDirectiveName = Object.keys(componentMap) as ContainerDirectiveName[]

function isContainerDirectiveName(name: unknown): name is ContainerDirectiveName {
  return typeof name === 'string' && containerDirectiveName.includes(name as ContainerDirectiveName)
}

function LeafDirective({ children, node }: LeafDirectiveProps) {
  const name = node.properties?.name
  if (isContainerDirectiveName(name)) {
    const Component = componentMap[name]
    return <Component>{children}</Component>
  }
  return null
}

interface LeafDirectiveProps {
  children: ReactNode
  node: HastElement
}

export default LeafDirective