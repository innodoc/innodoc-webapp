import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/es/list'

import { unwrapPara } from '@innodoc/client-misc/src/util'

import css from './style.sass'
import ContentFragment from '..'

const OrderedList = ({ data }) => {
  const listItems = data[1].map(
    (item, i) => (
      <List.Item key={i.toString()}>
        <div className={css.listnumber}>
          {`${i + 1}.`}
        </div>
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
