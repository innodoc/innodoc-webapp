import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'

export default class Div extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const [id, classNames] = this.props.data[0]
    const content = this.props.data[1]
    return (
      <div id={id} className={classNames}>
        <ContentFragment content={content} />
      </div>
    )
  }
}
