import React, { useContext, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import objectHash from 'object-hash'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import questionSelectors from '@innodoc/client-store/src/selectors/question'
import {
  attributesToObject,
  getClassNameToComponentMapper,
} from '@innodoc/client-misc/src/util'
import { attributeType } from '@innodoc/client-misc/src/propTypes'
import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import { ExerciseContext } from '../ExerciseContext'
import CheckboxQuestion from './CheckboxQuestion'
import InputQuestion from './InputQuestion'
import FeedbackIcon from './FeedbackIcon'
import css from './style.sss'

const mapClassNameToComponent = getClassNameToComponentMapper({
  text: InputQuestion,
  checkbox: CheckboxQuestion,
})

const getQuestionId = (sectionId, id, attributes) => {
  const questionId =
    id && id.length
      ? // The easy case: An ID was specified.
        id
      : // Question should always carry an ID attribute. BUT: If they don't, things
        // shouldn't break. So we generate an internal ID from the question's
        // content.
        objectHash(attributes)
  // As IDs are unique to a single page, for the global app state we need to
  // prefix them with the section ID.
  return `${sectionId}#${questionId}`
}

const Question = ({ attributes, id, questionClasses }) => {
  const attrsObj = attributesToObject(attributes)
  const { id: sectionId } = useSelector(sectionSelectors.getCurrentSection)
  const globalQuestionId = getQuestionId(sectionId, id, attributes)
  const getQuestion = useMemo(
    (state, questionId) => questionSelectors.makeGetQuestion(state, questionId),
    []
  )
  const question = useSelector((state) => getQuestion(state, globalQuestionId))
  const { addQuestion, getShowResult, questionAnswered } = useContext(
    ExerciseContext
  )

  useEffect(() => {
    // Notify exercise context about this question
    addQuestion(globalQuestionId, parseInt(attrsObj.points, 10) || 0)
  }, [addQuestion, attrsObj.points, globalQuestionId])

  const QuestionComponent = mapClassNameToComponent(questionClasses)
  if (QuestionComponent) {
    const { answer, result, messages, latexCode } = question
    const showResult = result !== RESULT_VALUE.NEUTRAL && getShowResult()
    const iconResult = showResult ? result : RESULT_VALUE.NEUTRAL
    const feedbackIcon = <FeedbackIcon result={iconResult} />
    const className = showResult
      ? classNames({
          [css.correct]: result === RESULT_VALUE.CORRECT,
          [css.incorrect]: result === RESULT_VALUE.INCORRECT,
        })
      : null

    return (
      <QuestionComponent
        attributes={attrsObj}
        className={className}
        icon={feedbackIcon}
        latexCode={latexCode}
        messages={messages}
        onChange={(val) => questionAnswered(globalQuestionId, val, attrsObj)}
        value={answer}
      />
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    const msg = `Unknown question type. questionClasses=${questionClasses} attributes=${attributes}`
    return <span className={css.unknownQuestion}>{msg}</span>
  }
  return null
}

Question.propTypes = {
  attributes: attributeType.isRequired,
  id: PropTypes.string,
  questionClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
}

Question.defaultProps = {
  id: null,
}

export default Question
