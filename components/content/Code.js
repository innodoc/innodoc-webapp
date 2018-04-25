import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'

export default class Code extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const content = this.props.data[1]
    return (
      <code>{content}</code>
    )
  }
}
