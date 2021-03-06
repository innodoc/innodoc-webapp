import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { childrenType } from '@innodoc/client-misc/src/propTypes'
import { addQuestion, questionAnswered } from '@innodoc/client-store/src/actions/question'

import ExerciseContext from './ExerciseContext'

// All questions inside an ExerciseCard are connected using this
// Context.Provider.
const ExerciseProvider = ({
  children,
  exercise: { isAnswered, isCorrect, id: globalExId },
  setShowResult,
  showResult,
}) => {
  const dispatch = useDispatch()

  // Register a question in the store
  const addQuestionWrapper = useCallback(
    (qId, points) => dispatch(addQuestion(globalExId, qId, points)),
    [dispatch, globalExId]
  )

  const value = {
    addQuestion: addQuestionWrapper,
    isAnswered,
    isCorrect,
    dispatchAnswer: (qId, answer, attrs) => {
      setShowResult(false)
      dispatch(questionAnswered(qId, answer, attrs))
    },
    showResult,
  }
  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>
}

ExerciseProvider.propTypes = {
  children: childrenType.isRequired,
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isAnswered: PropTypes.bool.isRequired,
    isCorrect: PropTypes.bool.isRequired,
  }).isRequired,
  setShowResult: PropTypes.func.isRequired,
  showResult: PropTypes.bool.isRequired,
}

export default ExerciseProvider
