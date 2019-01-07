import React from 'react'
import PropTypes from 'prop-types'

import { getHocDisplayName } from '../../../lib/util'

const withLoadingPlaceholder = PlaceholderComponent => (WrappedComponent) => {
  const WithLoadingPlaceholder = ({ loading, ...otherProps }) => (
    loading ? <PlaceholderComponent /> : <WrappedComponent {...otherProps} />
  )
  WithLoadingPlaceholder.propTypes = { loading: PropTypes.bool.isRequired }
  WithLoadingPlaceholder.displayName = getHocDisplayName('WithLoadingPlaceholder', WrappedComponent)
  return WithLoadingPlaceholder
}

export default withLoadingPlaceholder
