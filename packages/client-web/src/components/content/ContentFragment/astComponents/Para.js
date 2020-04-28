import React from 'react'
import { Typography } from 'antd'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '..'

const Para = ({ data }) => (
  <Typography.Paragraph>
    <ContentFragment content={data} />
  </Typography.Paragraph>
)
Para.propTypes = { data: contentType.isRequired }

export default Para
