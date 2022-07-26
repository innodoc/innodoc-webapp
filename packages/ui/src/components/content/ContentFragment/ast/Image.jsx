import PropTypes from 'prop-types'

import { astToString } from '@innodoc/misc/utils'

import css from './ast.module.sss'

const Image = ({ data }) => {
  try {
    const [[id], content, [src, alt]] = data
    const imgSrc = /^https?:\/\//i.test(src) ? src : `${process.env.NEXT_PUBLIC_STATIC_ROOT}${src}`
    const imgAlt = alt || astToString(content)
    return <img className={css.image} id={id} src={imgSrc} alt={imgAlt} />
  } catch (err) {
    return null
  }
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Image
