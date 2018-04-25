import React from 'react'
import PropTypes from 'prop-types'
import Sidebar from 'react-sidebar'

import PageLink from '../PageLink'

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

    const aStyle = {
      display: 'block',
      padding: '0.7rem 2.8rem',
      marginBottom: '0.3rem',
      fontSize: '160%',
      backgroundColor: '#ececec',
    }
    const sidebarLis = navTree.map((l, i) =>
      <li key={i.toString()}>
        <PageLink id={l.id}>
          <a style={aStyle}>{l.title}</a>
        </PageLink>
      </li>
    )

    const ulStyle = {
      listStyleType: 'none',
      padding: 0,
      margin: '1rem 0',
    }
    const sidebarContent = <ul style={ulStyle}>{sidebarLis}</ul>

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
