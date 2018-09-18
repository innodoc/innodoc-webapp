import React from 'react'
import PropTypes from 'prop-types'
import { Dimmer, Loader } from 'semantic-ui-react'

import { getHocDisplayName } from '../../lib/util'

const withLoadingPlaceholder = PlaceholderComponent => (WrappedComponent) => {
  const WithLoadingPlaceholder = ({ loading, ...otherProps }) => {
    const content = loading
      ? <PlaceholderComponent />
      : <WrappedComponent {...otherProps} />
    return (
      <Dimmer.Dimmable dimmed={loading}>
        <Dimmer active={loading} inverted>
          <Loader active={loading} size="huge" />
        </Dimmer>
        {content}
      </Dimmer.Dimmable>
    )
  }

  WithLoadingPlaceholder.propTypes = { loading: PropTypes.bool.isRequired }
  WithLoadingPlaceholder.displayName = getHocDisplayName('WithLoadingPlaceholder', WrappedComponent)
  return WithLoadingPlaceholder
}

withLoadingPlaceholder.propTypes = { WrappedComponent: PropTypes.element }

export default withLoadingPlaceholder
