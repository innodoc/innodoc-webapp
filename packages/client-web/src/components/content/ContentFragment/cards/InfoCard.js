import React from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { contentType } from '@innodoc/client-misc/src/propTypes'

import Card from './Card'

const InfoCard = ({ content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={t('content.info')}
      cardType="info"
      icon="info-circle"
      content={content}
      id={id}
    />
  )
}

InfoCard.propTypes = {
  content: contentType.isRequired,
  id: PropTypes.string,
}

InfoCard.defaultProps = {
  id: null,
}

export default InfoCard
