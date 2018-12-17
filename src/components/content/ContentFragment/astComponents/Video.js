import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import ContentFragment from '..'
import appSelectors from '../../../../store/selectors/app'
import { astToString } from '../../../../lib/util'
import css from './style.sass'

const Video = ({ data, staticRoot }) => {
  const [[, classes], content, [src, title]] = data

  const cf = (<ContentFragment content={content} />)
  const videoTitle = title || astToString(content)

  if (classes.includes('video-youtube')) {
    let id = src.split('v=')[1]
    const ampersandPos = id.indexOf('&')
    if (ampersandPos !== -1) {
      id = id.substring(0, ampersandPos)
    }

    return (
      <span className={classNames(css.ytVideoWrapper)}>
        <iframe
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={classNames(css.ytVideo)}
          frameBorder="0"
          src={`https://www.youtube.com/embed/${id}`}
          title={videoTitle}
        >
          {cf}
        </iframe>
      </span>
    )
  }

  // Video file(video-static)
  const videoSrc = /^https?:\/\//i.test(src)
    ? src
    : `${staticRoot}${src.startsWith('/') ? src.substr(1) : src}`
  return (
    <video controls src={videoSrc}>
      {cf}
    </video>
  )
}

Video.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  staticRoot: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  staticRoot: appSelectors.getStaticRoot(state),
})

export { Video } // for testing
export default connect(mapStateToProps)(Video)
