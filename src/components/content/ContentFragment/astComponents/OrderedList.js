import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'

import css from './style.sass'
import ContentFragment from '..'

const OrderedList = ({ data }) => {
  // TODO: unwrap paragraphs
  const listItems = data[1].map(
    (item, i) => (
      <List.Item key={i.toString()}>
        <span className={css.listnumber}>
          {`${i + 1}.`}
        </span>
        <ContentFragment content={item} />
      </List.Item>
    )
  )
  return (
    <List>
      {listItems}
    </List>
  )
}

OrderedList.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default OrderedList
