import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const InfoCard = ({ t, content }) => (
  <Card
    title={t('content.info')}
    cardType="info"
    iconType="info-circle"
    content={content}
  />
)

InfoCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(InfoCard)
