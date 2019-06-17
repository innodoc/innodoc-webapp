import React from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from '../../../../lib/i18n'
import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const TestCard = ({ content, id }) => {
  const { t } = useTranslation()
  return (
    <Card
      title={t('content.test')}
      cardType="test"
      icon="edit"
      content={content}
      id={id}
    />
  )
}

TestCard.propTypes = {
  content: contentType.isRequired,
  id: PropTypes.string,
}

TestCard.defaultProps = {
  id: null,
}

export default TestCard
