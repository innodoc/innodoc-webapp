import {
  CopyrightOutlined,
  FileExclamationOutlined,
  InfoCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import PropTypes from 'prop-types'

const iconTypeComponentMap = {
  copyright: CopyrightOutlined,
  'info-circle': InfoCircleOutlined,
  liability: FileExclamationOutlined,
  team: TeamOutlined,
}

function PageIcon({ type }) {
  const Component = iconTypeComponentMap[type]
  return Component ? <Component /> : null
}

PageIcon.propTypes = {
  type: PropTypes.string.isRequired,
}

export default PageIcon
