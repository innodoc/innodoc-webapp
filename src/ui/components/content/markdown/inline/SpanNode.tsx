import { isHastMdxJsxTextSpanElement } from '#types/markdown/typeGuardsCustomHast'
import TextQuestion from '#ui/components/content/exercises/questions/TextQuestion'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const flowSpanComponentMap = {
  // questions
  TextQuestion,
}

export type HastMdxJsxTextSpanElementName = keyof typeof flowSpanComponentMap

function SpanNode({ children, id, node, ...other }: MarkdownComponentProps<'span'>) {
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
