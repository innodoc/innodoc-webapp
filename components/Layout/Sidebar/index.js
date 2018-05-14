import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Icon, Menu, Transition} from 'semantic-ui-react'

import SidebarToggle from './SidebarToggle'
import Content from '../Content'
import Toc from '../../Toc'
import {toggleSidebar} from '../../../store/actions'
import css from './style.sass'

class InnodocSidebar extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    navTree: PropTypes.array,
    onSidebarToggleClick: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  render() {
    const {
      children,
      navTree,
      visible,
      onSidebarToggleClick,
    } = this.props

    return (
      <React.Fragment>
        <Transition visible={!visible} animation="fade right">
          <SidebarToggle onClick={onSidebarToggleClick} />
        </Transition>
        <Transition visible={visible} animation="fade right">
          <Menu vertical fixed="left" className={css.sidebar}>
            <Menu.Item onClick={onSidebarToggleClick}>
              Menü ausblenden
              <Icon name="close" />
            </Menu.Item>
            <Menu.Item>
              <Menu.Header>Kursinhalt</Menu.Header>
              <Toc navTree={navTree} as={Menu.Menu} />
            </Menu.Item>
          </Menu>
        </Transition>
        <Content>
          {children}
        </Content>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  visible: state.sidebarVisible,
})

const mapDispatchToProps = dispatch => ({
  onSidebarToggleClick: () => { dispatch(toggleSidebar()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(InnodocSidebar)
