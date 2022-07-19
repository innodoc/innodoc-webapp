import PropTypes from 'prop-types'

import { util } from '@innodoc/misc'

import ExerciseCard from '../exercises/ExerciseCard'
import ExerciseRouletteCard from '../exercises/ExerciseRouletteCard'
import InfoCard from '../cards/InfoCard'
import ExampleCard from '../cards/ExampleCard'
import Hint from '../Hint'
import InputHint from '../cards/InputHint'
import Figure from './Figure'
import Row from './Row'
import UnknownType from './UnknownType'

const mapClassNameToComponent = util.getClassNameToComponentMapper({
  exercise: ExerciseCard,
  'exercise-roulette': ExerciseRouletteCard,
  info: InfoCard,
  example: ExampleCard,
  figure: Figure,
  hint: Hint,
  'hint-text': InputHint,
  row: Row,
})

const Div = ({ data }) => {
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
