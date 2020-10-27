import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '..'
import css from './style.sss'

const OrderedList = ({ data }) => {
  const listItems = data[1].map((item, i) => {
    return (
      <li key={i.toString()}>
        <ContentFragment content={item} />
      </li>
    )
  })
  return <ol className={css.list}>{listItems}</ol>
}

OrderedList.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default OrderedList
