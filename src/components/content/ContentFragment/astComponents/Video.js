import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import withI18next from '../../../hoc/withI18next'
import ContentFragment from '..'
import appSelectors from '../../../../store/selectors/app'
import { astToString } from '../../../../lib/util'
import css from './style.sass'

const ytIdRegexp = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^?&"'>]+)/

const Video = ({
  data,
  staticRoot,
  currentLanguage,
  t,
}) => {
  const [[, classes], content, [src, title]] = data

  const cf = (<ContentFragment content={content} />)

  if (classes.includes('video-youtube')) {
    const match = ytIdRegexp.exec(src)
    if (!match) {
      return (
        <span className={css.errorBGColor}>
          {t('content.ytIdError', { src })}
        </span>
      )
    }
    const ytId = match[5]
    const videoTitle = title || astToString(content)

    const iframeSrc = `https://www.youtube.com/embed/${ytId}?hl=${currentLanguage}&cc_lang_pref=${currentLanguage}&rel=0&modestbranding=1`

    return (
      <span className={css.ytVideoWrapper}>
        <iframe
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={css.ytVideo}
          frameBorder="0"
          src={iframeSrc}
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
  /* eslint-disable jsx-a11y/media-has-caption */
  return (
    <video controls src={videoSrc} className={css.video}>
      {cf}
    </video>
  )
}

Video.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  staticRoot: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  currentLanguage: appSelectors.getLanguage(state),
  staticRoot: appSelectors.getStaticRoot(state),
})

export default connect(mapStateToProps)(
  withI18next()(Video)
)
