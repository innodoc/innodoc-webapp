import { Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import css from './ast.module.sss'

function StaticVideo({ src }) {
  const { t } = useTranslation()
  const videoSrc = /^https?:\/\//i.test(src)
    ? src
    : `${process.env.NEXT_PUBLIC_STATIC_ROOT}${src.startsWith('/') ? src.substr(1) : src}`
  /* eslint-disable jsx-a11y/media-has-caption */
  return (
    <video controls src={videoSrc} className={css.video}>
      {t('content.noHtml5Video', { src })}
    </video>
  )
}

StaticVideo.propTypes = { src: PropTypes.string.isRequired }

const ytIdRegexp = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^?&"'>]+)/

function YouTubeVideo({ src, title }) {
  // TODO
  // const { language } = useSelector(getApp)
  const language = 'en'
  const { t } = useTranslation()
  const match = ytIdRegexp.exec(src)
  if (!match) {
    return <Typography.Text type="danger">{t('content.ytIdError', { src })}</Typography.Text>
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

function Video({ data }) {
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
