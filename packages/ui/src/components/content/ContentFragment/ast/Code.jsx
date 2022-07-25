import { Typography } from 'antd'
import classnames from 'classnames'
import PropTypes from 'prop-types'

function Code({ data }) {
  const [[id, classNames], content] = data
  return (
    <Typography.Text code id={id} className={classnames(classNames)}>
      {content}
    </Typography.Text>
  )
}

Code.propTypes = {
  data: PropTypes.node.isRequired,
}

export default Code
