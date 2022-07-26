import { DoubleLeftOutlined } from '@ant-design/icons'
import { Grid, Layout as AntLayout } from 'antd'
import { useSelector } from 'react-redux'

import { childrenType } from '@innodoc/misc/propTypes'
import { selectSidebarVisible } from '@innodoc/store/selectors/ui'

import css from './Sidebar.module.sss'
import ToggleButton from './ToggleButton.jsx'

const WIDTHS = [300, 400] // width change on breakpoint

function Sidebar({ children }) {
  const sidebarVisible = useSelector(selectSidebarVisible)
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
Sidebar.propTypes = { children: childrenType }

export default Sidebar
