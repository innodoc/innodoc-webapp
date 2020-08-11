import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { childrenType } from '@innodoc/client-misc/src/propTypes'
import { addQuestion, questionAnswered } from '@innodoc/client-store/src/actions/question'
import exerciseSelectors from '@innodoc/client-store/src/selectors/exercise'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import ExerciseContext from './ExerciseContext'

// All questions inside an ExerciseCard are connected using this
// Context.Provider.
const ExerciseProvider = ({ children, id }) => {
  const dispatch = useDispatch()
  const { id: sectionId } = useSelector(sectionSelectors.getCurrentSection)
  const answered = useSelector(exerciseSelectors.getExerciseAnswered)
  const correct = useSelector(exerciseSelectors.getExerciseCorrect)
  const globalId = `${sectionId}#${id}`

  const [autoVerify, setAutoVerify] = useState(true)
  const [userTriggeredVerify, setUserTriggeredVerify] = useState(false)

  const value = {
    addQuestion: (qId, points) => dispatch(addQuestion(globalId, qId, points)),
    answered,
    correct,
    questionAnswered: (qId, answer, attrs) => dispatch(questionAnswered(qId, answer, attrs)),
    getShowResult: () => autoVerify || userTriggeredVerify,
    setAutoVerify,
    setUserTriggeredVerify,
    userTriggeredVerify,
  }
  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>
}

ExerciseProvider.propTypes = {
  children: childrenType.isRequired,
  id: PropTypes.string.isRequired,
}

export default ExerciseProvider
