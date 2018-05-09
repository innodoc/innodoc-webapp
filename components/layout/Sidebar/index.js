import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Button, Container, Icon, Menu, Sidebar, Transition} from 'semantic-ui-react'

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
    sidebarVisible: PropTypes.bool.isRequired,
  }

  render() {
    const {
      children,
      navTree,
      sidebarVisible,
      onSidebarToggleClick
    } = this.props

    return (
      <React.Fragment>
        <Transition visible={!sidebarVisible} animation="fade right" duration={500}>
          <Menu vertical compact className={css.sidebarToggle}>
            <Menu.Item onClick={onSidebarToggleClick} as={Button} icon>
              <Icon name="content" />
            </Menu.Item>
          </Menu>
        </Transition>
        <Sidebar.Pushable>
          <Sidebar animation="overlay"
                   width="wide"
                   visible={sidebarVisible}
                   className={css.sidebar}>
            <div className={css.tocWrapper}>
              <Menu vertical fluid className={css.sidebarToggleInMenu}>
                <Menu.Item onClick={onSidebarToggleClick}>
                  Menü ausblenden
                  <Icon name="content" />
                </Menu.Item>
              </Menu>
              <Toc navTree={navTree} />
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            <Container className={css.content}>
              {children}
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  sidebarVisible: state.sidebarVisible,
})

const mapDispatchToProps = dispatch => ({
  onSidebarToggleClick: () => { dispatch(toggleSidebar()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(InnodocSidebar)
