import React from 'react'
import PropTypes from 'prop-types'

import ExercisePanel from './cards/ExercisePanel'
import InfoPanel from './cards/InfoPanel'
import ExamplePanel from './cards/ExamplePanel'
import SolutionHint from './messages/SolutionHint'
import InputHint from './messages/InputHint'
import UnknownType from './UnknownType'

const Div = ({ data }) => {
  const [[id, classes], content] = data

  if (classes.includes('exercise')) {
    return <ExercisePanel id={id} content={content} />
  } else if (classes.includes('info')) {
    return <InfoPanel id={id} content={content} />
  } else if (classes.includes('example')) {
    return <ExamplePanel id={id} content={content} />
  } else if (classes.includes('hint')) {
    return <SolutionHint id={id} content={content} />
  } else if (classes.includes('hint-text')) {
    return <InputHint id={id} content={content} />
  }

  return <UnknownType name="Div" data={data} />
}

Div.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Div
