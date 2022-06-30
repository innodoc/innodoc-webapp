import React from 'react'
import PropTypes from 'prop-types'
import { InfoCircleOutlined } from '@ant-design/icons'

import { useTranslation } from 'next-i18next'
import { attributeType, contentType } from '@innodoc/client-misc/src/propTypes'
import { getNumberedTitle } from '@innodoc/client-misc/src/util'

import Card from './Card'

const InfoCard = ({ attributes, content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={getNumberedTitle(t('content.info'), attributes)}
      cardType="info"
      icon={<InfoCircleOutlined />}
      content={content}
      id={id}
    />
  )
}

InfoCard.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  id: PropTypes.string,
}

InfoCard.defaultProps = {
  id: null,
}

export default InfoCard
