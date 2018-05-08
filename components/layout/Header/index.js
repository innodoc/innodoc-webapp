import React from 'react'
import {Container, Divider, Dropdown, Image, Menu} from 'semantic-ui-react'
import Link from 'next/link'

import css from './style.sass'

const Header = () => (
  <Menu fixed="top">
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
          About
        </Menu.Item>
      </Link>

      <Menu.Menu position="right">
        <div className="ui right aligned category search item">
          <div className="ui transparent icon input">
            <input className="prompt" type="text" placeholder="Suche…" />
            <i className="search link icon" />
          </div>
          <div className="results" />
        </div>
      </Menu.Menu>
      <Divider />
      <Dropdown item simple text="Login">
        <Dropdown.Menu>
          <Dropdown.Item icon="user" text="Anmelden" />
          <Dropdown.Item icon="add user" text="Account erstellen" />
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  </Menu>
)

export default Header
