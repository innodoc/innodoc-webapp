import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '../ContentFragment'

const BulletList = ({ data }) => {
  const listItems = data.map(
    (item, i) => (
      <li key={i.toString()}>
        <ContentFragment content={item} />
      </li>
    )
  )
  return (
    <ul>
      {listItems}
    </ul>
  )
}

BulletList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default BulletList
