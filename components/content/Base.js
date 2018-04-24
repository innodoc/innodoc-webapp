import React from 'react'
import PropTypes from 'prop-types'

class BaseContentComponent extends React.Component {
  render() {
    return null
  }
}
BaseContentComponent.propTypes = {
  data: PropTypes.any
}

export default BaseContentComponent
