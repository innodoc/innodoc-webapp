import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Menu, Transition } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { childrenType, tocTreeType } from '../../../lib/propTypes'
import { toggleSidebar } from '../../../store/actions/ui'
import SidebarToggle from './SidebarToggle'
import Content from '../Content'
import Toc from '../../Toc'

const Sidebar = (props) => {
  const {
    children,
    visible,
    onSidebarToggleClick,
    t,
  } = props
  return (
    <React.Fragment>
      <Transition visible={!visible} animation="fade right">
        <SidebarToggle onClick={onSidebarToggleClick} title={t('sidebar.showMenu')} />
      </Transition>
      <Transition visible={visible} animation="fade right">
        <Menu vertical fixed="left">
          <Menu.Item onClick={onSidebarToggleClick}>
            {t('sidebar.close')}
            <Icon name="close" />
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>{t('sidebar.courseContent')}</Menu.Header>
            <Toc as={Menu.Menu} />
          </Menu.Item>
        </Menu>
      </Transition>
      <Content>
        {children}
      </Content>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  children: childrenType.isRequired,
  onSidebarToggleClick: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  visible: state.ui.sidebarVisible,
})

const mapDispatchToProps = dispatch => ({
  onSidebarToggleClick: () => { dispatch(toggleSidebar()) },
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Sidebar))
