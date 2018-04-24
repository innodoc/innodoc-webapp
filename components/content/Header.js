import React from 'react'
import PropTypes from 'prop-types'

class Header extends React.Component {
  render() {
    return <h1>Header</h1>
  }
}
Header.propTypes = {
  data: PropTypes.array.isRequired
}

export default Header
