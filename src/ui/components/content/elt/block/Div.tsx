import type { AttrList, Block } from 'pandoc-filter'

import ExampleCard from '@/ui/components/content/cards/ExampleCard'
import InfoCard from '@/ui/components/content/cards/InfoCard'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'
import Figure from '@/ui/components/content/misc/Figure'
import { getClassNameToComponentMapper } from '@/utils/content'

const mapClassNameToComponent = getClassNameToComponentMapper<DivProps>({
  // exercise: ExerciseCard,
  // 'exercise-roulette': ExerciseRouletteCard,
  info: InfoCard,
  example: ExampleCard,
  figure: Figure,
  // hint: Hint,
  // 'hint-text': InputHint,
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
