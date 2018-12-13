import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const InfoCard = ({ t, content, id }) => (
  <Card
    title={t('content.info')}
    cardType="info"
    icon="info-circle"
    content={content}
    id={id}
  />
)

InfoCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
}

InfoCard.defaultProps = {
  id: null,
}

export default withNamespaces()(InfoCard)
