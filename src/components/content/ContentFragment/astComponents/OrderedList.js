import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'

import css from './style.sass'
import ContentFragment from '..'
import { unwrapPara } from '../../../../lib/util'

const OrderedList = ({ data }) => {
  // TODO: unwrap paragraphs
  const listItems = data[1].map(
    (item, i) => (
      <List.Item key={i.toString()}>
        <span className={css.listnumber}>
          {`${i + 1}.`}
        </span>
        <div>
          <ContentFragment content={unwrapPara(item)} />
        </div>
      </List.Item>
    )
  )
  return (
    <List itemLayout="vertical" className={css.orderedList}>
      {listItems}
    </List>
  )
}

OrderedList.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default OrderedList
