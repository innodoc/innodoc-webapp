import React from 'react'
import PropTypes from 'prop-types'
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EllipsisOutlined,
} from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import css from './style.sss'

const FeedbackIcon = ({ correct }) => {
  const { t } = useTranslation()
  if (correct === null) {
    return <EllipsisOutlined title={t('questions.feedback.indeterminate')} />
  }
  const Icon = correct ? CheckCircleTwoTone : CloseCircleTwoTone
  return (
    <Icon
      title={t(`questions.feedback.${correct ? 'correct' : 'incorrect'}`)}
      twoToneColor={css[correct ? 'color-correct' : 'color-incorrect']}
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
