import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import Button from 'antd/lib/button'

import css from './style.sass'
import appSelectors from '../../../store/selectors'
import { toggleSidebar } from '../../../store/actions/ui'
import { useTranslation } from '../../../lib/i18n'

const ToggleButton = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { sidebarVisible } = useSelector(appSelectors.getApp)
  return (
    <Button
      className={classNames(css.toggleButton, sidebarVisible ? 'active' : null)}
      ghost
      icon="read"
      onClick={() => dispatch(toggleSidebar())}
      title={t(sidebarVisible ? 'common.hideToc' : 'common.showToc')}
    />
  )
}

export default ToggleButton
