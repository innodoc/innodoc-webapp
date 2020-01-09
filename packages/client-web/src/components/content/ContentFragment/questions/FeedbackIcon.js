import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import css from './style.sss'

const FeedbackIcon = ({ correct }) => {
  const { t } = useTranslation()
  const color = correct ? css['color-correct'] : css['color-incorrect']
  const theme = correct === null ? 'outlined' : 'twoTone'
  const twoToneColor = correct === null ? 'black' : color
  const iconType = correct ? 'check-circle' : 'close-circle'
  const type = correct === null ? 'ellipsis' : iconType
  const title = correct ? 'correct' : 'incorrect'
  return (
    <Icon
      title={t(
        `questions.feedback.${correct === null ? 'indeterminate' : title}`
      )}
      theme={theme}
      twoToneColor={twoToneColor}
      type={type}
    />
  )
}

FeedbackIcon.propTypes = {
  correct: PropTypes.bool,
}

FeedbackIcon.defaultProps = {
  correct: null,
}

export default FeedbackIcon
