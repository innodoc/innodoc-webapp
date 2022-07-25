import { Typography } from 'antd'

import { contentType } from '@innodoc/misc/propTypes'

import ContentFragment from '../ContentFragment.jsx'

function Para({ data }) {
  return (
    <Typography.Paragraph>
      <ContentFragment content={data} />
    </Typography.Paragraph>
  )
}
Para.propTypes = { data: contentType.isRequired }

export default Para
