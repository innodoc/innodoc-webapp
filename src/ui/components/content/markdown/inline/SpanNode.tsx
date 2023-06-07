import { isMdxJsxTextSpanElement } from '#markdown/typeGuards'
import TextQuestion from '#ui/components/content/exercises/questions/TextQuestion'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const flowSpanComponentMap = {
  // questions
  TextQuestion,
}

export type MdxJsxTextSpanElementName = keyof typeof flowSpanComponentMap

function SpanNode({ children, id, node, ...other }: MarkdownComponentProps<'span'>) {
  // console.log('SpanNode', node.properties?.type, node.properties?.name)

  if (isMdxJsxTextSpanElement(node)) {
    const Component = flowSpanComponentMap[node.properties.name]
    if (!Component) {
      return null
    }

    return (
      <Component id={id} nodeProps={node.properties}>
        {children}
      </Component>
    )
  }

  // Pass props for KaTeX nodes
  return <span {...other}>{children}</span>
}

export default SpanNode
