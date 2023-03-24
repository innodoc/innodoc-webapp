import type { Element as HastElement } from 'hast'
import type { ReactNode } from 'react'

import QuestionCheckbox from '#ui/components/exercises/questions/QuestionCheckbox'
import QuestionText from '#ui/components/exercises/questions/QuestionText'

const componentMap = {
  'question-checkbox': QuestionCheckbox,
  'question-text': QuestionText,
}

type TextDirectiveName = keyof typeof componentMap

const textDirectiveName = Object.keys(componentMap) as TextDirectiveName[]

function isTextDirectiveName(name: unknown): name is TextDirectiveName {
  return typeof name === 'string' && textDirectiveName.includes(name as TextDirectiveName)
}

function TextDirective({ children, node }: TextDirectiveProps) {
  const name = node.properties?.name
  if (isTextDirectiveName(name)) {
    const Component = componentMap[name]
    return <Component {...node.properties}>{children}</Component>
  }
  return null
}

interface TextDirectiveProps {
  children: ReactNode
  node: HastElement
}

export default TextDirective
