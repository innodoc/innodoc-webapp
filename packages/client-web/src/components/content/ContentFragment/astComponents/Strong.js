import React from 'react'
import { Typography } from 'antd'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '..'

const Strong = ({ data }) => (
  <Typography.Text strong>
    <ContentFragment content={data} />
  </Typography.Text>
)

Strong.propTypes = { data: contentType.isRequired }

export default Strong
