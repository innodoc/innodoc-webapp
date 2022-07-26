import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { childrenType } from '@innodoc/misc/propTypes'
import { questionAdded, questionAnswered } from '@innodoc/store/actions/questions'

import ExerciseContext from './ExerciseContext.js'

// All questions inside an ExerciseCard are connected using this
// Context.Provider.
function ExerciseProvider({
  children,
  exercise: { isAnswered, isCorrect, id: globalExId },
  setShowResult,
  showResult,
}) {
  const dispatch = useDispatch()

  // Register a question in the store
  const addQuestionWrapper = useCallback(
    (qId, points) => dispatch(questionsSelectors.questionAdded(globalExId, qId, points)),
    [dispatch, globalExId]
  )

  const value = useMemo(
    () => ({
      addQuestion: addQuestionWrapper,
      isAnswered,
      isCorrect,
      dispatchAnswer: (qId, answer, attrs) => {
        setShowResult(false)
        dispatch(questionsSelectors.questionAnswered(qId, answer, attrs))
      },
      showResult,
    }),
    [addQuestionWrapper, dispatch, isAnswered, isCorrect, setShowResult, showResult]
  )

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
