import React from 'react'
import { Typography } from 'antd'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '..'

const Strikeout = ({ data }) => (
  <Typography.Text delete>
    <ContentFragment content={data} />
  </Typography.Text>
)

Strikeout.propTypes = { data: contentType.isRequired }

export default Strikeout
