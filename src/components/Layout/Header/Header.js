import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Link from 'next/link'
import { withNamespaces, Trans } from 'react-i18next'
import { Layout as AntLayout, Menu } from 'antd'

import css from './style.sass'
import { changeLanguage } from '../../../store/actions/i18n'
import { toggleSidebar } from '../../../store/actions/ui'

const Header = ({ t, dispatchChangeLanguage, dispatchToggleSidebar }) => (
  <AntLayout.Header className="header">
    <div className="logo" />
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['2']}
      style={{ lineHeight: '64px' }}
    >
      <Menu.Item key="1">nav 1</Menu.Item>
      <Menu.Item key="2">nav 2</Menu.Item>
      <Menu.Item key="3">nav 3</Menu.Item>
    </Menu>
  </AntLayout.Header>
)

//   <Menu stackable className={css.menu}>
//     <Container>
//       <Link href="/">
//         <Menu.Item as="a" header>
//           <Image
//             className={css.headerLogo}
//             size="mini"
//             src="/static/img/m4r-logo-simple.png"
//           />
//           <Trans i18nKey="header.preparatoryMathematicsCourse">
//             Preparatory Mathematics
//             <br />
//             Course
//           </Trans>
//         </Menu.Item>
//       </Link>
//       <Link href="/about">
//         <Menu.Item as="a" header>
//           <Icon name="info" size="large" />
//           {t('header.aboutTheCourse')}
//         </Menu.Item>
//       </Link>
//       <Menu.Item as="a" title={t('header.downloadPDFTitle')} header>
//         <Icon name="file pdf outline" size="large" />
//         {t('header.downloadPDF')}
//       </Menu.Item>
//
//       <Menu.Menu position="right" className={css.rightMenu}>
//         <Dropdown item simple text={t('header.login')}>
//           <Dropdown.Menu>
//             <Dropdown.Item icon="user" text={t('header.login')} />
//             <Dropdown.Item icon="add user" text={t('header.createAccount')} />
//           </Dropdown.Menu>
//         </Dropdown>
//         <Dropdown item simple text={t('header.language')}>
//           <Dropdown.Menu>
//             <Dropdown.Item
//               icon={<Flag name="gb" />}
//               text={t('header.linkEN')}
//               onClick={() => { dispatchChangeLanguage('en') }}
//             />
//             <Dropdown.Item
//               icon={<Flag name="de" />}
//               text={t('header.linkDE')}
//               onClick={() => { dispatchChangeLanguage('de') }}
//             />
//           </Dropdown.Menu>
//         </Dropdown>
//         <div className="ui right aligned category search item">
//           <div className="ui transparent icon input">
//             <input className="prompt" type="text" placeholder={t('header.searchPlaceholder')} />
//             <i className="search link icon" />
//           </div>
//           <div className="results" />
//         </div>
//         <Menu.Item as="a" header icon title={t('header.showTOC')} onClick={dispatchToggleSidebar}>
//           <Icon name="content" size="large" />
//         </Menu.Item>
//       </Menu.Menu>
//     </Container>
//   </Menu>
// )

Header.propTypes = {
  t: PropTypes.func.isRequired,
  dispatchChangeLanguage: PropTypes.func.isRequired,
  dispatchToggleSidebar: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  dispatchChangeLanguage: changeLanguage,
  dispatchToggleSidebar: toggleSidebar,
}

export { Header } // for testing
export default connect(null, mapDispatchToProps)(withNamespaces()(Header))
