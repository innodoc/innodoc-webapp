import React from 'react'
import PropTypes from 'prop-types'
import Icon from '@ant-design/icons'

import { useTranslation } from 'next-i18next'
import { contentType } from '@innodoc/client-misc/src/propTypes'

import KeyboardSvg from '@fortawesome/fontawesome-free/svgs/regular/keyboard.svg'
import Card from './Card'

const InputHintCard = ({ content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={t('content.inputHint')}
      cardType="inputHint"
      icon={<Icon component={KeyboardSvg} />}
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
