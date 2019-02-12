import React from 'react'
import PropTypes from 'prop-types'

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

const classNameComponentMap = {
  exercise: ExerciseCard,
  info: InfoCard,
  example: ExampleCard,
  figure: Figure,
  hint: SolutionHint,
  'hint-text': InputHint,
  test: TestCard,
  'question-group': QuestionGroup,
  'verify-input-button': VerifyInfoButton,
}

const classNameComponentMapNames = Object.keys(classNameComponentMap)

const mapClassNameToComponent = (divClasses) => {
  for (let i = 0; i < classNameComponentMapNames.length; i += 1) {
    const className = classNameComponentMapNames[i]
    if (divClasses.includes(className)) {
      return classNameComponentMap[className]
    }
  }
  return null
}

const Div = ({ data }) => {
  const [[id, classes], content] = data

  const Component = mapClassNameToComponent(classes)

  return Component
    ? <Component id={id} content={content} />
    : <UnknownType name="Div" data={data} />
}

Div.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export { classNameComponentMap } // for testing
export default Div
