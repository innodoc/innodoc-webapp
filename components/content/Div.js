import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ContentFragment from '../ContentFragment'
import Exercise from './panels/Exercise'
import InfoPanel from './panels/InfoPanel'
import ExamplePanel from './panels/ExamplePanel'
import ExerciseHint from './panels/ExerciseHint'

const Div = ({ data }) => {
  const [[id, classes], content] = data

  if (classes.includes('exercise')) {
    return (
      <Exercise id={id} content={content} />
    )
  } else if (classes.includes('info')) {
    return (
      <InfoPanel id={id} content={content} />
    )
  } else if (classes.includes('example')) {
    return (
      <ExamplePanel id={id} content={content} />
    )
  } else if (classes.includes('hint')) {
    return (
      <ExerciseHint id={id} content={content} />
    )
  }

  return (
    <div id={id} className={classNames(classes.concat(['panel']))}>
      <ContentFragment content={content} />
    </div>
  )
}

Div.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Div
