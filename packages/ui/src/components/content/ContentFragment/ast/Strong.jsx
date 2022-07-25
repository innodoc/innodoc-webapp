import { Typography } from 'antd'

import { contentType } from '@innodoc/misc/propTypes'

import ContentFragment from '../ContentFragment.jsx'

function Strong({ data }) {
  return (
    <Typography.Text strong>
      <ContentFragment content={data} />
    </Typography.Text>
  )
}

Strong.propTypes = { data: contentType.isRequired }

export default Strong
