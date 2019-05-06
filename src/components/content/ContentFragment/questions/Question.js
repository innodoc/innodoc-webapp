import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import sectionSelectors from '../../../../store/selectors/section'
import { questionAnswered } from '../../../../store/actions/question'
import questionSelectors from '../../../../store/selectors/question'
import { attributesToObject, getClassNameToComponentMapper } from '../../../../lib/util'
import ExerciseContext from '../cards/ExerciseCard/ExerciseContext'
import CheckboxQuestion from './CheckboxQuestion'
import InputQuestion from './InputQuestion'
import FeedbackIcon from './FeedbackIcon'
import { attributeType } from '../../../../lib/propTypes'
import css from './style.sass'

const mapClassNameToComponent = getClassNameToComponentMapper({
  text: InputQuestion,
  checkbox: CheckboxQuestion,
})

const Question = ({
  answer,
  attributes,
  correct,
  onChange,
  questionClasses,
  questionId,
}) => {
  const {
    addQuestion,
    addQuestionAnswered,
    getShowResult,
  } = useContext(ExerciseContext)

  // Notify exercise context about this question
  addQuestion(questionId)
  if (answer) {
    addQuestionAnswered(questionId)
  }

  const QuestionComponent = mapClassNameToComponent(questionClasses)
  if (QuestionComponent) {
    const attrsObj = attributesToObject(attributes)
    const showResult = getShowResult() && correct !== null
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
        onChange={val => onChange({ questionId, attributes: attrsObj, answer: val })}
        value={answer}
      />
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    const msg = `Unknown question type. questionClasses=${questionClasses} attributes=${attributes}`
    return (
      <span questionClasses={css.unknownQuestion}>
        {msg}
      </span>
    )
  }
  return null
}

Question.propTypes = {
  answer: PropTypes.string,
  attributes: attributeType.isRequired,
  correct: PropTypes.bool,
  questionId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  questionClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
}

Question.defaultProps = {
  answer: null,
  correct: null,
}

const mapStateToProps = (state, { id }) => {
  const sectionId = sectionSelectors.getCurrentSection(state).id
  // As IDs are unique to one page, internally we prefix it with the sectionID.
  const questionId = `${sectionId}#${id}`
  const question = questionSelectors.getQuestion(state, questionId)
  const ret = { questionId }
  if (question) {
    return {
      ...ret,
      correct: question.correct,
      answer: question.answer,
    }
  }
  return ret
}

const mapDispatchToProps = { onChange: questionAnswered }

export { Question, mapStateToProps } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(Question)
