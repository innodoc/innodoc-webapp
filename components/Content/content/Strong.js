import React from 'react'

import { contentType } from '../../../lib/propTypes'
import ContentFragment from '../ContentFragment'

const Strong = ({ data }) => (
  <strong>
    <ContentFragment content={data} />
  </strong>
)

Strong.propTypes = { data: contentType.isRequired }

export default Strong
