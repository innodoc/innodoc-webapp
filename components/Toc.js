import React from 'react'
import PropTypes from 'prop-types'
import {Menu} from 'semantic-ui-react'

import PageLink from './PageLink'

export default class Toc extends React.Component {
  static propTypes = {
    navTree: PropTypes.array.isRequired,
    as: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    as: Menu,
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
    const { navTree, as: ElementType, ...otherProps } = this.props

    const sidebarNavItems = navTree.map((l, i) =>
      <PageLink pageSlug={l.pageSlug} key={i.toString()}>
        <Menu.Item>
          {l.title}
        </Menu.Item>
      </PageLink>
    )

    return (
      <ElementType {...otherProps}>
        {sidebarNavItems}
      </ElementType>
    )
  }
}
