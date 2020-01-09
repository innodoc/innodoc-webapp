import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Layout as AntLayout } from 'antd'

import { toggleSidebar } from '@innodoc/client-store/src/actions/ui'
import appSelectors from '@innodoc/client-store/src/selectors'
import { childrenType } from '@innodoc/client-misc/src/propTypes'
import { useTranslation } from '@innodoc/client-misc/src/i18n'

import useIsNarrowerThan from '../../../hooks/useIsNarrowerThan'
import css from './style.sss'

const WIDTHS = [300, 400] // width change on breakpoint

const Sidebar = ({ children }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { sidebarVisible } = useSelector(appSelectors.getApp)
  const isNarrowerThanXl = useIsNarrowerThan('xl')
  const width = isNarrowerThanXl ? WIDTHS[0] : WIDTHS[1]

  return (
    <AntLayout.Sider
      className={css.sidebar}
      collapsed={!sidebarVisible}
      collapsedWidth={0}
      collapsible
      theme="light"
      trigger={null}
      width={width}
    >
      <div className={css.background}>
        <div
          className={css.animation}
          style={{ transform: `translateX(${sidebarVisible ? 0 : -width}px)` }}
        >
          <div
            className={css.closeButton}
            style={{ marginLeft: `${width - 48}px` }}
          >
            <Button
              icon="double-left"
              onClick={() => dispatch(toggleSidebar())}
              size="small"
              title={t('common.hideToc')}
            />
          </div>
          <div className={css.sticky} style={{ minWidth: width }}>
            {children}
          </div>
        </div>
      </div>
    </AntLayout.Sider>
  )
}

Sidebar.defaultProps = { children: null }
Sidebar.propTypes = { children: childrenType }

export default Sidebar
