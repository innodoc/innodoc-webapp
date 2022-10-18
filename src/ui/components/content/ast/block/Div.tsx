import type { AttrList, Block } from 'pandoc-filter'

import type { ContentComponentProps } from '@/ui/components/content/ast/types'
import ExampleCard from '@/ui/components/content/cards/ExampleCard'
import ExerciseCard from '@/ui/components/content/cards/ExerciseCard'
import Hint from '@/ui/components/content/cards/Hint'
import InfoCard from '@/ui/components/content/cards/InfoCard'
import InputHint from '@/ui/components/content/cards/InputHint'
import Figure from '@/ui/components/content/misc/Figure'
import { getClassNameToComponentMapper } from '@/utils/content'

const mapClassNameToComponent = getClassNameToComponentMapper<DivProps>({
  example: ExampleCard,
  exercise: ExerciseCard,
  // 'exercise-roulette': ExerciseRouletteCard,
  figure: Figure,
  hint: Hint,
  info: InfoCard,
  'hint-text': InputHint,
  // row: Row,
})

function Div({ content: [[id, classNames, attributes], blocks] }: ContentComponentProps<'Div'>) {
  const Component = mapClassNameToComponent(classNames)

  if (Component) {
    return <Component attributes={attributes} content={blocks} id={id} />
  }

  return null // TODO: show error on unhandled
}

export type DivProps = {
  attributes: AttrList
  content: Block[]
  id?: string
}

export default Div
