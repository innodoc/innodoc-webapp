import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Menu, Transition } from 'semantic-ui-react'
import { withNamespaces } from 'react-i18next'

import i18nSelectors from '../../../store/selectors/i18n'
import uiSelectors from '../../../store/selectors/ui'
import contentSelectors from '../../../store/selectors/content'
import { childrenType, tocTreeType } from '../../../lib/propTypes'
import { toggleSidebar } from '../../../store/actions/ui'
import Main from '../Main'
import Toc from '../../Toc'
import css from './style.sass'

const Sidebar = (props) => {
  const {
    children,
    visible,
    onSidebarToggleClick,
    toc,
    language,
    t,
  } = props

  // The ugly <style> tag creates a more specific CSS class to override
  // semantic-ui styles that use !important everywhere

  console.log(toc)
  console.log(language)

  return (
    <React.Fragment>
      <style>
        {`
          .${css.sidebar}.transition { display: flex !important }
        `}
      </style>
      <Transition visible={visible} animation="fade left">
        <Menu
          vertical
          fixed="right"
          size="massive"
          className={css.sidebar}
        >
          <Menu.Item onClick={onSidebarToggleClick}>
            {t('sidebar.close')}
            <Icon name="close" />
          </Menu.Item>
          <Menu.Item className={css.sidebarContent}>
            <Toc as={Menu.Menu} toc={toc} language={language} header={t('sidebar.courseContent')} />
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
  language: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  toc: contentSelectors.getToc(state),
  language: i18nSelectors.getLanguage(state),
  visible: uiSelectors.getSidebarVisible(state),
})

const mapDispatchToProps = {
  onSidebarToggleClick: toggleSidebar,
}

export { Sidebar } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(Sidebar))
