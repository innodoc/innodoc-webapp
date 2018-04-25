import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'

export default class ExternalLink extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const content = this.props.data[1]
    const href = this.props.data[2][0]
    const title = this.props.data[2][1]
    return <a href={href} title={title}>
      <ContentFragment content={content} />
    </a>
  }
}
