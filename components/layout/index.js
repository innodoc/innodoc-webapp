import React from 'react'
import PropTypes from 'prop-types'
import {Button, Container, Icon, Menu, Sidebar, Transition} from 'semantic-ui-react'
import {connect} from 'react-redux'

import css from './style.sass'
import Header from './Header'
import Footer from './Footer'
import Toc from '../Toc'
import {toggleSidebar} from '../../store/actions'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    onSidebarToggleClick: PropTypes.func.isRequired,
    sidebarVisible: PropTypes.bool.isRequired,
  }

  render() {
    const navTree = [
      {
        pageSlug: 'vbkm01',
        title: 'Kapitel 1',
      },
      {
        pageSlug: 'exercises',
        title: 'Exercises',
      },
      {
        pageSlug: 'vbkm01_exercises',
        title: 'vbkm01_exercises',
      },
      {
        pageSlug: 'test',
        title: 'Test',
      },
    ]

    const {sidebarVisible, onSidebarToggleClick} = this.props

    return (
      <div>
        <Header />
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
                   vertical
                   className={css.sidebar}>
            <div className={css.tocWrapper}>
              <Menu vertical fluid className={css.sidebarToggleInMenu}>
                <Menu.Item onClick={onSidebarToggleClick}>
                  Menü ausblenden
                  <Icon name="content" />
                </Menu.Item>
              </Menu>
              <Toc navTree={navTree}
                   onSidebarToggleClick={onSidebarToggleClick} />
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            <Container className={css.courseContent}>
              {this.props.children}
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sidebarVisible: state.sidebarVisible,
})

const mapDispatchToProps = dispatch => ({
  onSidebarToggleClick: () => { dispatch(toggleSidebar()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
