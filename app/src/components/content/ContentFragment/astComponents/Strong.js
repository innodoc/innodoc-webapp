import { Typography } from 'antd'

import { propTypes } from '@innodoc/misc'

import ContentFragment from '..'

const Strong = ({ data }) => (
  <Typography.Text strong>
    <ContentFragment content={data} />
  </Typography.Text>
)

Strong.propTypes = { data: propTypes.contentType.isRequired }

export default Strong
