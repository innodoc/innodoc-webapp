import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import appSelectors from '../../../../store/selectors/app'
import { astToString } from '../../../../lib/util'

const Image = ({ contentRoot, data }) => {
  const [, content, [src, alt]] = data

  // TODO: introduce staticRoot
  const imgSrc = /^https?:\/\//i.test(src)
    ? src
    : `${contentRoot}_static/${src}`
  const imgAlt = alt || astToString(content)

  return <img src={imgSrc} alt={imgAlt} />
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  contentRoot: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  contentRoot: appSelectors.getContentRoot(state),
})

export { Image } // for testing
export default connect(mapStateToProps)(Image)
