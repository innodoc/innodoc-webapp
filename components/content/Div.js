import React from 'react'
import PropTypes from 'prop-types'

import ExercisePanel from './cards/ExercisePanel'
import InfoPanel from './cards/InfoPanel'
import ExamplePanel from './cards/ExamplePanel'
import SolutionHint from './messages/SolutionHint'
import InputHint from './messages/InputHint'
import UnknownType from './UnknownType'

const classNameComponentMap = {
  exercise: ExercisePanel,
  info: InfoPanel,
  example: ExamplePanel,
  hint: SolutionHint,
  'hint-text': InputHint,
}

const mapClassNameToComponent = (divClasses) => {
  const classNames = Object.keys(classNameComponentMap)
  for (let i = 0; i < classNames.length; i += 1) {
    const className = classNames[i]
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
