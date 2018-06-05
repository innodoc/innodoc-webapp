import React from 'react'
import PropTypes from 'prop-types'
import md5 from 'md5'

import InputQuestion from './questions/InputQuestionComponent'
import questionTypes from '../../../lib/questionTypes'

import StringEqualityValidator from '../../../lib/validators/StringEqualityValidator'
import MathExpressionEqualityValidator from '../../../lib/validators/MathExpressionEqualityValidator'
import MathFormulaValidator from '../../../lib/validators/MathFormulaValidator'

export default class Code extends React.Component {
  static propTypes = {
    data: PropTypes.node.isRequired,
  }

  static attrsToObj(attrs) {
    const a = attrs.reduce((obj, [key, value]) => ({
      ...obj, [key]: value,
    }), {})
    return a
  }

  constructor(props) {
    super(props)
    const [[id, classNames, attrs], content] = props.data
    this.id = id
    this.classNames = classNames
    this.attrs = Code.attrsToObj(attrs)
    this.content = content
    this.solution = this.attrs.solution
  }

  getQuestionComponent(classNames, attrs) {
    const validator = this.getValidator()
    const uuid = md5(`${this.solution}${this.questionType}`)

    return (
      <InputQuestion
        uuid={uuid}
        solution={this.solution}
        attrs={attrs}
        validator={validator}
      />
    )
  }

  getValidator() {
    let validator

    switch (this.attrs.questionType) {
      case questionTypes.MATH_EXPRESSION:
        validator = {
          validate: MathExpressionEqualityValidator.validate,
          args: {
            precision: this.attrs.precision,
          },
        }
        break

      case questionTypes.MATH_FORMULA:
        validator = {
          validate: MathFormulaValidator.validate,
          args: {
            precision: this.attrs.precision,
          },
        }
        break

      case questionTypes.EXACT:
        validator = {
          validate: StringEqualityValidator.validate,
        }
        break

      default:
        validator = { validate: StringEqualityValidator.validate }
    }
    return validator
  }

  render() {
    if (this.classNames.includes('exercise')) {
      return this.getQuestionComponent(this.classNames, this.attrs)
    }
    return (
      <code id={this.id} className={this.classNames}>{this.content}</code>
    )
  }
}
