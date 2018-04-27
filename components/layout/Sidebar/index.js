import React from 'react'
import PropTypes from 'prop-types'
import Sidebar from 'react-sidebar'

import PageLink from '../../PageLink'
import css from './style.sass'

export default class InnodocSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mql: null,
      docked: true,
      open: true,
    }

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this)
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
  }

  static propTypes = {
    navTree: PropTypes.array,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open })
  }

  componentDidMount() {
    const mql = window.matchMedia(`(min-width: 800px)`)
    mql.addListener(this.mediaQueryChanged)
    this.setState({
      mql: mql,
      sidebarDocked: mql.matches
    })
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged)
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: this.state.mql.matches })
  }

  render() {
    const { navTree, children } = this.props

    const sidebarNavItems = navTree.map((l, i) =>
      <li key={i.toString()}>
        <PageLink id={l.id}>
          <a>{l.title}</a>
        </PageLink>
      </li>
    )

    const sidebarContent = (
      <ul className={css.sidebarNav}>
        {sidebarNavItems}
      </ul>
    )

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               onSetOpen={this.onSetSidebarOpen}>
        {children}
      </Sidebar>
    )
  }
}
