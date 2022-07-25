import PropTypes from 'prop-types'

import { unwrapPara } from '@innodoc/misc/utils'

import ContentFragment from '../ContentFragment.jsx'

import css from './ast.module.sss'
import ImageTag from './Image.jsx'

function Figure({ content }) {
  const imgData = unwrapPara(content)[0].c
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
