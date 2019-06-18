import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'

import { useTranslation } from '../../../lib/i18n'
import useIsNarrowerThan from '../../../hooks/useIsNarrowerThan'
import appSelectors from '../../../store/selectors'
import { toggleSidebar } from '../../../store/actions/ui'
import css from './style.sass'
import { childrenType } from '../../../lib/propTypes'

// TODO: sticky sidebar content?

// width change on breakpoint
const WIDTHS = [300, 400]

const Sidebar = ({ children }) => {
  const { sidebarVisible } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isNarrowerThanXl = useIsNarrowerThan('xl')
  const width = isNarrowerThanXl ? WIDTHS[0] : WIDTHS[1]

  return (
    <AntLayout.Sider
      collapsible
      collapsed={!sidebarVisible}
      width={width}
      collapsedWidth={0}
      trigger={null}
      className={css.sidebar}
    >
      <div style={{ minWidth: width }}>
        <div>
          <div>
            <Button
              title={t('sidebar.collapseButton')}
              onClick={() => dispatch(toggleSidebar())}
              className={css.collapseButton}
              icon="double-left"
              size="small"
            />
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
