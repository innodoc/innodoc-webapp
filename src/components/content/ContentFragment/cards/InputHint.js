import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import KeyboardSvg from '../../../../static/img/keyboard-o.svg'
import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const InputHintCard = ({ t, content }) => (
  <Card
    title={t('content.inputHint')}
    cardType="inputHint"
    icon={KeyboardSvg}
    content={content}
  />
)

InputHintCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(InputHintCard)
