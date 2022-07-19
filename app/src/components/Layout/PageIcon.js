import PropTypes from 'prop-types'
import {
  CopyrightOutlined,
  FileExclamationOutlined,
  InfoCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons'

const iconTypeComponentMap = {
  copyright: CopyrightOutlined,
  'info-circle': InfoCircleOutlined,
  liability: FileExclamationOutlined,
  team: TeamOutlined,
}

const PageIcon = ({ type }) => {
  const Component = iconTypeComponentMap[type]
  return Component ? <Component /> : null
}

PageIcon.propTypes = {
  type: PropTypes.string.isRequired,
}

export default PageIcon
