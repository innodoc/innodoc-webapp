import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'

export default class Math extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const mathType = this.props.data[0].t
    const texCode = this.props.data[1]
    const classNames = ['math']
    let delims

    if (mathType === 'InlineMath') {
      classNames.push('inline')
      delims = ['\\(', '\\)']
    }
    else if (mathType === 'DisplayMath') {
      classNames.push('display')
      delims = ['\\[', '\\]']
    }
    else {
      throw new Error(
        `mathType must be either InlineMath or DisplayMath. Got ${mathType}!`)
    }

    return <span className={classNames}>{delims[0]}{texCode}{delims[1]}</span>
  }
}
