import PropTypes from 'prop-types'

import { getClassNameToComponentMapper } from '@innodoc/misc/utils'

import ExampleCard from '../cards/ExampleCard.jsx'
import InfoCard from '../cards/InfoCard.jsx'
import InputHintCard from '../cards/InputHintCard.jsx'
import ExerciseCard from '../exercises/ExerciseCard.jsx'
import ExerciseRouletteCard from '../exercises/ExerciseRouletteCard.jsx'
import Hint from '../Hint/Hint.jsx'

import Figure from './Figure.jsx'
import Row from './Row.jsx'
import UnknownType from './UnknownType.jsx'

const mapClassNameToComponent = getClassNameToComponentMapper({
  exercise: ExerciseCard,
  'exercise-roulette': ExerciseRouletteCard,
  info: InfoCard,
  example: ExampleCard,
  figure: Figure,
  hint: Hint,
  'hint-text': InputHintCard,
  row: Row,
})

function Div({ data }) {
  const [[id, classNames, attributes], content] = data
  const Component = mapClassNameToComponent(classNames)
  if (Component) {
    return <Component id={id} content={content} attributes={attributes} />
  }
  if (process.env.NODE_ENV !== 'production') {
    return <UnknownType name="Div" data={data} />
  }
  return null
}

Div.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Div
