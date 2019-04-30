import React, { useState } from 'react'

import ExerciseContext from './ExerciseContext'
import { childrenType } from '../../../../../lib/propTypes'

const addToIds = (id, ids, setIds) => {
  if (!ids.includes(id)) {
    setIds(ids.concat(id))
  }
}

// All questions inside an ExerciseCard are connected using this
// Context.Provider.

const ExerciseProvider = ({ children }) => {
  // keep track of encountered and answered question IDs
  const [questionIds, setQuestionIds] = useState([])
  const [answeredIds, setAnsweredIds] = useState([])

  const [autoVerify, setAutoVerify] = useState(true)
  const [userTriggeredVerify, setUserTriggeredVerify] = useState(false)

  const value = {
    addQuestion: id => addToIds(id, questionIds, setQuestionIds),
    addQuestionAnswered: id => addToIds(id, answeredIds, setAnsweredIds),
    allAnswered: () => questionIds.length === answeredIds.length,
    getShowResult: () => autoVerify || userTriggeredVerify,
    setAutoVerify,
    setUserTriggeredVerify,
    userTriggeredVerify,
  }
  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  )
}

ExerciseProvider.propTypes = {
  children: childrenType.isRequired,
}

export default ExerciseProvider
