// TODO delete

import type { Element as HastElement } from 'hast'
import type { ReactNode } from 'react'

// import QuestionCheckbox from '#ui/components/content/exercises/questions/QuestionCheckbox'
// import QuestionText from '#ui/components/content/exercises/questions/QuestionText'

const componentMap = {
  // 'question-checkbox': QuestionCheckbox,
  // 'question-text': QuestionText,
}

type TextDirectiveName = keyof typeof componentMap

const textDirectiveName = Object.keys(componentMap) as TextDirectiveName[]

function isTextDirectiveName(name: unknown): name is TextDirectiveName {
  return typeof name === 'string' && textDirectiveName.includes(name as TextDirectiveName)
}

function TextDirective({ children, id, node }: TextDirectiveProps) {
  const name = node.properties?.name
  if (isTextDirectiveName(name)) {
    const Component = componentMap[name]
    return (
      <Component id={id} {...node.properties}>
        {children}
      </Component>
    )
  }
  return null
}

interface TextDirectiveProps {
  children: ReactNode
  id?: string
  node: HastElement
}

export default TextDirective
