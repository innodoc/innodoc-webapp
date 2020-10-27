import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '..'
import css from './style.sss'

const BulletList = ({ data }) => {
  const listItems = data.map((item, i) => (
    <li key={i.toString()}>
      <ContentFragment content={item} />
    </li>
  ))
  return <ul className={css.list}>{listItems}</ul>
}

BulletList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default BulletList
