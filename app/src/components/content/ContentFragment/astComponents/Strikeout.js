import { Typography } from 'antd'

import { propTypes } from '@innodoc/misc'

import ContentFragment from '..'

const Strikeout = ({ data }) => (
  <Typography.Text delete>
    <ContentFragment content={data} />
  </Typography.Text>
)

Strikeout.propTypes = { data: propTypes.contentType.isRequired }

export default Strikeout
