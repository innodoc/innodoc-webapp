import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'

import css from './style.sss'

const StaticVideo = ({ src }) => {
  const { staticRoot } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()
  const videoSrc = /^https?:\/\//i.test(src)
    ? src
    : `${staticRoot}${src.startsWith('/') ? src.substr(1) : src}`
  /* eslint-disable jsx-a11y/media-has-caption */
  return (
    <video controls src={videoSrc} className={css.video}>
      <p>{t('content.noHtml5Video', { src })}</p>
    </video>
  )
}

StaticVideo.propTypes = { src: PropTypes.string.isRequired }

const ytIdRegexp = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^?&"'>]+)/

const YouTubeVideo = ({ src, title }) => {
  const { language } = useSelector(appSelectors.getApp)
  const { t } = useTranslation()
  const match = ytIdRegexp.exec(src)
  if (!match) {
    return (
      <span className={css.errorBGColor}>
        {t('content.ytIdError', { src })}
      </span>
    )
  }
  const ytId = match[5]
  return (
    <span className={css.ytVideoWrapper}>
      <iframe
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={css.ytVideo}
        frameBorder="0"
        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&hl=${language}&cc_lang_pref=${language}`}
        title={title}
      />
    </span>
  )
}

YouTubeVideo.defaultProps = { title: null }

YouTubeVideo.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
}

const Video = ({ data }) => {
  const [[, classes], , [src, title]] = data
  if (classes.includes('video-youtube')) {
    return <YouTubeVideo src={src} title={title} />
  }
  return <StaticVideo src={src} />
}

Video.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export { StaticVideo, YouTubeVideo }
export default Video
