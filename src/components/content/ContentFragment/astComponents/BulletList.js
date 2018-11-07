import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'

import css from './style.sass'
import ContentFragment from '..'
import { unwrapPara } from '../../../../lib/util'

const BulletList = ({ data }) => {
  const listItems = data.map(
    (item, i) => (
      <List.Item key={i.toString()}>
        <ContentFragment content={unwrapPara(item)} />
      </List.Item>
    )
  )
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
