import React from 'react'
import PropTypes from 'prop-types'

import InputQuestion from '../questions/InputQuestion'

export default class Code extends React.Component {
  static attrsToObj(attrs) {
    const a = attrs.reduce((obj, [key, value]) => ({
      ...obj, [key]: value,
    }), {})
    return a
  }

  constructor(props) {
    super(props)
    const [[id, classNames, attrs], content] = props.data
    // NOTE: Not sure whether the field 'id' is supposed to be the exercise UID
    // or something else
    this.id = id
    this.classNames = classNames
    this.attrs = Code.attrsToObj(attrs)
    this.content = content
    this.solution = this.attrs.solution
  }

  getQuestionComponent(classNames, attrs) {
    // NOTE: This is only temporary. Use legacy IDs until the compiler will generate its own.
    const id = this.id !== '' ? this.id : attrs.uxid

    return (
      <InputQuestion
        id={id}
        solution={this.solution}
        attrs={attrs}
      />
    )
  }

  render() {
    if (this.classNames.includes('exercise')) {
      return this.getQuestionComponent(this.classNames, this.attrs)
    }
    return (
      <code id={this.id} className={this.classNames}>
        {this.content}
      </code>
    )
  }
}

Code.propTypes = {
  data: PropTypes.node.isRequired,
}
