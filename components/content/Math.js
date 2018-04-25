import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'

class InlineMath extends React.Component {
  static propTypes = {
    texCode: PropTypes.string.isRequired
  }

  render() {
    return <span className="math inline">\({this.props.texCode}\)</span>
  }
}

class DisplayMath extends React.Component {
  static propTypes = {
    texCode: PropTypes.string.isRequired
  }

  render() {
    return <span className="math display">\[{this.props.texCode}\]</span>
  }
}

export default class Math extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const mathType = this.props.data[0].t
    const texCode = this.props.data[1]

    if (mathType === 'InlineMath')
      return <InlineMath texCode={texCode} />

    if (mathType === 'DisplayMath')
      return <DisplayMath texCode={texCode} />

    throw new Error(`mathType must be either InlineMath or DisplayMath. Got ${mathType}!`)
  }
}
