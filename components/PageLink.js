import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export default class PageLink extends React.Component {
  static propTypes = {
    pageSlug: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const {pageSlug} = this.props
    return (
      <Link href={{ pathname: '/page', query: { pageSlug } }}
            as={`/page/${pageSlug}`}>
            {this.props.children}
      </Link>
    )
  }
}
