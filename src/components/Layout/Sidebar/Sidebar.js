import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import { StickyContainer, Sticky } from 'react-sticky'

import { useTranslation } from '../../../lib/i18n'
import useIsNarrowerThan from '../../hooks/useIsNarrowerThan'
import appSelectors from '../../../store/selectors'
import { toggleSidebar } from '../../../store/actions/ui'
import css from './style.sass'
import { childrenType } from '../../../lib/propTypes'

const WIDTHS = [300, 400] // width change on breakpoint

const Sidebar = ({ children }) => {
  const { sidebarVisible } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isNarrowerThanXl = useIsNarrowerThan('xl')
  const width = isNarrowerThanXl ? WIDTHS[0] : WIDTHS[1]

  return (
    <AntLayout.Sider
      className={css.sidebar}
      collapsed={!sidebarVisible}
      collapsedWidth={0}
      collapsible
      trigger={null}
      width={width}
    >
      <StickyContainer
        className={css.stickyContainer}
        style={{ minWidth: width }}
      >
        <Sticky>
          {({ style }) => (
            <div className={css.sidebarContent} style={style}>
              <div
                className={css.sidebarTranslate}
                style={{ transform: `translateX(${sidebarVisible ? 0 : -width}px)` }}
              >
                <Button
                  className={css.collapseButton}
                  icon="double-left"
                  onClick={() => dispatch(toggleSidebar())}
                  size="small"
                  title={t('sidebar.collapseButton')}
                />
                {children}
              </div>
            </div>
          )}
        </Sticky>
      </StickyContainer>
    </AntLayout.Sider>
  )
}

Sidebar.defaultProps = { children: null }
Sidebar.propTypes = { children: childrenType }

export default Sidebar
