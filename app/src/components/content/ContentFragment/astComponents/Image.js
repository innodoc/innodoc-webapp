import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import appSelectors from '@innodoc/store/src/selectors'
import { util } from '@innodoc/misc'

import css from './ast.module.sss'

const Image = ({ data }) => {
  const { staticRoot } = useSelector(appSelectors.getApp)

  try {
    const [[id], content, [src, alt]] = data
    const imgSrc = /^https?:\/\//i.test(src) ? src : `${staticRoot}${src}`
    const imgAlt = alt || util.astToString(content)
    return <img className={css.image} id={id} src={imgSrc} alt={imgAlt} />
  } catch (err) {
    return null
  }
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default Image
