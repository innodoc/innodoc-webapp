import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import appSelectors from '@innodoc/client-store/src/selectors'
import { astToString } from '@innodoc/client-misc/src/util'

const Image = ({ data }) => {
  const { staticRoot } = useSelector(appSelectors.getApp)

  try {
    const [[id], content, [src, alt]] = data
    const imgSrc = /^https?:\/\//i.test(src) ? src : `${staticRoot}${src}`
    const imgAlt = alt || astToString(content)
    return <img id={id} src={imgSrc} alt={imgAlt} />
  } catch (err) {
    return null
  }
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Image
