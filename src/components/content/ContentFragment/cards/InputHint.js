import React from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from '../../../../lib/i18n'
import KeyboardSvg from '../../../../static/img/keyboard-o.svg'
import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const InputHintCard = ({ content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={t('content.inputHint')}
      cardType="inputHint"
      icon={KeyboardSvg}
      content={content}
      id={id}
    />
  )
}

InputHintCard.propTypes = {
  content: contentType.isRequired,
  id: PropTypes.string,
}

InputHintCard.defaultProps = {
  id: null,
}

export default InputHintCard
