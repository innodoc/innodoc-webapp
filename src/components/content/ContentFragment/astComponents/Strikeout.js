import React from 'react'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const Strikeout = ({ data }) => (
  <s>
    <ContentFragment content={data} />
  </s>
)

Strikeout.propTypes = { data: contentType.isRequired }

export default Strikeout
