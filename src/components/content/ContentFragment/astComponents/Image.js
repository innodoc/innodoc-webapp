import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import appSelectors from '../../../../store/selectors'
import { astToString } from '../../../../lib/util'

const Image = ({ data }) => {
  const { staticRoot } = useSelector(appSelectors.getApp)
  const [[id], content, [src, alt]] = data

  const imgSrc = /^https?:\/\//i.test(src)
    ? src
    : `${staticRoot}${src}`
  const imgAlt = alt || astToString(content)

  return <img id={id} src={imgSrc} alt={imgAlt} />
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Image
