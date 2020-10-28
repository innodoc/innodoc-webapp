import React from 'react'
import PropTypes from 'prop-types'

import { getClassNameToComponentMapper } from '@innodoc/client-misc/src/util'

import ExerciseCard from '../exercises/ExerciseCard'
import ExerciseRouletteCard from '../exercises/ExerciseRouletteCard'
import InfoCard from '../cards/InfoCard'
import ExampleCard from '../cards/ExampleCard'
import Hint from '../Hint'
import InputHint from '../cards/InputHint'
import TestCard from '../cards/TestCard'
import QuestionGroup from '../exercises/questions/QuestionGroup'
import VerifyInfoButton from '../exercises/questions/VerifyInfoButton'
import Figure from './Figure'
import Row from './Row'
import UnknownType from './UnknownType'

const mapClassNameToComponent = getClassNameToComponentMapper({
  exercise: ExerciseCard,
  'exercise-roulette': ExerciseRouletteCard,
  info: InfoCard,
  example: ExampleCard,
  figure: Figure,
  hint: Hint,
  'hint-text': InputHint,
  row: Row,
  test: TestCard,
  'question-group': QuestionGroup, // TODO: remove?
  'verify-input-button': VerifyInfoButton,
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
