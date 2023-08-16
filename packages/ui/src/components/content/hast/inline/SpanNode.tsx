import type { HastMdxJsxTextSpanElement } from '@innodoc/markdown/types'
import type { ComponentType, ReactNode } from 'react'

import { isHastMdxJsxTextSpanElement } from '@innodoc/markdown/type-guards'

import { TextQuestion } from '#components/content/exercises'
import type { HastComponentProps } from '#components/content/hast'

interface SpanComponentProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxTextSpanElement['properties']
}

type SpanComponent = ComponentType<SpanComponentProps>

const flowSpanComponentMap: Record<HastMdxJsxTextSpanElement['properties']['name'], SpanComponent> =
  {
    // questions
    TextQuestion,
  }

function SpanNode({ children, id, node, ...other }: HastComponentProps<'span'>) {
  if (isHastMdxJsxTextSpanElement(node)) {
    const Component = flowSpanComponentMap[node.properties.name]
    if (!Component) {
      return null
    }

    // return (
    //   <Component id={id} nodeProps={node.properties}>
    //     {children}
    //   </Component>
    // )
  }

  // Pass props for KaTeX nodes
  return <span {...other}>{children}</span>
}

export default SpanNode
