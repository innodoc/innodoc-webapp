import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'

import { tocTreeType } from '../lib/propTypes'
import { loadToc } from '../store/actions/content'
import PageLink from './PageLink'

class Toc extends React.Component {
  static propTypes = {
    navTree: tocTreeType.isRequired,
    as: PropTypes.func.isRequired,
  }

  static getInitialProps({ store }) {
    store.dispatch(loadToc())
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    as: Menu,
    navTree: [
      {
        section: 'vbkm01',
        title: 'Kapitel 1',
      },
      {
        section: 'exercises',
        title: 'Exercises',
      },
      {
        section: 'vbkm01_exercises',
        title: 'vbkm01_exercises',
      },
      {
        section: 'test',
        title: 'Test',
      },
    ],
  }

  render() {
    const { navTree, as: ElementType, ...otherProps } = this.props

    const sidebarNavItems = navTree.map((l, i) => (
      <PageLink section={l.section} key={i.toString()}>
        <Menu.Item>
          {l.title}
        </Menu.Item>
      </PageLink>)
    )

    return (
      <ElementType {...otherProps}>
        {sidebarNavItems}
      </ElementType>
    )
  }
}

const mapStateToProps = state => ({
  toc: state.stoc,
})

export default connect(mapStateToProps)(Toc)
