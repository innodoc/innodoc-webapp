import { Typography } from 'antd'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import ContentFragment from '../ContentFragment.jsx'

function Header({ data }) {
  const [level, [id, classes], content] = data
  // antd only accepts level <= 4
  return (
    <Typography.Title id={id} className={classNames(classes)} level={Math.min(4, level)}>
      <ContentFragment content={content} />
    </Typography.Title>
  )
}

Header.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Header
