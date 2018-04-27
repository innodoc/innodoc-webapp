import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'
import {InputQuestionComponent, MathInputQuestionComponent} from './questions/Input'

export default class Code extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    const [id, classNames, attrs] = props.data[0]
    this.id = id
    this.classNames = classNames
    this.attrs = this.attrsToObj(attrs)
    this.content = this.props.data[1]
    this.solution = this.attrs.solution
  }

  attrsToObj(attrs) {
    let a = attrs.reduce((obj, item) => {
      obj[item[0]] = item[1]
      return obj
    }, {})
    return a
  }

  getQuestionComponent(classNames, attrs) {

    if (attrs.validator == 'math') {
      return <MathInputQuestionComponent solution={this.solution} attrs={attrs}/>
    }

    return <InputQuestionComponent solution={this.solution} attrs={attrs}/>
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
