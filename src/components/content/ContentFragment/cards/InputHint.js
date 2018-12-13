import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import KeyboardSvg from '../../../../static/img/keyboard-o.svg'
import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const InputHintCard = ({ t, content, id }) => (
  <Card
    title={t('content.inputHint')}
    cardType="inputHint"
    icon={KeyboardSvg}
    content={content}
    id={id}
  />
)

InputHintCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
}

InputHintCard.defaultProps = {
  id: null,
}

export default withNamespaces()(InputHintCard)
