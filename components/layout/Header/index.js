import React from 'react'
import {Container, Dropdown, Icon, Image, Menu} from 'semantic-ui-react'
import Link from 'next/link'

import css from './style.sass'

const Header = () => (
  <Menu stackable className={css.menu}>
    <Container>
      <Link href="/">
        <Menu.Item as="a" header>
          <Image
            className={css.headerLogo}
            size="mini"
            src="/static/img/m4r-logo-simple.png"
          />
          Onlinebrückenkurs<br/>Mathematik
        </Menu.Item>
      </Link>
      <Link href="/about">
        <Menu.Item as="a" header>
          <Icon name="info" size="large" />
          Über den Kurs
        </Menu.Item>
      </Link>
      <Menu.Item as="a" header>
        <Icon name="file pdf outline" size="large" />
        PDF
      </Menu.Item>

      <Menu.Menu position="right">
        <Dropdown item simple text="Login">
          <Dropdown.Menu>
            <Dropdown.Item icon="user" text="Anmelden" />
            <Dropdown.Item icon="add user" text="Account erstellen" />
          </Dropdown.Menu>
        </Dropdown>
        <div className="ui right aligned category search item">
          <div className="ui transparent icon input">
            <input className="prompt" type="text" placeholder="Suche…" />
            <i className="search link icon" />
          </div>
          <div className="results" />
        </div>
      </Menu.Menu>
    </Container>
  </Menu>
)

export default Header
