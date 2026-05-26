import type { ComponentType, ReactNode } from 'react'
import { isHastMdxJsxTextSpanElement } from '@innodoc/content-parser/typeguards'
import type { HastMdxJsxTextSpanElement } from '@innodoc/content-parser/types'
import { TextQuestion } from '#exercises'
import type { HastComponentProps } from '#hast'

interface SpanComponentProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxTextSpanElement['properties']
}

type SpanComponent = ComponentType<SpanComponentProps>

const flowSpanComponentMap: Record<HastMdxJsxTextSpanElement['properties']['name'], SpanComponent> = {
  // questions
  TextQuestion,
}

function SpanNode({ children, id, node, ...other }: HastComponentProps<'span'>) {
  if (isHastMdxJsxTextSpanElement(node)) {
    // oxlint-disable-next-line @typescript-eslint/no-unused-vars
    const Component = flowSpanComponentMap[node.properties.name]

    // TODO: fix span node

    return null

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
