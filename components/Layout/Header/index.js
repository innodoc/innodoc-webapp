import React from 'react'
import PropTypes from 'prop-types'
import {Container, Dropdown, Flag, Icon, Image, Menu} from 'semantic-ui-react'
import Link from 'next/link'
import {translate} from 'react-i18next'

import css from './style.sass'

class Header extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  render() {
    const {t, i18n} = this.props
    return (
      <Menu stackable className={css.menu}>
        <Container>
          <Link href="/">
            <Menu.Item as="a" header>
              <Image
                className={css.headerLogo}
                size="mini"
                src="/static/img/m4r-logo-simple.png"
              />
              {t('preparatoryMathematicsCourse')}
            </Menu.Item>
          </Link>
          <Link href="/about">
            <Menu.Item as="a" header>
              <Icon name="info" size="large" />
              {t('nav.aboutTheCourse')}
            </Menu.Item>
          </Link>
          <Menu.Item as="a" header>
            <Icon name="file pdf outline" size="large" />
            {t('nav.downloadPDF')}
          </Menu.Item>

          <Menu.Menu position="right">
            <Dropdown item simple text={t('nav.login')}>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text={t('nav.login')} />
                <Dropdown.Item icon="add user" text={t('nav.createAccount')} />
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown item simple text={t('nav.language')}>
              <Dropdown.Menu>
                <Dropdown.Item icon={<Flag name='gb' />}
                               text={t('nav.linkEN')}
                               onClick={() => { i18n.changeLanguage('en') }}
                />
                <Dropdown.Item icon={<Flag name='de' />}
                               text={t('nav.linkDE')}
                               onClick={() => { i18n.changeLanguage('de') }}
                />
              </Dropdown.Menu>
            </Dropdown>
            <div className="ui right aligned category search item">
              <div className="ui transparent icon input">
                <input className="prompt" type="text" placeholder={t('nav.searchPlaceholder')} />
                <i className="search link icon" />
              </div>
              <div className="results" />
            </div>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}

export default translate('common')(Header)
