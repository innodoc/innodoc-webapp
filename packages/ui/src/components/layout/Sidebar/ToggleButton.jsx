import { ReadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { toggleSidebar } from '@innodoc/store/actions/ui'
import { getApp } from '@innodoc/store/selectors/misc'

function ToggleButton({ className, icon }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { sidebarVisible } = useSelector(getApp)

  return (
    <Button
      className={className}
      icon={icon}
      onClick={() => dispatch(toggleSidebar())}
      size="small"
      title={t(sidebarVisible ? 'common.hideToc' : 'common.showToc')}
    />
  )
}

ToggleButton.defaultProps = {
  className: undefined,
  icon: <ReadOutlined />,
}

ToggleButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
}

export default ToggleButton
