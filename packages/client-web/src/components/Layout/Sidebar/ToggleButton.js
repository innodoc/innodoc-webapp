import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { Button } from 'antd'

import appSelectors from '@innodoc/client-store/src/selectors'
import { toggleSidebar } from '@innodoc/client-store/src/actions/ui'
import { useTranslation } from '@innodoc/client-misc/src/i18n'

import css from './style.sss'

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
