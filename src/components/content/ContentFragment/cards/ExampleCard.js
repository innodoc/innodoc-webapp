import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const ExampleCard = ({ t, content }) => (
  <Card
    title={t('content.example')}
    cardType="example"
    iconType="eye"
    content={content}
  />
)

ExampleCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(ExampleCard)
