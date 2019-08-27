import React from 'react'
import PropTypes from 'prop-types'

import { unwrapPara } from '@innodoc/client-misc/src/util'

import ContentFragment from '..'
import ImageTag from './Image'
import css from './style.sass'

const Figure = ({ content }) => {
  const imgData = unwrapPara(content)[0].c
  const [, captionContent] = imgData
  const caption = captionContent.length
    ? (
      <figcaption>
        <ContentFragment content={captionContent} />
      </figcaption>
    )
    : null

  return (
    <figure className={css.figure}>
      <ImageTag data={imgData} />
      {caption}
    </figure>
  )
}

Figure.propTypes = {
  content: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Figure
