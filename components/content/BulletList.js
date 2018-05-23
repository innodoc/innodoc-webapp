import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'semantic-ui-react'
import ContentFragment from '../ContentFragment'

const BulletList = ({ data }) => {
  const listItems = data.map(
    (item, i) => (
      <List.Item key={i.toString()}>
        <ContentFragment content={item} />
      </List.Item>
    )
  )
  return (
    <List bulleted verticalAlign="middle">
      {listItems}
    </List>
  )
}

BulletList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default BulletList
