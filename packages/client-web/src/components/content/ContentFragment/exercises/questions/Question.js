import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import objectHash from 'object-hash'
import { debounce } from 'lodash-es'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import questionSelectors from '@innodoc/client-store/src/selectors/question'
import { constants, propTypes, util } from '@innodoc/client-misc'

import { ExerciseContext } from '../ExerciseContext'
import CheckboxQuestion from './CheckboxQuestion'
import InputQuestion from './InputQuestion'
import FeedbackIcon from './FeedbackIcon'
import css from './Question.module.sss'

const mapClassNameToComponent = util.getClassNameToComponentMapper({
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
  const attrsObj = util.attributesToObject(attributes)
  const { id: sectionId } = useSelector(sectionSelectors.getCurrentSection)
  const globalQuestionId = getQuestionId(sectionId, id, attributes)
  const getQuestion = useMemo(
    (state, questionId) => questionSelectors.makeGetQuestion(state, questionId),
    []
  )
  const question = useSelector((state) => getQuestion(state, globalQuestionId))
  const { addQuestion, dispatchAnswer, showResult } = useContext(ExerciseContext)

  // Register question with ExerciseContext
  useEffect(() => {
    addQuestion(globalQuestionId, parseInt(attrsObj.points, 10) || 0)
  }, [addQuestion, attrsObj.points, globalQuestionId])

  const { answer, result, messages, latexCode, invalid } = question
  const [value, setValue] = useState()
  const debouncedDispatchAnswer = useRef(
    debounce(
      (qId, val, qAttrsObj) => {
        dispatchAnswer(globalQuestionId, val, qAttrsObj)
      },
      500,
      {
        leading: true,
      }
    )
  )
  const onChange = (val) => {
    setValue(val)
    // Do not hammer store with updates
    debouncedDispatchAnswer.current(globalQuestionId, val, attrsObj)
  }

  useEffect(() => {
    setValue(answer)
  }, [answer, globalQuestionId])

  const QuestionComponent = mapClassNameToComponent(questionClasses)
  if (QuestionComponent) {
    let iconIsCorrect
    if (showResult) {
      iconIsCorrect = result === constants.RESULT.CORRECT
    }
    const feedbackIcon = <FeedbackIcon isCorrect={iconIsCorrect} />
    const className = showResult
      ? classNames({
          [css.correct]: result === constants.RESULT.CORRECT,
          [css.incorrect]: result === constants.RESULT.INCORRECT,
        })
      : null

    return (
      <QuestionComponent
        attributes={attrsObj}
        className={className}
        icon={feedbackIcon}
        invalid={invalid}
        latexCode={latexCode}
        messages={messages}
        onChange={onChange}
        showResult={showResult}
        value={value}
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
  attributes: propTypes.attributeType.isRequired,
  id: PropTypes.string,
  questionClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
}

Question.defaultProps = {
  id: null,
}

export default Question
