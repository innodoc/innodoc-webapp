import React from 'react'
import PropTypes from 'prop-types'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'

import { propTypes, util } from '@innodoc/client-misc'

import Card from './Card'

const InfoCard = ({ attributes, content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={util.getNumberedTitle(t('content.info'), attributes)}
      cardType="info"
      icon={<InfoCircleOutlined />}
      content={content}
      id={id}
    />
  )
}

InfoCard.propTypes = {
  attributes: propTypes.attributeType.isRequired,
  content: propTypes.contentType.isRequired,
  id: PropTypes.string,
}

InfoCard.defaultProps = {
  id: null,
}

export default InfoCard
