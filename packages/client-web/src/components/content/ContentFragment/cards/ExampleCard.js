import React from 'react'
import PropTypes from 'prop-types'
import { EyeOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { attributeType, contentType } from '@innodoc/client-misc/src/propTypes'
import { getNumberedTitle } from '@innodoc/client-misc/src/util'

import Card from './Card'

const ExampleCard = ({ attributes, content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={getNumberedTitle(t('content.example'), attributes)}
      cardType="example"
      icon={<EyeOutlined />}
      content={content}
      id={id}
    />
  )
}

ExampleCard.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  id: PropTypes.string,
}

ExampleCard.defaultProps = {
  id: null,
}

export default ExampleCard
