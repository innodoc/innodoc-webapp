import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '../ContentFragment'

const OrderedList = ({ data }) => {
  const listItems = data[1].map(
    (item, i) => (
      <li key={i.toString()}>
        <ContentFragment content={item} />
      </li>
    )
  )
  return (
    <ol>
      {listItems}
    </ol>
  )
}

OrderedList.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default OrderedList
