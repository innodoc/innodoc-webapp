import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AntLayout from 'antd/lib/layout'
import Button from 'antd/lib/button'
import { withNamespaces } from 'react-i18next'

import uiSelectors from '../../../store/selectors/ui'
import { toggleSidebar } from '../../../store/actions/ui'
import Toc from '../../Toc'
import css from './style.sass'

// TODO: sticky sidebar content?

// width change on breakpoint
const WIDTHS = [300, 400]

class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchToggleSidebar: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.onBreak = this.onBreak.bind(this)
    this.state = { width: WIDTHS[0] }
  }

  onBreak(broken) {
    this.setState(prevState => ({
      ...prevState,
      width: broken ? WIDTHS[0] : WIDTHS[1],
    }))
  }

  render() {
    const { visible, t, dispatchToggleSidebar } = this.props
    const { width } = this.state

    return (
      <AntLayout.Sider
        collapsible
        collapsed={!visible}
        width={width}
        collapsedWidth={0}
        trigger={null}
        className={css.sidebar}
        onBreakpoint={this.onBreak}
        breakpoint="xl"
      >
        <div style={{ minWidth: width }}>
          <div>
            <div>
              <Button
                title={t('sidebar.collapseButton')}
                onClick={dispatchToggleSidebar}
                className={css.collapseButton}
                icon="close"
                shape="circle"
                size="small"
              />
              <Toc header={t('sidebar.courseContent')} />
            </div>
          </div>
        </div>
      </AntLayout.Sider>
    )
  }
}

const mapStateToProps = state => ({
  visible: uiSelectors.getSidebarVisible(state),
})

const mapDispatchToProps = {
  dispatchToggleSidebar: toggleSidebar,
}

export { Sidebar } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(Sidebar))
