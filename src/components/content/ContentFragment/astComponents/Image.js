import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import appSelectors from '../../../../store/selectors/app'
import { astToString } from '../../../../lib/util'

const Image = ({ staticRoot, data }) => {
  const [, content, [src, alt]] = data

  const imgSrc = /^https?:\/\//i.test(src)
    ? src
    : `${staticRoot}${src}`
  const imgAlt = alt || astToString(content)

  return <img src={imgSrc} alt={imgAlt} />
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  staticRoot: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  staticRoot: appSelectors.getStaticRoot(state),
})

export { Image } // for testing
export default connect(mapStateToProps)(Image)
