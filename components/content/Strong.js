import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'

export default class Strong extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    return (
      <strong>
        <ContentFragment content={this.props.data} />
      </strong>
    )
  }
}
