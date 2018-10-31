import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AntLayout from 'antd/lib/layout'
import { withNamespaces } from 'react-i18next'

import uiSelectors from '../../../store/selectors/ui'
import contentSelectors from '../../../store/selectors/content'
import { tocTreeType } from '../../../lib/propTypes'
import Toc from '../../Toc'
import css from './style.sass'

// width change on breakpoint
const WIDTHS = [300, 400]

class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    toc: tocTreeType.isRequired,
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
    const {
      visible,
      toc,
      t,
    } = this.props
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
          <div className={css.tocWrapper}>
            <Toc toc={toc} header={t('sidebar.courseContent')} />
          </div>
        </div>
      </AntLayout.Sider>
    )
  }
}

const mapStateToProps = state => ({
  toc: contentSelectors.getToc(state),
  visible: uiSelectors.getSidebarVisible(state),
})

export { Sidebar } // for testing
export default connect(mapStateToProps)(withNamespaces()(Sidebar))
