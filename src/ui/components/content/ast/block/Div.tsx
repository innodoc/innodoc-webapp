import clsx from 'clsx'
import type { AttrList, Block } from 'pandoc-filter'

import ContentTree from '@/ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/ast/types'
import ExampleCard from '@/ui/components/content/cards/ExampleCard'
import ExerciseCard from '@/ui/components/content/cards/ExerciseCard'
import Hint from '@/ui/components/content/cards/Hint'
import InfoCard from '@/ui/components/content/cards/InfoCard'
import InputHint from '@/ui/components/content/cards/InputHint'
import Figure from '@/ui/components/content/misc/Figure'
import { attributesToObject, getClassNameToComponentMapper } from '@/utils/content'

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

  if (Component !== undefined) {
    return <Component attributes={attributes} content={blocks} id={id} />
  }

  // Regular div
  const attrs = attributesToObject(attributes)
  return (
    <div id={id} className={clsx(classNames)} {...attrs}>
      <ContentTree content={blocks} />
    </div>
  )
}

export type DivProps = {
  attributes: AttrList
  content: Block[]
  id?: string
}

export default Div
