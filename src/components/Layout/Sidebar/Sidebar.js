import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Menu, Transition } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { selectors as uiSelectors } from '../../../store/reducers/ui'
import { selectors as contentSelectors } from '../../../store/reducers/content'
import { childrenType, tocTreeType } from '../../../lib/propTypes'
import { toggleSidebar } from '../../../store/actions/ui'
import SidebarToggle from './SidebarToggle'
import Main from '../Main'
import Toc from '../../Toc'
import css from './style.sass'

const Sidebar = (props) => {
  const {
    children,
    visible,
    onSidebarToggleClick,
    toc,
    t,
  } = props

  // The ugly <style> tag creates a more specific CSS class to override
  // semantic-ui styles that use !important everywhere

  return (
    <React.Fragment>
      <style>
        {`
          .${css.sidebar}.transition { display: flex !important }
        `}
      </style>
      <Transition visible={!visible} animation="fade right">
        <SidebarToggle onClick={onSidebarToggleClick} title={t('sidebar.showMenu')} />
      </Transition>
      <Transition visible={visible} animation="fade right">
        <Menu
          vertical
          fixed="left"
          size="massive"
          className={css.sidebar}
        >
          <Menu.Item onClick={onSidebarToggleClick}>
            {t('sidebar.close')}
            <Icon name="close" />
          </Menu.Item>
          <Menu.Item className={css.sidebarContent}>
            <Menu.Header>
              {t('sidebar.courseContent')}
            </Menu.Header>
            <Toc as={Menu.Menu} toc={toc} />
          </Menu.Item>
        </Menu>
      </Transition>
      <Main>
        {children}
      </Main>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  children: childrenType.isRequired,
  onSidebarToggleClick: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  toc: tocTreeType.isRequired,
}

const mapStateToProps = state => ({
  toc: contentSelectors.getToc(state),
  visible: uiSelectors.getSidebarVisible(state),
})

const mapDispatchToProps = {
  onSidebarToggleClick: toggleSidebar,
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Sidebar))
