import React from 'react'
import PropTypes from 'prop-types'
import Icon, { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'

import { useTranslation } from 'next-i18next'

import css from './style.sss'

const EmptyIcon = () => <span className={css.emptyIcon} />

const FeedbackIcon = ({ className, isCorrect }) => {
  const { t } = useTranslation()
  if (isCorrect === null) {
    return <Icon component={EmptyIcon} />
  }
  const IconComp = isCorrect ? CheckCircleTwoTone : CloseCircleTwoTone
  return (
    <IconComp
      className={className}
      title={t(`questions.feedbackIcon.${isCorrect ? 'correct' : 'incorrect'}`)}
      twoToneColor={css[isCorrect ? 'color-correct' : 'color-incorrect']}
    />
  )
}

FeedbackIcon.defaultProps = {
  className: null,
  isCorrect: null,
}

FeedbackIcon.propTypes = {
  className: PropTypes.string,
  isCorrect: PropTypes.bool,
}

export default FeedbackIcon
