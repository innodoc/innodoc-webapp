import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Container,
  Dropdown,
  Flag,
  Icon,
  Image,
  Menu,
} from 'semantic-ui-react'
import Link from 'next/link'
import { translate, Trans } from 'react-i18next'

import css from './style.sass'
import { changeLanguage } from '../../../store/actions/i18n'

const Header = ({ t, dispatchChangeLanguage }) => (
  <Menu stackable className={css.menu}>
    <Container>
      <Link href="/">
        <Menu.Item as="a" header>
          <Image
            className={css.headerLogo}
            size="mini"
            src="/static/img/m4r-logo-simple.png"
          />
          <Trans i18nKey="header.preparatoryMathematicsCourse">
            Preparatory Mathematics
            <br />
            Course
          </Trans>
        </Menu.Item>
      </Link>
      <Link href="/about">
        <Menu.Item as="a" header>
          <Icon name="info" size="large" />
          {t('header.aboutTheCourse')}
        </Menu.Item>
      </Link>
      <Menu.Item as="a" header>
        <Icon name="file pdf outline" size="large" />
        {t('header.downloadPDF')}
      </Menu.Item>

      <Menu.Menu position="right">
        <Dropdown item simple text={t('header.login')}>
          <Dropdown.Menu>
            <Dropdown.Item icon="user" text={t('header.login')} />
            <Dropdown.Item icon="add user" text={t('header.createAccount')} />
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item simple text={t('header.language')}>
          <Dropdown.Menu>
            <Dropdown.Item
              icon={<Flag name="gb" />}
              text={t('header.linkEN')}
              onClick={() => { dispatchChangeLanguage('en') }}
            />
            <Dropdown.Item
              icon={<Flag name="de" />}
              text={t('header.linkDE')}
              onClick={() => { dispatchChangeLanguage('de') }}
            />
          </Dropdown.Menu>
        </Dropdown>
        <div className="ui right aligned category search item">
          <div className="ui transparent icon input">
            <input className="prompt" type="text" placeholder={t('header.searchPlaceholder')} />
            <i className="search link icon" />
          </div>
          <div className="results" />
        </div>
      </Menu.Menu>
    </Container>
  </Menu>
)

Header.propTypes = {
  t: PropTypes.func.isRequired,
  dispatchChangeLanguage: PropTypes.func.isRequired,
}

const mapDispatchToProps = { dispatchChangeLanguage: changeLanguage }

export { Header } // for testing
export default connect(null, mapDispatchToProps)(translate()(Header))
