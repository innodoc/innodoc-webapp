import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import objectHash from 'object-hash'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import { questionAnswered } from '@innodoc/client-store/src/actions/question'
import questionSelectors from '@innodoc/client-store/src/selectors/question'
import {
  attributesToObject,
  getClassNameToComponentMapper,
} from '@innodoc/client-misc/src/util'
import { attributeType } from '@innodoc/client-misc/src/propTypes'

import ExerciseContext from '../cards/ExerciseCard/ExerciseContext'
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
  const { id: sectionId } = useSelector(sectionSelectors.getCurrentSection)
  const globalQuestionId = getQuestionId(sectionId, id, attributes)
  const getQuestion = useMemo(questionSelectors.makeGetQuestion, [])
  const { answer, correct } = useSelector((state) =>
    getQuestion(state, globalQuestionId)
  )
  const dispatch = useDispatch()
  const { addQuestion, addQuestionAnswered, getShowResult } = useContext(
    ExerciseContext
  )

  // Notify exercise context about this question
  addQuestion(globalQuestionId)
  if (answer) {
    addQuestionAnswered(globalQuestionId)
  }

  const QuestionComponent = mapClassNameToComponent(questionClasses)
  if (QuestionComponent) {
    const attrsObj = attributesToObject(attributes)
    const showResult = correct !== null && getShowResult()
    const feedbackIcon = <FeedbackIcon correct={showResult ? correct : null} />
    const className = showResult
      ? classNames({
          [css.correct]: correct,
          [css.incorrect]: !correct,
        })
      : null
    return (
      <QuestionComponent
        attributes={attrsObj}
        className={className}
        icon={feedbackIcon}
        onChange={(val) =>
          dispatch(
            questionAnswered({
              answer: val,
              attributes: attrsObj,
              questionId: globalQuestionId,
            })
          )
        }
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
