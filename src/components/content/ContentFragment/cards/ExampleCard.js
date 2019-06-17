import React from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from '../../../../lib/i18n'
import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const ExampleCard = ({ content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={t('content.example')}
      cardType="example"
      icon="eye"
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
