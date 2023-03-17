import ExampleCard from '#ui/components/content/cards/ExampleCard'
import ExerciseCard from '#ui/components/content/cards/ExerciseCard'
import HintCard from '#ui/components/content/cards/HintCard'
import InfoCard from '#ui/components/content/cards/InfoCard'
import InputHintCard from '#ui/components/content/cards/InputHintCard'
import { isCardType } from '#ui/components/content/cards/types'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const containerMap = {
  example: ExampleCard,
  exercise: ExerciseCard,
  hint: HintCard,
  info: InfoCard,
  inputHint: InputHintCard,
}

// function DivNode({ children, name, type,  }: DivNodeProps) {
function DivNode({ children, node: { properties } }: MarkdownComponentProps<'div'>) {
  // console.log(`+++++++++++++++++ div`)
  // console.log(node.properties)

  if (properties) {
    const { name, type } = properties
    if (type === 'containerDirective' && isCardType(name)) {
      const ContainerComponent = containerMap[name]
      return <ContainerComponent>{children}</ContainerComponent>
    }
  }

  return <div>{children}</div>
}

// interface DivNodeProps extends MarkdownComponentProps<'div'> {
//   name: CardType
//   type: string
// }

export default DivNode
