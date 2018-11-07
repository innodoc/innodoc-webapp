import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const TestCard = ({ t, content }) => (
  <Card
    title={t('content.test')}
    cardType="test"
    icon="edit"
    content={content}
  />
)

TestCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(TestCard)
