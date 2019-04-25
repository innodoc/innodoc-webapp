import React from 'react'
import PropTypes from 'prop-types'

import { getClassNameToComponentMapper } from '../../../../lib/util'
import ExerciseCard from '../cards/ExerciseCard'
import InfoCard from '../cards/InfoCard'
import ExampleCard from '../cards/ExampleCard'
import SolutionHint from '../SolutionHint'
import InputHint from '../cards/InputHint'
import TestCard from '../cards/TestCard'
import QuestionGroup from '../questions/QuestionGroup'
import VerifyInfoButton from '../questions/VerifyInfoButton'
import Figure from './Figure'
import UnknownType from './UnknownType'

const mapClassNameToComponent = getClassNameToComponentMapper({
  exercise: ExerciseCard,
  info: InfoCard,
  example: ExampleCard,
  figure: Figure,
  hint: SolutionHint,
  'hint-text': InputHint,
  test: TestCard,
  'question-group': QuestionGroup, // TODO: remove?
  'verify-input-button': VerifyInfoButton,
})

const Div = ({ data }) => {
  const [[id, classNames], content] = data
  const Component = mapClassNameToComponent(classNames)
  if (Component) {
    return <Component id={id} content={content} />
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
