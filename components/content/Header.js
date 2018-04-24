import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'

export default class Header extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const level = this.props.data[0]
    const [id, classNames] = this.props.data[1]
    const content = this.props.data[2]
    const HeaderTag = `h${level}`;
    return (
      <HeaderTag id={id} className={classNames}>
        <ContentFragment content={content} />
      </HeaderTag>
    )
  }
}
