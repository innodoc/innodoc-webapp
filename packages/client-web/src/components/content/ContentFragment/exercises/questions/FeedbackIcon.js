import React from 'react'
import { CheckCircleTwoTone, CloseCircleTwoTone, EllipsisOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import { resultType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sss'

const FeedbackIcon = ({ result }) => {
  const { t } = useTranslation()
  if (result === RESULT_VALUE.NEUTRAL) {
    return <EllipsisOutlined title={t('questions.feedbackIcon.indeterminate')} />
  }
  const correct = result === RESULT_VALUE.CORRECT
  const Icon = correct ? CheckCircleTwoTone : CloseCircleTwoTone
  return (
    <Icon
      title={t(`questions.feedbackIcon.${correct ? 'correct' : 'incorrect'}`)}
      twoToneColor={css[correct ? 'color-correct' : 'color-incorrect']}
    />
  )
}

FeedbackIcon.propTypes = {
  result: resultType.isRequired,
}

export default FeedbackIcon
