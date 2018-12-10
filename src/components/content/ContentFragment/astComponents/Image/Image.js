import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import appSelectors from '../../../../../store/selectors/app'
import courseSelectors from '../../../../../store/selectors/course'

import { courseType } from '../../../../../lib/propTypes'
import css from './style.sass'
import ContentFragment from '../..'

const Image = ({
  contentRoot,
  course,
  data,
  language,
}) => {
  const [[, classes], content, [src, alt]] = data

  let displaySrc = src
  if (!src.startsWith('http')) {
    displaySrc = contentRoot
    if (classes.includes('localized')) {
      displaySrc += `${language}/`
    }
    displaySrc += '_static'
    if (!src.startsWith('/')) {
      displaySrc += `/${course.currentSectionId}/`
    }
    displaySrc += src
  }

  const img = (
    <img src={displaySrc} alt={alt} className={classNames([...classes, css.contentImage])} />
  )
  return content.length > 0
    ? (
      <span className={css.imageContainer}>
        {img}
        <span className={css.imageCaption}>
          <ContentFragment content={content} />
        </span>
      </span>
    )
    : img
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  contentRoot: PropTypes.string.isRequired,
  course: courseType.isRequired,
  language: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  contentRoot: appSelectors.getContentRoot(state),
  course: courseSelectors.getCurrentCourse(state),
  language: appSelectors.getLanguage(state),
})

export { Image } // for testing
export default connect(mapStateToProps)(Image)
