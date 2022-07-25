import { Button } from 'antd'
import PropTypes from 'prop-types'

function Action({ disabled, icon, onClick, title }) {
  return (
    <Button block disabled={disabled} onClick={onClick} type="text">
      {icon} {title}
    </Button>
  )
}

Action.defaultProps = {
  disabled: false,
}

Action.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default Action
