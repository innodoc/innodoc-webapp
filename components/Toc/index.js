import React from 'react'
import PropTypes from 'prop-types'
import {Divider, Menu, Icon} from 'semantic-ui-react'

import PageLink from '../PageLink'
import css from './style.sass'

export default class Toc extends React.Component {
  static propTypes = {
    navTree: PropTypes.array.isRequired,
    onSidebarToggleClick: PropTypes.func.isRequired,
  }

  render() {
    const sidebarNavItems = this.props.navTree.map((l, i) =>
      <PageLink pageSlug={l.pageSlug} key={i.toString()}>
        <Menu.Item>
          {l.title}
        </Menu.Item>
      </PageLink>
    )

    return (
      <Menu vertical className={css.toc}>
        {sidebarNavItems}
      </Menu>
    )
  }
}
