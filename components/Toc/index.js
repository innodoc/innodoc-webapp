import React from 'react'
import PropTypes from 'prop-types'
import {Menu} from 'semantic-ui-react'

import PageLink from '../PageLink'
import css from './style.sass'

export default class Toc extends React.Component {
  static propTypes = {
    navTree: PropTypes.array.isRequired,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    navTree: [
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
    ],
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
      <Menu vertical fluid className={css.toc}>
        {sidebarNavItems}
      </Menu>
    )
  }
}
