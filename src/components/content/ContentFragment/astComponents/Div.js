import React from 'react'
import PropTypes from 'prop-types'

import ExerciseCard from '../cards/ExerciseCard'
import ExercisesCard from '../cards/ExercisesCard'
import InfoCard from '../cards/InfoCard'
import ExampleCard from '../cards/ExampleCard'
import SolutionHint from '../messages/SolutionHint'
import InputHint from '../messages/InputHint'
import TestCard from '../cards/TestCard'
import QuestionGroup from '../questions/QuestionGroup'
import VerifyInfoButton from '../questions/VerifyInfoButton'
import UnknownType from './UnknownType'

const classNameComponentMap = {
  exercises: ExercisesCard,
  exercise: ExerciseCard,
  info: InfoCard,
  example: ExampleCard,
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

export default Div
