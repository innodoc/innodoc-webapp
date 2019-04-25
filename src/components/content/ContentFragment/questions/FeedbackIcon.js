import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'antd/lib/icon'
import { withNamespaces } from 'react-i18next'

import css from './style.sass'

const FeedbackIcon = ({ correct, t }) => {
  const color = correct ? css['color-correct'] : css['color-incorrect']
  const theme = correct === null ? 'outlined' : 'twoTone'
  const twoToneColor = correct === null ? 'black' : color
  const iconType = correct ? 'check-circle' : 'close-circle'
  const type = correct === null ? 'ellipsis' : iconType
  const title = correct ? 'correct' : 'incorrect'
  return (
    <Icon
      title={t(`questions.feedback.${correct === null ? 'indeterminate' : title}`)}
      theme={theme}
      twoToneColor={twoToneColor}
      type={type}
    />
  )
}

FeedbackIcon.propTypes = {
  correct: PropTypes.bool,
  t: PropTypes.func.isRequired,
}

FeedbackIcon.defaultProps = {
  correct: null,
}

export default withNamespaces()(FeedbackIcon)
