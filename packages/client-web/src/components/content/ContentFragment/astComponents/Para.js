import React from 'react'
import { Typography } from 'antd'

import { propTypes } from '@innodoc/client-misc'

import ContentFragment from '..'

const Para = ({ data }) => (
  <Typography.Paragraph>
    <ContentFragment content={data} />
  </Typography.Paragraph>
)
Para.propTypes = { data: propTypes.contentType.isRequired }

export default Para
