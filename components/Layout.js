import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    )
  }

}
