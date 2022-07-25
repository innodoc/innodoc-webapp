import { Typography } from 'antd'

import { contentType } from '@innodoc/misc/propTypes'

import ContentFragment from '../ContentFragment.jsx'

function Strikeout({ data }) {
  return (
    <Typography.Text delete>
      <ContentFragment content={data} />
    </Typography.Text>
  )
}

Strikeout.propTypes = { data: contentType.isRequired }

export default Strikeout
