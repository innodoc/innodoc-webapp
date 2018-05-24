import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'semantic-ui-react'

import ContentFragment from '../ContentFragment'

const OrderedList = ({ data }) => {
  // TODO: unwrap paragraphs
  const listItems = data[1].map(
    (item, i) => (
      <List.Item key={i.toString()}>
        <ContentFragment content={item} />
      </List.Item>
    )
  )
  return (
    <List ordered divided verticalAlign="middle" relaxed="very">
      {listItems}
    </List>
  )
}

OrderedList.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default OrderedList
