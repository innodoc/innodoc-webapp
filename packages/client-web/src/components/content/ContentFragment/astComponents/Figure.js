import React from 'react'
import PropTypes from 'prop-types'

import { util } from '@innodoc/client-misc'

import ContentFragment from '..'
import ImageTag from './Image'
import css from './ast.module.sss'

const Figure = ({ content }) => {
  const imgData = util.unwrapPara(content)[0].c
  const [, captionContent] = imgData
  const caption = captionContent.length ? (
    <figcaption>
      <ContentFragment content={captionContent} />
    </figcaption>
  ) : null

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
