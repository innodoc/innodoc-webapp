import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd'
import { ReadOutlined } from '@ant-design/icons'

import appSelectors from '@innodoc/client-store/src/selectors'
import { toggleSidebar } from '@innodoc/client-store/src/actions/ui'
import { useTranslation } from '@innodoc/common/src/i18n'

const ToggleButton = ({ className, icon }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { sidebarVisible } = useSelector(appSelectors.getApp)

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
