import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '..'
import ImageTag from './Image'
import css from './style.sass'

const Figure = ({ content }) => {
  // unwrap Para
  const { c: imgData } = content[0].t === 'Para' ? content[0].c[0] : content[0]
  const [, captionContent] = imgData
  const caption = captionContent.length
    ? <figcaption><ContentFragment content={captionContent} /></figcaption>
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
