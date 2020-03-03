import React from 'react'
import PropTypes from 'prop-types'
import { EyeOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { contentType } from '@innodoc/client-misc/src/propTypes'

import Card from './Card'

const ExampleCard = ({ content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={t('content.example')}
      cardType="example"
      icon={<EyeOutlined />}
      content={content}
      id={id}
    />
  )
}

ExampleCard.propTypes = {
  content: contentType.isRequired,
  id: PropTypes.string,
}

ExampleCard.defaultProps = {
  id: null,
}

export default ExampleCard
