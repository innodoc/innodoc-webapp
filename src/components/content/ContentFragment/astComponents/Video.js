import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { useTranslation } from '../../../../lib/i18n'
import ContentFragment from '..'
import appSelectors from '../../../../store/selectors'
import { astToString } from '../../../../lib/util'
import css from './style.sass'

const ytIdRegexp = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^?&"'>]+)/

const Video = ({
  data,
  staticRoot,
  currentLanguage,
}) => {
  const { t } = useTranslation()
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

    let iframeSrc = `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`
    if (currentLanguage) {
      iframeSrc += `&hl=${currentLanguage}&cc_lang_pref=${currentLanguage}`
    }

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
  currentLanguage: PropTypes.string,
}

Video.defaultProps = {
  currentLanguage: undefined,
}

const mapStateToProps = (state) => {
  const app = appSelectors.getApp(state)
  return {
    currentLanguage: app.language,
    staticRoot: app.staticRoot,
  }
}

export default connect(mapStateToProps)(Video)
