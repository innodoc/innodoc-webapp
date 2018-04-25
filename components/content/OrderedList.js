import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'

export default class OrderedList extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const listItems = this.props.data[1].map(
      (item, i) => <li key={i.toString()}><ContentFragment content={item} /></li>
    )
    return (
      <ol>
        {listItems}
      </ol>
    )
  }
}
