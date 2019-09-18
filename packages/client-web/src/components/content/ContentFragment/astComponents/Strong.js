import React from 'react'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '..'

const Strong = ({ data }) => (
  <strong>
    <ContentFragment content={data} />
  </strong>
)

Strong.propTypes = { data: contentType.isRequired }

export default Strong