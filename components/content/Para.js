import React from 'react'

import { contentType } from '../../lib/propTypes'
import ContentFragment from '../ContentFragment'

const Para = ({ data }) => (
  <p>
    <ContentFragment content={data} />
  </p>
)
Para.propTypes = { data: contentType.isRequired }

export default Para
