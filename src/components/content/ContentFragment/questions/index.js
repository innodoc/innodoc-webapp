import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import sectionSelectors from '../../../../store/selectors/section'
import { questionAnswered } from '../../../../store/actions/question'
import questionSelectors from '../../../../store/selectors/question'
import { getClassNameToComponentMapper } from '../../../../lib/util'
import CheckboxQuestion from './CheckboxQuestion'
import InputQuestion from './InputQuestion'
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
  const Component = mapClassNameToComponent(questionClasses)
  if (Component) {
    // convert tuples to obj
    const attrsObj = attributes.reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
    return (
      <Component
        attributes={attrsObj}
        correct={correct}
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
  attributes: PropTypes.arrayOf(PropTypes.array).isRequired,
  correct: PropTypes.bool,
  questionId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  questionClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
}

Question.defaultProps = {
  answer: '',
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
