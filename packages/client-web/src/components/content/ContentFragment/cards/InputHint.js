import React from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { contentType } from '@innodoc/client-misc/src/propTypes'

import KeyboardSvg from '../../../../static/img/keyboard-o.svg'
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
