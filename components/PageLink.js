import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export default class PageLink extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  }

  render() {
    return (
      <Link as={`/page/${this.props.id}`}
            href={`/post?title=${this.props.id}`}>
            {this.props.children}
      </Link>
    )
  }

}
