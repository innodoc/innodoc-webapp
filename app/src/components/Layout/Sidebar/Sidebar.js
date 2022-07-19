import { useSelector } from 'react-redux'
import { Grid, Layout as AntLayout } from 'antd'
import { DoubleLeftOutlined } from '@ant-design/icons'

import { propTypes } from '@innodoc/misc'
import appSelectors from '@innodoc/store/src/selectors'

import ToggleButton from './ToggleButton'
import css from './Sidebar.module.sss'

const WIDTHS = [300, 400] // width change on breakpoint

const Sidebar = ({ children }) => {
  const { sidebarVisible } = useSelector(appSelectors.getApp)
  const { xl } = Grid.useBreakpoint()
  const width = xl ? WIDTHS[1] : WIDTHS[0]

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
          <div className={css.closeButton} style={{ marginLeft: `${width - 48}px` }}>
            <ToggleButton icon={<DoubleLeftOutlined />} />
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
Sidebar.propTypes = { children: propTypes.childrenType }

export default Sidebar
