// TODO delete

import type { Element as HastElement } from 'hast'
import type { ReactNode } from 'react'

import Video from '#ui/components/content/video/Video'
import YouTubeVideo from '#ui/components/content/video/YouTubeVideo'

const componentMap = {
  video: Video,
  youtube: YouTubeVideo,
}

type ContainerDirectiveName = keyof typeof componentMap

const containerDirectiveName = Object.keys(componentMap) as ContainerDirectiveName[]

function isContainerDirectiveName(name: unknown): name is ContainerDirectiveName {
  return typeof name === 'string' && containerDirectiveName.includes(name as ContainerDirectiveName)
}

function LeafDirective({ children, id, node }: LeafDirectiveProps) {
  const name = node.properties?.name
  if (isContainerDirectiveName(name)) {
    const Component = componentMap[name]
    return (
      <Component id={id} nodeProps={node.properties ?? {}}>
        {children}
      </Component>
    )
  }
  return null
}

interface LeafDirectiveProps {
  children: ReactNode
  id?: string
  node: HastElement
}

export default LeafDirective
