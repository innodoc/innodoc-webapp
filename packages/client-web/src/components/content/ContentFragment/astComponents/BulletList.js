import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd'

import css from './style.sss'
import ContentFragment from '..'

const BulletList = ({ data }) => {
  const listItems = data.map((item, i) => (
    <List.Item key={i.toString()}>
      <ContentFragment content={item} />
    </List.Item>
  ))
  return (
    <List itemLayout="vertical" className={css.bulletList}>
      {listItems}
    </List>
  )
}

BulletList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default BulletList
