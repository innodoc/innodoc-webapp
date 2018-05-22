import React from 'react'
import PropTypes from 'prop-types'

import {
  InputQuestionComponent, MathInputQuestionComponent,
  FunctionInputQuestionComponent,
} from './questions/Input'

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
    if (attrs.validator === 'math') {
      return <MathInputQuestionComponent solution={this.solution} attrs={attrs} />
    } else if (attrs.validator === 'function') {
      return <FunctionInputQuestionComponent solution={this.solution} attrs={attrs} />
    }

    return <InputQuestionComponent solution={this.solution} attrs={attrs} />
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
