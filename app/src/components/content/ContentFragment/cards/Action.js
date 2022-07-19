import PropTypes from 'prop-types'
import { Button } from 'antd'

const Action = ({ disabled, icon, onClick, title }) => (
  <Button block disabled={disabled} onClick={onClick} type="text">
    {icon} {title}
  </Button>
)

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
