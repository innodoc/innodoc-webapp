import React from 'react'
import PropTypes from 'prop-types'
import { EyeOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'

import { propTypes, util } from '@innodoc/client-misc'

import Card from './Card'

const ExampleCard = ({ attributes, content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={util.getNumberedTitle(t('content.example'), attributes)}
      cardType="example"
      icon={<EyeOutlined />}
      content={content}
      id={id}
    />
  )
}

ExampleCard.propTypes = {
  attributes: propTypes.attributeType.isRequired,
  content: propTypes.contentType.isRequired,
  id: PropTypes.string,
}

ExampleCard.defaultProps = {
  id: null,
}

export default ExampleCard
